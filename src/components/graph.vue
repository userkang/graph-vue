<template>
  <div class="graph-content-wrap">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      ref="graph"
      @mousedown="svgMouseDown"
      @mousemove="mouseMove"
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
        ref="transformDom"
        :style="{
          transform: `scale(${transform.scale}) translate3D(${transform.translateX}px, ${transform.translateY}px, 0)`,
          transformOrigin: 'center'
        }"
      >
        <Edge
          v-for="item in edges"
          :key="item.edgeId"
          :edge="item"
          :graph="graph"
          @click.native="e => edgeClick(item.edgeId)"
          @delete="deleteLine"
          @contextMenu="showMenu"
        />
        <Node
          v-for="item in nodes"
          :key="item.nodeId"
          :node="item"
          :graph="graph"
          @mouseDownNode="mouseDownNode"
          @mouseDownSlot="mouseDownSlot"
          @mouseUpSlot="mouseUpSlot"
          @contextMenu="showMenu"
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

        <NewEdge />
      </g>
      <path
        v-show="showSelectingBox"
        :d="selectBoxPath"
        style="fill: #4E73FF; stroke: #606BE1; stroke-width:1px; opacity:0.3"
      />
    </svg>
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import GraphStore from '@/stores/graph'
import { ComponentListStore } from '@/stores/component-list'
import Node from '@/components/node.vue'
import Edge from '@/components/edge.vue'
import NewEdge from '@/components/new-edge.vue'
import ToolBox from '@/components/tool-box.vue'
import Menu from '@/components/menu.vue'

import Graph from '@/controller/graph'

@Component({
  components: {
    NewEdge,
    Edge,
    Node,
    ToolBox,
    Menu
    // GraphGroupNode,
    // GraphGroup
  }
})
export default class GraphContent extends Vue {
  @Prop({
    required: true
  })
  data!: IGraphDataType

  @Prop({
    default: () => {
      return {
        width: 190,
        height: 35,
        rx: 2,
        ry: 2
      }
    }
  })
  nodeStyle!: INodeStyle

  componentState = ComponentListStore.state

  // 画布实例
  graph!: Graph

  nodeId = 0

  get nodes() {
    return this.graph.nodes
  }

  get edges() {
    return this.graph.edges
  }

  get dragingInfo() {
    return this.componentState.dragingInfo
  }

  get transform() {
    if (this.graph) {
      return this.graph.viewController.transform
    } else {
      return {
        scale: 1,
        translateX: 0,
        translateY: 0
      }
    }
  }

  get showSelectingBox() {
    if (this.graph) {
      return this.graph.eventController.showSelectingBox
    } else {
      return false
    }
  }

  get selectBoxPath() {
    if (this.graph) {
      return this.graph.eventController.selectBoxPath
    }
  }

  mouseDownNode(e: MouseEvent, node: INodeType) {
    this.graph.eventController.mouseDownNode(e, node)
  }

  mouseDownSlot(e: MouseEvent, node: INodeType) {
    this.graph.eventController.mouseDownSlot(e, node)
  }

  mouseUpSlot(e: MouseEvent, node: INodeType) {
    this.graph.eventController.mouseUpSlot(e, node)
  }

  edgeClick(edgeId: number) {
    this.graph.eventController.edgeClick(edgeId)
  }

  deleteLine() {
    this.graph.eventController.deleteLine()
  }

  svgMouseDown(e: MouseEvent) {
    console.log(e.currentTarget)
    this.graph.eventController.svgMouseDown(e)
  }

  mouseMove(e: MouseEvent) {
    this.graph.eventController.mouseMove(e)
  }

  svgMouseUp(e: MouseEvent) {
    this.graph.eventController.svgMouseUp(e)
  }

  mouseLeave(e: MouseEvent) {
    // 当鼠标离开画布时，手动触发画布 mouseup 事件
    this.graph.eventController.mouseLeave(e)
  }

  mouseWheel(e: WheelEvent) {
    this.graph.eventController.mouseWheel(e)
  }

  handleToolBox(e: MouseEvent) {
    this.graph.eventController.handleToolBox(e)
  }

  showMenu(e: MouseEvent, type: string, item: IEdgeType) {
    this.graph.menuController.showMenu({
      x: e.x,
      y: e.y,
      type,
      item
    })
  }

  handleDrop(e: DragEvent) {
    e.preventDefault()
    const { clientX: x, clientY: y } = e
    const posX = x - this.dragingInfo.offsetX * this.transform.scale
    const posY = y - this.dragingInfo.offsetY * this.transform.scale

    // 这块参数可以只传 nodeId, 其余节点信息后端存有
    this.graph.addNode({
      nodeId: this.nodeId++,
      nodeName: this.dragingInfo.component.componentName,
      nodeDesc: this.dragingInfo.component.componentDesc,
      posX,
      posY
    })
  }

  initGraph() {
    this.graph = new Graph({
      container: this.$refs.graph as SVGElement,
      rectInfo: this.nodeStyle,
      data: this.data
    })
  }

  mounted() {
    this.initGraph()
  }

  beforeDestroy() {
    this.graph.destroy()
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
