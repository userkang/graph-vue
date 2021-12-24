<template>
  <div class="graph-main">
    <div
      class="graph-content-wrap"
      ref="svg"
      @dragover="(e) => e.preventDefault()"
      @drop="handleDrop"
      @contextmenu="(e) => e.preventDefault()"
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
            transformOrigin: 'center',
          }"
          v-if="graph"
        >
          <Edge
            class="edge"
            ref="edge"
            v-for="item in edges"
            :key="item.id"
            :edge="item"
          >
            <slot
              v-if="hasEdgeSlot"
              name="edge"
              :edge="item"
              :graph="graph"
            ></slot>
          </Edge>
          <Node
            ref="node"
            name="node"
            v-for="item in nodes"
            :key="item.id"
            :node="item"
          >
            <slot
              v-if="hasNodeSlot"
              name="node"
              :node="item"
              :graph="graph"
            ></slot>
            <slot slot="port">
              <Port v-for="slot in item.slots" :key="slot.id" :item="slot">
                <slot v-if="hasPortSlot" name="port" :port="slot"></slot>
              </Port>
            </slot>
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

    <ToolBox v-if="graph" />
    <Menu v-if="graph" />
    <Minimap :graph="graph" v-if="graph && minimap" />
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
import Minimap from '@/components/minimap.vue'
import Arrow from '@/components/arrow.vue'
import { Graph, IDataModel, INodeModel, IEdgeModel } from '@datafe/graph-core'
import { isIDataModel } from '../../../graph-core/src/util/utils'
import Port from '@/components/port.vue'
import { hasSlot } from '@/assets/js/utils'

@Component({
  components: {
    Minimap,
    NewEdge,
    Edge,
    Node,
    ToolBox,
    Menu,
    Arrow,
    Port,
  },
})
export default class GraphContent extends Vue {
  @Prop({ default: true })
  minimap: boolean

  componentState = ComponentListStore.state
  configState = GraphConfigStore.state

  graph: Graph = null as any

  nodes = []
  edges = []

  transform = {
    scale: 1,
    translateX: 0,
    translateY: 0,
  }
  brushPath = ''

  get dragingInfo() {
    return this.componentState.dragingInfo
  }

  get rootNodes(): INodeModel[] {
    const isIdata = isIDataModel(this.configState.data)
    if (!isIdata) {
      return [this.configState.data]
    } else {
      const { nodes, edges } = this.configState.data as IDataModel
      const nodeMap: { [x: string]: INodeModel } = {}
      nodes.forEach((node) => {
        nodeMap[node.id] = node
      })
      edges.forEach((edge) => delete nodeMap[edge.toNodeId])
      return Object.keys(nodeMap).map((id) => nodeMap[id])
    }
  }

  get hasNodeSlot() {
    return hasSlot.call(this, 'node')
  }

  get hasEdgeSlot() {
    return hasSlot.call(this, 'edge')
  }

  get hasArrowSlot() {
    return hasSlot.call(this, 'arrow')
  }

  get hasPortSlot() {
    return hasSlot.call(this, 'port')
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
      slots: [{ type: 'in' }, { type: 'out' }, { type: 'out' }],
    })
  }

  mounted() {
    this.init()
  }

  init() {
    this.graph = new Graph({
      container: this.$refs.svg as HTMLElement,
      direction: this.configState.direction,
      nodeInfo: {
        width: 180,
        height: 40,
        html: (node) => {
          return `<div class="graph-node">${node.model.label}</div>`
        },
      },
      edgeInfo: {
        path: (from, to) => {
          const { x: x1, y: y1 } = from
          const { x: x2, y: y2 } = to
          const deg = Math.atan((y2 - y1) / (x2 - x1))
          let offsetX = 4 * Math.cos(deg)
          let offsetY = 4 * Math.sin(deg)
          if (x2 < x1) {
            offsetX = -offsetX
            offsetY = -offsetY
          }
          return `M ${x1} ${y1}  L ${x2 - offsetX} ${y2 - offsetY}`
        },
      },
      action: this.configState.action,
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
      afterdeletenode: 'afterdeletenode',
      afterdeleteedge: 'afterdeleteedge',
      afterdragnode: 'afterDragNode',
      keyup: 'handleKeyUp',
      datachange: 'refreshGraph',
    }

    Object.keys(hooks).forEach((key) => {
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
    this.configState.data = this.graph.getData()
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
          selectedNodes.forEach((item) => {
            item.edges.forEach((edge) => {
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

  @Watch('configState.direction')
  handleConfigChange(v: string) {
    this.graph.set('direction', v)
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
