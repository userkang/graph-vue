<template>
  <div class="graph-content-wrap">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      ref="graphContent"
      @mousedown="svgMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="svgMouseUp"
      @dragover="e => e.preventDefault()"
      @drop="handleDrop"
      @contextmenu="e => e.preventDefault()"
      @mousewheel="mouseWheel"
      @mouseleave="mouseLeave"
      width="100%"
      height="100%"
    >
      <g
        :style="{
          transform: `scale(${transform.scale}) translate3D(${transform.translateX}px, ${transform.translateY}px, 0)`,
          transformOrigin: `center`
        }"
      >
        <GraphEdge
          v-for="item in edges"
          :key="item.edgeId"
          :edge="item"
          :isActiveEdge="activeEdgeId === item.edgeId"
          :rectInfo="rectInfo"
          @click.native="e => edgeClick(item.edgeId)"
          @delete="deleteLine"
        />
        <GraphNode
          v-for="item in nodes"
          :key="item.nodeId"
          :node="item"
          :fromNodeId="fromNodeId"
          :rectInfo="rectInfo"
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
      <path
        v-show="showSelectingBox"
        :d="selectBoxPath"
        style="fill: #4E73FF; stroke: #606BE1; stroke-width:1px; opacity:0.3"
      />
    </svg>
    <ToolBox @click="handleToolBox" :isSelecting="isSelecting" />
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
import ToolBox from '@/components/graph/tool-box.vue'
import { INodeType, IEdgeType } from '../../types/dag'
import { EdgeStore } from '@/stores/graph/edge'
import {
  isFullScreen,
  requestFullScreen,
  cancelFullScreen
} from '@/assets/js/utils'

@Component({
  components: {
    NewGraphEdge,
    GraphEdge,
    GraphNode,
    ToolBox
    // GraphGroupNode,
    // GraphGroup
  }
})
export default class GraphContent extends Vue {
  // 画布配置项
  rectInfo = {
    width: 190,
    height: 35,
    rx: 2,
    ry: 2
  }

