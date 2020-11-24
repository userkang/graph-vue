<template>
  <div class="graph-content-wrap">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      ref="svg"
      @dragover="e => e.preventDefault()"
      @drop="handleDrop"
      @contextmenu="e => e.preventDefault()"
      width="100%"
      height="100%"
    >
      <g
        :style="{
          transform: `scale(${transform.scale}) translate3D(${transform.translateX}px, ${transform.translateY}px, 0)`,
          transformOrigin: 'center'
        }"
        v-if="graph"
      >
        <Edge v-for="item in edges" :key="item.edgeId" :edge="item" />
        <Node v-for="item in nodes" :key="item.nodeId" :node="item" />
        <NewEdge :createEdge="createEdge" />
      </g>
      <path
        :d="brushPath"
        style="fill: #4E73FF; stroke: #606BE1; stroke-width:1px; opacity:0.3"
      />
    </svg>

    <ToolBox
      v-if="graph"
      :isBrushing="isBrushing"
      @clickBrush="
        value => {
          this.isBrushing = value
        }
      "
    />
    <Menu v-if="graph"></Menu>
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
import { calculateCurve } from '@/assets/js/utils'
import Graph, { IDataModel, INodeModel } from '@datafe/graph-core'

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
  @Prop({
    required: true
  })
  data!: IDataModel

  componentState = ComponentListStore.state

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
      nodeId: Number(x + '' + y),
      nodeName: this.dragingInfo.component.componentName,
      x: point.x,
      y: point.y,
      slots: [
        { slotId: 1, type: 'in' },
        { slotId: 2, type: 'out' },
        { slotId: 3, type: 'out' }
      ]
    })
  }

  mounted() {
    this.graph = new Graph({
      container: this.$refs.svg as HTMLElement,
      drection: 'TB',
      nodeInfo: {
        width: this.nodeInfo.width,
        height: this.nodeInfo.height
      },
      action: [
        'drag-svg',
        'drag-node',
        'click-select',
        'create-edge',
        'wheel-move',
        'wheel-zoom',
        'brush-select'
      ]
    })
    this.initCustomHooks()
    this.graph.data(this.data)
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
      mouseup: 'mouseup',
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

  mouseup() {
    if (this.graph.getBrushing()) {
      this.graph.setBrushing(false)
      this.isBrushing = false
    }
  }

  refreshGraph() {
    this.nodes = this.graph.getNodes()
    this.edges = this.graph.getEdges()
  }

  afterDragNode(nodes: INodeModel[]) {
    // console.log('drag', nodes)
  }

  afteraddnode(item: any) {
    this.nodes = this.graph.getNodes()
  }

  afteraddedge(item: any) {
    this.edges = this.graph.getEdges()
  }

  afterdeletenode() {
    this.nodes = this.graph.getNodes()
    this.edges = this.graph.getEdges()
  }

  afterdeleteedge() {
    this.edges = this.graph.getEdges()
  }

  nodeselectchange(nodes: INodeType[]) {
    this.nodes = this.graph.getNodes()
  }

  edgeselectchange() {
    this.edges = this.graph.getEdges()
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
}
</script>

<style lang="scss" scoped>
.graph-content-wrap {
  background: url('../assets/imgs/grid.svg') no-repeat center rgba(20, 40, 60);
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
