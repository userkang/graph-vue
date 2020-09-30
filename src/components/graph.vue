<template>
  <div class="graph-content-wrap">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      ref="svg"
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
        v-if="graph"
        :style="{
          transform: `scale(${transform.scale}) translate3D(${transform.translateX}px, ${transform.translateY}px, 0)`,
          transformOrigin: 'center'
        }"
      >
        <Edge
          v-for="item in edges"
          :key="item.edgeId"
          :edge="item"
          @click.native="e => edgeClick(item.edgeId)"
          @contextMenu="showMenu"
        />
        <Node
          v-for="item in nodes"
          :key="item.nodeId"
          :node="item"
          :selectedNodes="selectedNodes"
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
        :d="brushPath"
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

  @Prop()
  nodeStyle!: INodeStyle

  componentState = ComponentListStore.state

  graph: any = null

  nodeInfo = {
    width: 190,
    height: 35
  }

  nodes: INodeType[] = []
  edges: IEdgeType[] = []
  selectedNodes: INodeType[] = []
  transform = {
    scale: 1,
    translateX: 0,
    translateY: 0
  }
  brushPath = ''

  get dragingInfo() {
    return this.componentState.dragingInfo
  }

  svgMouseDown(e: MouseEvent) {
    // this.graph.eventController.svgMouseDown(e)
  }

  mouseMove(e: MouseEvent) {
    // this.graph.eventController.mouseMove(e)
  }

  svgMouseUp(e: MouseEvent) {
    // this.graph.eventController.svgMouseUp(e)
  }

  mouseDownNode(e: MouseEvent, node: INodeType) {
    // this.graph.eventController.mouseDownNode(e, node)
  }

  mouseDownSlot(e: MouseEvent, node: INodeType) {
    // this.graph.eventController.mouseDownSlot(e, node)
  }

  mouseUpSlot(e: MouseEvent, node: INodeType) {
    // this.graph.eventController.mouseUpSlot(e, node)
  }

  edgeClick(edgeId: number) {
    // this.graph.eventController.edgeClick(edgeId)
  }

  mouseLeave(e: MouseEvent) {
    // 当鼠标离开画布时，手动触发画布 mouseup 事件
    // this.graph.eventController.mouseLeave(e)
  }

  mouseWheel(e: WheelEvent) {
    // this.graph.eventController.mouseWheel(e)
  }

  showMenu(e: MouseEvent, type: string, item: IEdgeType) {
    // this.graph.menuController.showMenu({
    //   x: e.x,
    //   y: e.y,
    //   type,
    //   item
    // })
  }

  handleDrop(e: DragEvent) {
    e.preventDefault()
    const { clientX: x, clientY: y } = e
    const posX = x - this.dragingInfo.offsetX * this.graph.getZoom()
    const posY = y - this.dragingInfo.offsetY * this.graph.getZoom()

    // 这块参数可以只传 nodeId, 其余节点信息后端存有
    this.graph.addNode({
      nodeId: posX + '' + posY,
      nodeName: this.dragingInfo.component.componentName,
      nodeDesc: this.dragingInfo.component.componentDesc,
      posX,
      posY
    })
  }

  mounted() {
    this.graph = new Graph({
      container: this.$refs.svg as SVGElement,
      drection: this.$attrs.drection,
      nodeInfo: {
        width: this.nodeInfo.width,
        height: this.nodeInfo.height
      },
      behavior: [
        'drag-svg',
        'drag-node',
        'click-select',
        'create-edge',
        'wheel-move',
        'wheel-zoom'
      ]
    })
    this.graph.data(this.data)

    this.initCustomHooks()
  }

  initCustomHooks() {
    const hooks = [
      'afteraddnode',
      'nodeselectchange',
      'aftertranslate',
      'afterzoom',
      'afteraddedge'
    ]
    hooks.forEach(hook => {
      this.graph.on(hook, (this as any)[hook])
    })
  }

  afteraddnode(item: INodeType) {
    this.nodes = this.graph.getNodes()
    console.log('afteraddnode', item)
  }

  afteraddedge(item: IEdgeType) {
    this.edges = this.graph.getEdges()
    console.log('afteraddedge', item)
  }

  nodeselectchange(nodes: INodeType[]) {
    this.selectedNodes = nodes
  }

  aftertranslate(x: number, y: number) {
    this.transform.translateX = x
    this.transform.translateY = y
  }

  afterzoom(zoom: number) {
    this.transform.scale = zoom
  }

  beforeDestroy() {
    this.graph.destroy()
  }
}
</script>

<style lang="scss" scoped>
.graph-content-wrap {
  // background: url('../assets/imgs/grid.svg') no-repeat center
  //   rgba(0, 10, 40, 0.9);
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