  dagState = DagStore.state
  componentState = ComponentListStore.state
  // 画布文档对象
  svg!: HTMLElement
  svgInfo = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }
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
  isSelecting = false
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
  // 框选操作框路径
  selectBoxPath = ''
  showSelectingBox = false

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
    this.isMouseDownNode = true

    this.activeNode = node
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
    await EdgeStore.addEdge({
      fromNodeId: this.fromNodeId,
      toNodeId: node.nodeId
    })
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

  svgMouseDown(e: MouseEvent) {
    console.log('svgMouseDown')

    this.originX = e.x
    this.originY = e.y

    if (this.isSelecting) {
      this.showSelectingBox = true
    } else {
      this.isMouseDownSvg = true
    }
  }

  async handleMouseMove(e: MouseEvent) {
    const { x, y } = e
    this.moveX = x - this.startX
    this.moveY = y - this.startY

    if (this.isMouseDownNode) {
      this.moveNode.forEach(item => {
        item.posX += this.moveX / this.transform.scale
        item.posY += this.moveY / this.transform.scale
      })
    } else if (this.isMouseDownSlot) {
      const posX = this.positionTransformX(x)
      const posY = this.positionTransformY(y)
      EdgeStore.setNewLineMove(posX, posY)
    } else if (this.isSelecting && this.showSelectingBox) {
      const startX = this.originX - this.svgInfo.x
      const startY = this.originY - this.svgInfo.y
      const endX = x - this.svgInfo.x
      const endY = y - this.svgInfo.y

      this.selectBoxPath = `M${startX},${startY}H${endX}V${endY}H${startX}Z`
      this.checkSelected(this.originX, this.originY, x, y)
    } else if (this.isMouseDownSvg) {
      this.transform.translateX += this.moveX / this.transform.scale
      this.transform.translateY += this.moveY / this.transform.scale
    }

    this.startX = x
    this.startY = y
  }

  async svgMouseUp(e: MouseEvent) {
    console.log('svgMouseUp')
    e.stopPropagation()
    const { x, y } = e
    // 鼠标是否发生位移
    const isMove = x - this.originX || y - this.originY

    if (this.isMouseDownNode) {
      this.isMouseDownNode = false
      if (isMove) {
        const moveNode = [...this.selectedNode, this.activeNode]
        await NodeStore.updateNodePosition(moveNode)
      } else {
        // 否则就是单纯的点击操作
        this.selectedNode = [this.activeNode]
      }
    } else if (this.isMouseDownSlot) {
      this.isMouseDownSlot = false
      EdgeStore.setResetLine()
    } else if (this.isSelecting && this.showSelectingBox) {
      this.isSelecting = false
      this.showSelectingBox = false
      this.selectBoxPath = ''
    } else if (this.isMouseDownSvg) {
      this.isMouseDownSvg = false
      if (!isMove) {
        this.activeEdgeId = 0
        this.selectedNode = []
      }
    }
  }

  checkSelected(startX: number, startY: number, endX: number, endY: number) {
    // 处理不同方向框选的情况
    // 从左上->右下，不要交换
    const range = {
      startX,
      startY,
      endX,
      endY
    }
    // 左下->右上
    if (endX > startX && endY < startY) {
      range.startY = endY
      range.endY = startY
    }
    // 右上->左下
    if (endX < startX && endY > startY) {
      range.startX = endX
      range.endX = startX
    }
    // 右下->左上
    if (endX < startX && endY < startY) {
      range.startX = endX
      range.startY = endY
      range.endX = startX
      range.endY = startY
    }

    this.selectedNode = this.nodes.filter(item => {
      return this.checkNodeRange(item, range)
    })
  }

  checkNodeRange(
    item: INodeType,
    range: { startX: number; startY: number; endX: number; endY: number }
  ) {
    if (
      item.posY + this.rectInfo.height <
      this.positionTransformY(range.startY)
    ) {
      return false
    } else if (item.posY > this.positionTransformY(range.endY)) {
      return false
    } else if (
      item.posX + this.rectInfo.width <
      this.positionTransformX(range.startX)
    ) {
      return false
    } else if (item.posX > this.positionTransformX(range.endX)) {
      return false
    } else {
      return true
    }
  }

  mouseLeave(e: MouseEvent) {
    // 当鼠标离开画布时，手动触发画布 mouseup 事件
    this.svgMouseUp(e)
  }

  mouseWheel(e: WheelEvent) {
    e.preventDefault()
    if (e.deltaX) {
      this.transform.translateX -= e.deltaX
    }
    if (e.deltaY) {
      this.transform.translateY -= e.deltaY
    }
  }

  handleToolBox(e: MouseEvent) {
    const id = (e.target as HTMLElement).id
    switch (id) {
      case 'expand':
        this.expand()
        break
      case 'shrink':
        this.shrink()
        break
      case 'reset':
        this.reset()
        break
      case 'select':
        this.select()
        break
      case 'fullscreen':
        this.fullscreen()
        break
    }
  }

  expand() {
    if (this.transform.scale < 2) {
      this.transform.scale += 0.1
      this.caculateOffset()
    }
  }

  shrink() {
    if (this.transform.scale > 0.4) {
      this.transform.scale -= 0.1
      this.caculateOffset()
    }
  }

  select() {
    this.isSelecting = !this.isSelecting
  }

  reset() {
    this.transform.scale = 1
    this.transform.translateX = 0
    this.transform.translateY = 0
    this.transform.offsetX = 0
    this.transform.offsetY = 0
  }

  fullscreen() {
    if (isFullScreen()) {
      cancelFullScreen()
    } else {
      requestFullScreen(document.documentElement)
    }
  }

  caculateOffset() {
    this.transform.offsetX =
      (this.svgInfo.width * (this.transform.scale - 1)) / 2
    this.transform.offsetY =
      (this.svgInfo.height * (this.transform.scale - 1)) / 2
  }

  async handleKeyUp(e: KeyboardEvent) {
    e.stopPropagation()
    const tagName = (e.target as HTMLBodyElement).tagName
    if (tagName === 'BODY') {
      if (['Delete', 'Backspace'].includes(e.key)) {
        if (this.activeEdgeId) {
          await EdgeStore.deleteEdge(this.activeEdgeId)
          this.activeEdgeId = 0
        }
        if (this.selectedNode.length === 1) {
          await NodeStore.deleteNode(this.selectedNode[0].nodeId)
          this.selectedNode = []
        }
      }
    }
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
    const posX = originValue - this.svgInfo.x
    return (
      (posX + this.transform.offsetX) / this.transform.scale -
      this.transform.translateX
    )
  }

  positionTransformY(originValue: number) {
    const posY = originValue - this.svgInfo.y
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

  handleResize() {
    const bounding = this.svg.getBoundingClientRect()
    this.svgInfo = {
      x: bounding.x,
      y: bounding.y,
      width: bounding.width,
      height: bounding.height
    }
  }

  mounted() {
    this.svg = this.$refs.graphContent as HTMLElement
    this.handleResize()
    document.addEventListener('keydown', this.handleKeyUp, true)
    window.addEventListener('resize', this.handleResize, true)
  }

  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyUp)
    window.removeEventListener('resize', this.handleResize)
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
