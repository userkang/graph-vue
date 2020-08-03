<template>
  <div class="graph-content-wrap">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      ref="graphContent"
      @click.capture="handleSvgClick"
      @mousedown="handleSvgMouseDown"
      @mousemove.capture="handleMouseMove"
      @mouseup.capture="handleMouseUp"
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
        <template>
          <GraphNode
            v-for="(item, index) in nodes"
            :key="index"
            :node="item"
            :fromNodeId="fromNodeId"
            :isNodeActive="isNodeActive(item.nodeId)"
            @clickNode="handleNodeClick"
            @clickSlot="handleSlotClick"
          />
        </template>

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

        <!-- <GraphEdge
          v-for="item in edges"
          :key="item.id"
          :edge="item"
          :isActiveEdge="activeEdgeId === item.id"
          :refresh="isRefreshEdge"
          @edgeClick="handleEdgeClick"
          @delete="deleteLine"
        /> -->

        <!-- <NewGraphEdge /> -->
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
import { INodeType } from '../../types/dag'
import { EdgeStore } from '@/stores/graph/edge'

@Component({
  components: {
    // EmptyGraph,
    // LoadingIcon,
    // ScalePanel,
    // NewGraphEdge,
    // GraphEdge,
    GraphNode
    // GraphGroupNode,
    // GraphGroup
  }
})
export default class GraphContent extends Vue {
  dagState = DagStore.state
  componentState = ComponentListStore.state
  svg!: HTMLElement
  transform = {
    scale: 1,
    translateX: 0,
    translateY: 0,
    offsetX: 0,
    offsetY: 0
  }
  // activeNode: INodeType[] = []
  isMouseDownNode = false
  isMouseDownSlot = false
  isMouseDownSvg = false
  startX = 0
  startY = 0
  moveX = 0
  moveY = 0
  fromNodeId = 0

  get nodes() {
    return this.dagState.dag.nodes
  }

  get edges() {
    return this.dagState.dag.edges
  }

  get dragingInfo() {
    return this.componentState.dragingInfo
  }

  get activeNode() {
    return this.dagState.activeNode
  }

  set activeNode(v: INodeType[]) {
    this.dagState.activeNode = v
  }

  handleNodeClick(e: MouseEvent, node: INodeType) {
    this.activeNode = [node]
    this.isMouseDownNode = true
    this.startX = e.clientX
    this.startY = e.clientY
  }

  handleSlotClick(e: MouseEvent, node: INodeType) {
    this.fromNodeId = node.nodeId
  }

  handleSvgClick(e: MouseEvent) {
    // event.stopPropagation();
    if ((e.target as SVGElement).tagName === 'svg') {
      // MenuTipsController.hide()
      // ActiveGraphController.show()
      // this.activeEdgeId = 0
      // this.lastNodeId = 0
    }
  }

  handleSvgMouseDown(e: MouseEvent) {
    this.isMouseDownSvg = true
    // this.moveX = event.clientX
    // this.moveY = event.clientY
  }

  async handleMouseMove(e: MouseEvent) {
    const { clientX: x, clientY: y } = e
    this.moveX = x - this.startX
    this.moveY = y - this.startY

    if (this.isMouseDownNode) {
      this.activeNode.forEach(item => {
        item.posX = item.posX + this.moveX
        item.posY = item.posY + this.moveY
      })
    } else if (this.isMouseDownSlot) {
      const posX = this.positionTransformX(x)
      const posY = this.positionTransformY(y)
      this.createNewLine(posX, posY)
    } else if (this.isMouseDownSvg) {
      this.transform.translateX = this.moveX + this.transform.translateX
      this.transform.translateY = this.moveY + this.transform.translateY
    }

    this.startX = x
    this.startY = y
  }

  async handleMouseUp(e: MouseEvent) {
    const { clientX: x, clientY: y } = e
    if (this.isMouseDownNode) {
      this.isMouseDownNode = false

      // 如果位置发生移动
      if (this.moveX || this.moveY) {
        await NodeStore.updateNodePosition(this.activeNode)
      } else {
        // 否则就是单纯的点击，这里写点击节点的处理逻辑，比如右侧参数面板
      }
    } else if (this.isMouseDownSlot) {
      this.isMouseDownSlot = false
      const el = (event as MouseEvent).target as SVGCircleElement
      if (el.tagName === 'circle') {
        if (status === 'enable') {
          const status = el.dataset.status
          if (status === 'enable') {
            const toNodeId = el.dataset.id
            await EdgeStore.addEdge({
              fromNodeId: this.fromNodeId,
              toNodeId: Number(toNodeId)
            })
          }
        }
      }
      CreateLineController.reset()
    } else if (this.isMouseDownSvg) {
      this.isMouseDownSvg = false
    }
  }

  preventDefaultContext(event: MouseEvent) {
    event.preventDefault()
  }

  handleMouseWheel(event: WheelEvent) {
    // this.handleScaleChange(event.deltaY > 0 ? 'shrink' : 'expand', 0.01)
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

  isNodeActive(id: number) {
    for (const item of this.activeNode) {
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
