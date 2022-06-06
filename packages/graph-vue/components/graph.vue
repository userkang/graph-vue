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
        <EdgeWrapper v-for="edge in edges" :key="edge.id" :edge="edge">
          <slot v-if="$scopedSlots.edge" name="edge" :edge="edge"></slot>
          <Edge v-else :edge="edge" :graph="graph" />
        </EdgeWrapper>
        <NodeWrapper v-for="node in nodes" :key="node.id" :node="node">
          <slot v-if="$scopedSlots.node" name="node" :node="node"></slot>
          <Node v-else :node="node" />

          <template #port="{ port }">
            <slot v-if="$scopedSlots.port" name="port" :port="port"></slot>
            <Port v-else :port="port" />
          </template>
        </NodeWrapper>
        <NewEdge>
          <slot name="newEdge"></slot>
        </NewEdge>
      </g>
      <path :d="brushPath" class="graph-vue-brushing" />
    </svg>

    <slot v-if="graph"></slot>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Watch,
  ProvideReactive
} from 'vue-property-decorator'
import NodeWrapper from './wrapper/node.vue'
import EdgeWrapper from './wrapper/edge.vue'
import PortWrapper from './wrapper/port.vue'
import Node from './node.vue'
import Edge from './edge.vue'
import Port from './port.vue'
import NewEdge from './new-edge.vue'
import Arrow from './arrow.vue'

import { Graph, IDataModel, IEdge, ILayout, INode } from '@datafe/graph-core'

@Component({
  components: {
    NodeWrapper,
    EdgeWrapper,
    PortWrapper,
    Edge,
    Node,
    Port,
    Arrow,
    NewEdge
  }
})
export default class GraphVue extends Vue {
  @ProvideReactive()
  graph: Graph = null as any

  @Prop({ default: () => [], type: Array })
  action!: string[]

  @Prop({
    default: () => {
      return { nodes: [], edges: [] }
    },
    type: Object
  })
  data!: IDataModel

  @Prop({
    default: () => {
      return { rankdir: 'TB' }
    }
  })
  layout!: ILayout

  nodes: INode[] = []
  edges: IEdge[] = []

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

    this.$emit('init', this.graph)
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
    const data = JSON.parse(JSON.stringify(val))
    this.graph.data(data)
  }

  @Watch('action')
  handelAction(v: string[]) {
    this.graph.removeAction()
    this.graph.addAction(v)
  }

  @Watch('layout', { deep: true })
  handelRankdir(v: ILayout) {
    this.graph.layout(v)
  }
}
</script>

<style lang="scss">
.graph-vue-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
}
.graph-vue-brushing {
  fill: #4e73ff;
  stroke: #606be1;
  stroke-width: 1px;
  opacity: 0.3;
}
</style>
