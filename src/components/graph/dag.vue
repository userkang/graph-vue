<template>
  <div class="graph-content-wrap">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      ref="graphContent"
      @mousedown="svgMouseDown"
      @mousemove.capture="handleMouseMove"
      @mouseup="svgMouseUp"
      @contextmenu.capture="preventDefaultContext"
      @mousewheel="handleMouseWheel"
      @dragover="handleDragOver"
      @drop="handleDrop"
      width="100%"
      height="100%"
    >
      <g
        :style="{
          transform: `scale(${transform.scale}) translate3D(${transform.translateX}px, ${transform.translateY}px, 0)`
        }"
      >
        <GraphEdge
          v-for="item in edges"
          :key="item.edgeId"
          :edge="item"
          :isActiveEdge="activeEdgeId === item.edgeId"
          @click.native="e => handleEdgeClick(item.edgeId)"
          @delete="deleteLine"
        />
        <GraphNode
          v-for="item in nodes"
          :key="item.nodeId"
          :node="item"
          :fromNodeId="fromNodeId"
          :isNodeActive="isNodeActive(item.nodeId)"
          @mouseDownNode="mouseDownNode"
          @mouseDownSlot="mouseDownSlot"
          @mouseUpSlot="mouseUpSlot"
        />

        <!-- <template v-if="nodeGroups">
          <GraphGroup
            v-for="(group, index) in nodeGroups"
            :key="group.id"
            :group="group"
            :index="index"
            :groupPosition="groupPosition"
            :fromNodeId="fromNodeId"
            @mousedown="setDragGroupStart"
            @handleNodeClick="handleNodeClick"
            @handleDoubleClick="handleDoubleClick"
          />
        </template> -->

        <NewGraphEdge />
      </g>
      <!-- <path
        id="zoom_area"
        :d="pathRect"
        style="fill: #4E73FF; stroke: #606BE1; stroke-width:1px; opacity:0.3"
      /> -->
    </svg>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { DagStore } from '@/stores/graph/dag'
import { ComponentListStore } from '@/stores/graph/component-list'
import { NodeStore } from '@/stores/graph/node'
import GraphNode from '@/components/graph/graph-node.vue'
import GraphEdge from '@/components/graph/graph-edge.vue'
import NewGraphEdge from '@/components/graph/new-graph-edge.vue'
import { INodeType, IEdgeType } from '../../types/dag'
import { EdgeStore } from '@/stores/graph/edge'

@Component({
  components: {
    // EmptyGraph,
    // LoadingIcon,
    // ScalePanel,
    NewGraphEdge,
    GraphEdge,
    GraphNode
    // GraphGroupNode,
    // GraphGroup
  }
})
export default class GraphContent extends Vue {
  dagState = DagStore.state
  componentState = ComponentListStore.state
  // 画布文档对象
  svg!: HTMLElement
  // 画布变换相关值
  transform = {
    scale: 1,
    translateX: 0,
    translateY: 0,
    offsetX: 0,
    offsetY: 0
  }
  // 当前拖动节点
  activeNode!: INodeType
  // 当前被选中节点
  selectedNode: INodeType[] = []
  // 移动的节点
  moveNode: INodeType[] = []
  isMouseDownNode = false
  isMouseDownSlot = false
  isMouseDownSvg = false
  // 移动前的坐标
  originX = 0
  originY = 0
  // 移动时动态起始值
  startX = 0
  startY = 0
  // 移动时动态距离值
  moveX = 0
  moveY = 0
  // 连线起始节点
  fromNodeId = 0
  // 当前选中连线
  activeEdgeId = 0

  get nodes() {
    return this.dagState.dag.nodes
  }

  get edges() {
    return this.dagState.dag.edges
  }

  get dragingInfo() {
    return this.componentState.dragingInfo
  }

  mouseDownNode(e: MouseEvent, node: INodeType) {
    console.log('mouseDownNode')
    this.activeNode = node
    this.isMouseDownNode = true
    this.activeEdgeId = 0
    this.startX = this.originX = e.x
    this.startY = this.originY = e.y

    // 判断当前正在移动节点是否被选中
    this.checkActiveNodeIsSelected()
  }

  mouseDownSlot(e: MouseEvent, node: INodeType) {
    console.log('mouseDownSlot')
    this.isMouseDownSlot = true
    this.fromNodeId = node.nodeId
  }

  async mouseUpSlot(e: MouseEvent, node: INodeType) {
    console.log('mouseUpSlot')
    this.isMouseDownSlot = false
    // const el = e.target as SVGCircleElement
    // if (el.tagName === 'circle') {
    // const status = el.dataset.status
    // if (status === 'enable') {
    // const toNodeId = el.dataset.id
    await EdgeStore.addEdge({
      fromNodeId: this.fromNodeId,
      toNodeId: node.nodeId
    })
    // }
    // }
    EdgeStore.setResetLine()
  }

