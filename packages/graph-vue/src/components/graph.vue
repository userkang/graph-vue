<template>
  <div class="graph-content-wrap">
    <div
      class="graph-content-wrap"
      ref="svg"
      @dragover="e => e.preventDefault()"
      @drop="handleDrop"
      @contextmenu="e => e.preventDefault()"
    >
      <!-- 注释部分为自定义模版部分，核心库自带渲染层，如无自定义需求，可以不关注 -->
      <!-- <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <g
          :style="{
            transform: `scale(${transform.scale}) translate(${transform.translateX}px, ${transform.translateY}px)`,
            transformOrigin: 'center'
          }"
          v-if="graph"
        >
          <Edge v-for="item in edges" :key="item.edgeId" :edge="item" />
          <Node v-for="item in nodes" :key="item.nodeId" :node="item" />
          <NewEdge />
        </g>
        <path
          :d="brushPath"
          style="fill: #4E73FF; stroke: #606BE1; stroke-width:1px; opacity:0.3"
        />
      </svg> -->
    </div>

    <ToolBox v-if="graph" />
    <Menu v-if="graph" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ComponentListStore } from '@/stores/component-list'
import { GraphConfigStore } from '@/stores/graph-config'
import GraphStore from '@/stores/graph'
import Node from '@/components/node.vue'
import Edge from '@/components/edge.vue'
import NewEdge from '@/components/new-edge.vue'
import ToolBox from '@/components/tool-box.vue'
import Menu from '@/components/menu.vue'
import {
  Graph,
  IDataModel,
  INodeModel,
  IEdgeModel,
  INode,
  IEdge
} from '@datafe/graph-core'

@Component({
  components: {
    NewEdge,
    Edge,
    Node,
    ToolBox,
    Menu
  }
})
export default class GraphContent extends Vue {
  componentState = ComponentListStore.state
  configState = GraphConfigStore.state

  graph: Graph = null as any

  nodeInfo = {
    width: 190,
    height: 35
  }

  nodes = []
  edges = []

  transform = {
    scale: 1,
    translateX: 0,
    translateY: 0
  }
  isBrushing = false
  brushPath = ''
  createEdge = {}

  get dragingInfo() {
    return this.componentState.dragingInfo
  }

  handleDrop(e: DragEvent) {
    e.preventDefault()
    const x = e.x - this.dragingInfo.offsetX * this.graph.getZoom()
    const y = e.y - this.dragingInfo.offsetY * this.graph.getZoom()
    const point = this.graph.getPointByClient(x, y)

    this.graph.addNode({
      label: this.dragingInfo.component.componentName,
      x: point.x,
      y: point.y,
      slots: [{ type: 'in' }, { type: 'out' }, { type: 'out' }]
    })
  }

  mounted() {
    this.init()
  }

  init() {
    this.graph = new Graph({
      container: this.$refs.svg as HTMLElement,
      drection: this.configState.drection,
      nodeInfo: {
        width: this.nodeInfo.width,
        height: this.nodeInfo.height
      },
      action: this.configState.action
    })
    this.initCustomHooks()
    this.graph.data(this.configState.data)
    GraphStore.state.graph = this.graph
  }

  initCustomHooks() {
    const hooks = {
      afteraddnode: 'afteraddnode',
      afteraddedge: 'afteraddedge',
      nodeselectchange: 'nodeselectchange',
      edgeselectchange: 'edgeselectchange',
      aftertranslate: 'aftertranslate',
      afterzoom: 'afterzoom',
      brushing: 'brushing',
      showmenu: 'showmenu',
      afterdeletenode: 'afterdeletenode',
      afterdeleteedge: 'afterdeleteedge',
      afterdragnode: 'afterDragNode',
      keyup: 'handleKeyUp',
      datachange: 'refreshGraph'
    }

    Object.keys(hooks).forEach(key => {
      const hook = (hooks as any)[key]
      this.graph.on(key, (this as any)[hook])
    })
  }

  brushing(path: string) {
    this.brushPath = path
  }

  refreshGraph() {
    this.nodes = this.graph.getNodes()
    this.edges = this.graph.getEdges()
    const nodes = this.nodes.map(item => item.model)
    const edges = this.edges.map(item => item.model)

    this.configState.data = { nodes, edges }
  }

  afterDragNode(nodes: INodeModel[]) {
    console.log('afterdragnode', nodes)
  }

  afteraddnode(item: INodeModel) {
    console.log('afteraddnode', item)
  }

  afteraddedge(item: IEdgeModel) {
    console.log('afteraddedge', item)
  }

  afterdeletenode(item: INodeModel) {
    console.log('afterdeletenode', item)
  }

  afterdeleteedge(item: IEdgeModel) {
    console.log('afterdeleteedge', item)
  }

  nodeselectchange(nodes: INodeModel[]) {
    console.log('nodeselectchange', nodes)
  }

  edgeselectchange(edges: IEdgeModel[]) {
    console.log('edgeselectchange', edges)
  }

  aftertranslate(x: number, y: number) {
    this.transform.translateX = x
    this.transform.translateY = y
  }

  afterzoom(zoom: number) {
    this.transform.scale = zoom
  }

  handleKeyUp(e: KeyboardEvent) {
    e.stopPropagation()
    const tagName = (e.target as HTMLBodyElement).tagName
    if (tagName === 'BODY') {
      if (['Delete', 'Backspace'].includes(e.key)) {
        const selectedNodes = this.graph.findNodeByState('selected')
        const selectedEdges = this.graph.findEdgeByState('selected')
        if (selectedEdges.length) {
          this.graph.deleteEdge(selectedEdges[0].id)
        }
        if (selectedNodes.length) {
          const edges = []
          const nodes = []
          selectedNodes.forEach(item => {
            item.edges.forEach(edge => {
              edges.push(edge.model)
            })
            nodes.push(item.model)
            this.graph.deleteNode(item.id, false)
          })
          this.graph.pushStack('deleteNode', { nodes, edges })
        }
      }
    }
  }

  beforeDestroy() {
    this.graph.destroy()
  }

  @Watch('configState.drection')
  handleConfigChange(v: string) {
    this.graph.set('drection', v)
    this.graph.data(this.configState.data)
    this.graph.layout()
  }

  @Watch('configState.action')
  handleActionChange(v: string[]) {
    this.graph.removeAction()
    this.graph.addAction(v)
  }
}
</script>

<style lang="scss" scoped>
.graph-content-wrap {
  background: #242424;
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
