<template>
  <div
    class="graph-vue-wrapper"
    ref="svg"
    @dragover="e => e.preventDefault()"
    @drop="handleDrop"
    @contextmenu="e => e.preventDefault()"
  >
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
          <slot name="edge" :edge="item"></slot>
        </Edge>
        <Node v-for="item in nodes" :key="item.id" :node="item">
          <slot name="node" :node="item"></slot>

          <template #port="{ port }">
            <slot name="port" :port="port"></slot>
          </template>
        </Node>
        <NewEdge>
          <slot name="newEdge"></slot>
        </NewEdge>
      </g>
      <path
        :d="brushPath"
        style="fill: #4e73ff; stroke: #606be1; stroke-width: 1px; opacity: 0.3"
      />
    </svg>
    <div v-if="graph">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Node from './node.vue'
import Edge from './edge.vue'
import NewEdge from './new-edge.vue'
import Arrow from './arrow.vue'
import Port from './port.vue'
import { Graph, IDataModel } from '@datafe/graph-core'

@Component({
  components: {
    NewEdge,
    Edge,
    Node,
    Arrow,
    Port
  }
})
export default class GraphContent extends Vue {
  @Prop({ default: () => [], type: Array })
  action: string[]

  @Prop({
    default: () => {
      return { nodes: [], edges: [] }
    },
    type: Object
  })
  data: IDataModel

  @Prop({
    default: () => {
      return { rankdir: 'TB' }
    }
  })
  layout: unknown

  graph: Graph = null as any

  nodes = []
  edges = []

  transform = {
    scale: 1,
    translateX: 0,
    translateY: 0
  }
  brushPath = ''

  handleDrop(e: DragEvent) {
    this.$emit('drop', e)
  }

  mounted() {
    this.init()
  }

  init() {
    this.graph = new Graph({
      container: this.$refs.svg as HTMLElement,
      direction: (this.layout as any).rankdir || 'TB',
      nodeInfo: {
        width: 180,
        height: 40
      },
      action: this.action
    })

    this.initCustomHooks()

    this.graph.data(JSON.parse(JSON.stringify(this.data)))

    this.graph.layout(this.layout)
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
      this.graph.on(hook, (...args) => {
        this.$emit(hook, ...args)
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

  @Watch('data')
  dataChange(val: IDataModel) {
    const a = JSON.parse(JSON.stringify(val))
    this.graph.data(a)
  }
}
</script>