  edgeClick(edgeId: number) {
    this.activeEdgeId = edgeId
    this.selectedNode = []
  }

  async deleteLine() {
    await EdgeStore.deleteEdge(this.activeEdgeId)
    this.activeEdgeId = 0
  }

  // svgClick(e: MouseEvent) {
  //   console.log('svgClick')
  //   // event.stopPropagation();
  //   if ((e.target as SVGElement).tagName === 'svg') {
  //     // MenuTipsController.hide()
  //     // ActiveGraphController.show()
  //     this.activeEdgeId = 0
  //     this.selectedNode = []
  //   }
  // }

  svgMouseDown(e: MouseEvent) {
    console.log('handleSvgMouseDown')
    this.isMouseDownSvg = true
    // this.moveX = event.clientX
    // this.moveY = event.clientY
  }

  async handleMouseMove(e: MouseEvent) {
    const { x: x, y: y } = e
    this.moveX = x - this.startX
    this.moveY = y - this.startY

    if (this.isMouseDownNode) {
      this.moveNode.forEach(item => {
        item.posX += this.moveX
        item.posY += this.moveY
      })
    } else if (this.isMouseDownSlot) {
      const posX = this.positionTransformX(x)
      const posY = this.positionTransformY(y)
      EdgeStore.setNewLineMove(posX, posY)
    } else if (this.isMouseDownSvg) {
      this.transform.translateX += this.moveX
      this.transform.translateY += this.moveY
    }

    this.startX = x
    this.startY = y
  }

  async svgMouseUp(e: MouseEvent) {
    console.log('svgMouseUp')
    e.stopPropagation()
    const { clientX: x, clientY: y } = e
    if (this.isMouseDownNode) {
      this.isMouseDownNode = false
      // 如果位置发生移动
      if (x - this.originX || y - this.originY) {
        const moveNode = [...this.selectedNode, this.activeNode]
        await NodeStore.updateNodePosition(moveNode)
      } else {
        // 否则就是单纯的点击操作
        this.selectedNode = [this.activeNode]
      }
    } else if (this.isMouseDownSlot) {
      this.isMouseDownSlot = false
      EdgeStore.setResetLine()
    } else if (this.isMouseDownSvg) {
      this.isMouseDownSvg = false
      this.activeEdgeId = 0
      this.selectedNode = []
    }
  }

  handleMouseWheel(e: WheelEvent) {
    e.preventDefault()
    if (e.deltaX) {
      this.transform.translateX -= e.deltaX
    }
    if (e.deltaY) {
      this.transform.translateY -= e.deltaY
    }
  }

  preventDefaultContext(event: MouseEvent) {
    event.preventDefault()
  }

  handleDragOver(event: DragEvent) {
    // 阻止默认动作以启用drop
    event.preventDefault()
  }

  async handleDrop(e: DragEvent) {
    e.preventDefault()
    const { clientX: x, clientY: y } = e
    const posX = this.positionTransformX(x) - this.dragingInfo.offsetX
    const posY = this.positionTransformY(y) - this.dragingInfo.offsetY

    // 这块参数可以只传 nodeId, 其余节点信息后端存有
    NodeStore.addNode({
      nodeId: this.dragingInfo.component.componentId,
      nodeName: this.dragingInfo.component.componentName,
      nodeDesc: this.dragingInfo.component.componentDesc,
      posX,
      posY
    })
  }

  positionTransformX(originValue: number) {
    const posX = originValue - this.svg.getBoundingClientRect().x
    return (
      (posX + this.transform.offsetX) / this.transform.scale -
      this.transform.translateX
    )
  }

  positionTransformY(originValue: number) {
    const posY = originValue - this.svg.getBoundingClientRect().y
    return (
      (posY + this.transform.offsetY) / this.transform.scale -
      this.transform.translateY
    )
  }

  checkActiveNodeIsSelected() {
    this.moveNode = [this.activeNode]
    // 来确保移动节点独立于选中逻辑，判断当前正在移动节点是否被选中
    if (this.isNodeActive(this.activeNode.nodeId)) {
      this.moveNode = this.selectedNode
    }
  }

  isNodeActive(id: number) {
    for (const item of this.selectedNode) {
      if (item.nodeId === id) {
        return true
      }
    }

    return false
  }

  mounted() {
    this.svg = this.$refs.graphContent as HTMLElement
  }
}
</script>

<style lang="scss" scoped>
.graph-content-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
  .loading-wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fff;
  }
}
.line {
  width: 100%;
  height: 1px;
  background: #d9dadd;
  position: absolute;
  top: 43px;
}
</style>
