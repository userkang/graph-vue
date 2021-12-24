<template>
  <div class="graph-main">
    <div
      class="graph-content-wrap"
      ref="svg"
      @dragover="e => e.preventDefault()"
      @drop="handleDrop"
      @contextmenu="e => e.preventDefault()"
    >
      <!-- 注释部分为自定义模版部分，核心库自带渲染层，如无自定义需求，可以不关注 -->
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <Arrow ref="arrow" />
        <g
          :style="{
            transform: `scale(${transform.scale}) translate(${transform.translateX}px, ${transform.translateY}px)`,
            transformOrigin: 'center'
          }"
          v-if="graph"
        >
          <Edge v-for="item in edges" :key="item.id" :edge="item">
            <slot name="edge" :edge="item" :graph="graph"></slot>
          </Edge>
          <Node v-for="item in nodes" :key="item.id" :node="item">
            <slot name="node" :node="item" :graph="graph"></slot>
            <!-- <slot slot="port">
              <Port v-for="slot in item.slots" :key="slot.id" :item="slot">
                <slot name="port" :port="slot"></slot>
              </Port>
            </slot> -->
          </Node>
          <NewEdge />
        </g>
        <path
          :d="brushPath"
          style="
            fill: #4e73ff;
            stroke: #606be1;
            stroke-width: 1px;
            opacity: 0.3;
          "
        />
      </svg>
    </div>
    <div v-if="graph">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
// import { ComponentListStore } from '@/stores/component-list'
// import { GraphConfigStore } from '@/stores/graph-config'
// import GraphStore from '@/stores/graph'
import Node from './node.vue'
import Edge from './edge.vue'
import NewEdge from './new-edge.vue'
import ToolBox from './tool-box.vue'
import Menu from './menu.vue'
import Minimap from './minimap.vue'
import Arrow from './arrow.vue'
import Port from './port.vue'
import { Graph, IGraphConfig, IDataModel } from '@datafe/graph-core'

@Component({
  components: {
    Minimap,
    NewEdge,
    Edge,
    Node,
    ToolBox,
    Menu,
    Arrow,
    Port
  }
})
export default class GraphContent extends Vue {
  @Prop({ default: 'TB' })
  direction: IGraphConfig['direction']

  @Prop({ default: () => [], type: Array })
  action: Array<string>

  @Prop({
    default: () => {
      return { nodes: [], edges: [] }
    },
    type: Object
  })
  data: IDataModel

  // componentState = ComponentListStore.state
  // configState = GraphConfigStore.state
  graph: Graph = null as any

  nodes = []
  edges = []

  transform = {
    scale: 1,
    translateX: 0,
    translateY: 0
  }
  brushPath = ''

  // get dragingInfo() {
  //   return this.componentState.dragingInfo
  // }

  handleDrop(e: DragEvent) {
    this.$emit('drop', e)
  }

  mounted() {
    this.init()
    console.log(this.$scopedSlots)
  }

  init() {
    this.graph = new Graph({
      container: this.$refs.svg as HTMLElement,
      direction: this.direction,
      nodeInfo: {
        width: 180,
        height: 40
      },
      action: this.action
    })

    this.initCustomHooks()

    this.graph.data(this.data)
    // GraphStore.state.graph = this.graph
  }

  initCustomHooks() {
    const hooks = [
      'afteraddnode',
      'afteraddedge',
      'nodeselectchange',
      'edgeselectchange',
      'aftertranslate',
      'afterzoom',
      'brushing',
      'afterdeletenode',
      'afterdeleteedge',
      'afterdragnode',
      'keyup',
      'datachange'
    ]

    hooks.forEach(hook => {
      this.graph.on(hook, (...arg) => {
        this.$emit(hook, arg)
      })
    })

    this.graph.on('datachange', this.refreshGraph)
    this.graph.on('aftertranslate', this.aftertranslate)
    this.graph.on('afterzoom', this.afterzoom)
    this.graph.on('brushing', this.brushing)
  }

  brushing(path: string) {
    this.brushPath = path
  }

  refreshGraph() {
    this.nodes = this.graph.getNodes()
    this.edges = this.graph.getEdges()
    // this.configState.data = this.graph.getData()
  }

  // afterDragNode(nodes: INodeModel[]) {
  //   console.log('afterdragnode', nodes)
  // }

  // afteraddnode(item: INodeModel) {
  //   console.log('afteraddnode', item)
  // }

  // afteraddedge(item: IEdgeModel) {
  //   console.log('afteraddedge', item)
  // }

  // afterdeletenode(item: INodeModel) {
  //   console.log('afterdeletenode', item)
  // }

  // afterdeleteedge(item: IEdgeModel) {
  //   console.log('afterdeleteedge', item)
  // }

  // nodeselectchange(nodes: INodeModel[]) {
  //   console.log('nodeselectchange', nodes)
  // }

  // edgeselectchange(edges: IEdgeModel[]) {
  //   console.log('edgeselectchange', edges)
  // }

  aftertranslate(x: number, y: number) {
    this.transform.translateX = x
    this.transform.translateY = y
  }

  afterzoom(zoom: number) {
    this.transform.scale = zoom
  }

  // handleKeyUp(e: KeyboardEvent) {
  //   e.stopPropagation()
  //   const tagName = (e.target as HTMLBodyElement).tagName
  //   if (tagName === 'BODY') {
  //     if (['Delete', 'Backspace'].includes(e.key)) {
  //       const selectedNodes = this.graph.findNodeByState('selected')
  //       const selectedEdges = this.graph.findEdgeByState('selected')
  //       if (selectedEdges.length) {
  //         this.graph.deleteEdge(selectedEdges[0].id)
  //       }
  //       if (selectedNodes.length) {
  //         const edges = []
  //         const nodes = []
  //         selectedNodes.forEach(item => {
  //           item.edges.forEach(edge => {
  //             edges.push(edge.model)
  //           })
  //           nodes.push(item.model)
  //           this.graph.deleteNode(item.id, false)
  //         })
  //         this.graph.pushStack('deleteNode', { nodes, edges })
  //       }
  //     }
  //   }
  // }

  beforeDestroy() {
    this.graph.destroy()
  }

  // @Watch('configState.direction')
  // handleConfigChange(v: string) {
  //   this.graph.set('direction', v)
  //   this.graph.data(this.configState.data)
  //   this.graph.layout()
  // }

  // @Watch('configState.action')
  // handleActionChange(v: string[]) {
  //   this.graph.removeAction()
  //   this.graph.addAction(v)
  // }
}
</script>

<style lang="scss" scoped>
$edge-color: #d1d1dd;
$select-color: #4150f6;
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
.graph-main {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
