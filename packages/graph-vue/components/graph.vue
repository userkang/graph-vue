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
        <template v-for="item in items">
          <EdgeWrapper v-if="isEdge(item)" :key="item.id" :edge="item">
            <slot v-if="hasSlots.edge" name="edge" :edge="item"></slot>
            <Edge v-else :edge="item" :graph="graph" />
          </EdgeWrapper>
          <NodeWrapper v-if="isNode(item)" :key="item.id" :node="item">
            <slot v-if="hasSlots.node" name="node" :node="item"></slot>
            <Node v-else :node="item" />

            <template #port="{ port }">
              <slot v-if="hasSlots.port" name="port" :port="port"></slot>
              <Port v-else :port="port" />
            </template>
          </NodeWrapper>
        </template>
        <NewEdge>
          <slot name="newEdge"></slot>
        </NewEdge>
      </g>
      <path :d="brushPath" class="graph-vue-brushing" />
    </svg>

    <slot v-if="graph"></slot>
  </div>
</template>

<script>
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  getCurrentInstance,
  useSlots
} from 'vue-demi'
import NodeWrapper from './wrapper/node.vue'
import EdgeWrapper from './wrapper/edge.vue'
import Node from './node.vue'
import Edge from './edge.vue'
import Port from './port.vue'
import NewEdge from './new-edge.vue'
import Arrow from './arrow.vue'
import { isEqualWith } from '../utils/isEqualWith'
import { Graph, Node as GraphNode, Edge as GraphEdge } from '@datafe/graph-core'

export default defineComponent({
  components: {
    NodeWrapper,
    EdgeWrapper,
    Edge,
    Node,
    Port,
    Arrow,
    NewEdge
  },
  props: {
    action: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => {
        return { nodes: [], edges: [] }
      }
    },
    layout: {
      type: Object,
      default: null
    },
    defaultNode: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      graph: null,
      nodes: [],
      edges: [],
      items: [],
      transform: {
        scale: 1,
        translateX: 0,
        translateY: 0
      },
      brushPath: ''
    }
  },
  watch: {
    data(val, prev) {
      if (isEqualWith(val, prev)) return
      const data = JSON.parse(JSON.stringify(val))
      this.graph.data(data)
    },
    action(val, prev) {
      if (isEqualWith(val, prev)) return
      this.graph.removeAction()
      this.graph.addAction(val)
    },
    layout: {
      handler(val, prev) {
        if (isEqualWith(val, prev)) return
        this.graph.layout(val, false)
      },
      deep: true
    },
    'layout.options.rankdir'() {
      this.graph.layout(this.layout, false)
      this.graph.getNodes().forEach(node => {
        node.updatePorts(this.graph.get('direction'))
      })
    }
  },
  methods: {
    isEdge(item) {
      return item instanceof GraphEdge
    },
    isNode(item) {
      return item instanceof GraphNode
    },
    handleDrop(e) {
      this.$emit('drop', e)
    },
    init() {
      const graph = new Graph({
        container: this.$refs.svg,
        direction:
          (this.layout && this.layout.options && this.layout.options.rankdir) ||
          'TB',
        action: this.action,
        defaultNode: this.defaultNode
      })
      this.graph = graph
      this.initCustomHooks()

      this.graph.data(JSON.parse(JSON.stringify(this.data)))
      this.checkAutoLayout()

      this.$emit('init', this.graph)
    },
    checkAutoLayout() {
      const { options } = this.layout || {}
      const hasOtherProps =
        options !== undefined &&
        Object.keys(options).some(key => key !== 'rankdir' && options[key])

      if (hasOtherProps) {
        this.graph.layout(this.layout)
      }
    },
    initCustomHooks() {
      const hooks = [
        'node:added',
        'edge:added',
        'node:click',
        'edge:click',
        'node:change',
        'edge:change',
        'port:change',
        'port:added',
        'port:deleted'
      ]

      hooks.forEach(hook => {
        this.graph.on(hook, (...args) => {
          this.$emit(hook, ...args)
        })
      })

      this.graph.on('datachange', this.refreshGraph)
      this.graph.on('translate', this.aftertranslate)
      this.graph.on('zoom', this.afterzoom)
      this.graph.on('brushing', this.brushing)
    },
    brushing(path) {
      this.brushPath = path
    },
    refreshGraph() {
      this.items = this.graph.getSortedItem()
    },
    aftertranslate(x, y) {
      this.transform.translateX = x
      this.transform.translateY = y
    },
    afterzoom(zoom) {
      this.transform.scale = zoom
    }
  },
  setup() {
    const hasSlots = useSlots()

    onMounted(() => {
      const instance = getCurrentInstance().proxy
      instance.init()
    })

    onBeforeUnmount(() => {
      const instance = getCurrentInstance().proxy
      instance.graph.destroy()
    })

    return { hasSlots }
  }
})
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
