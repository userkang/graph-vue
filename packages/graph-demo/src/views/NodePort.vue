<template>
  <div class="container">
    <GraphVue
      :layout="{ options: { rankdir: 'TB' } }"
      :data="dataMock"
      :action="action"
      :defaultNode="{ width: 300, height: 200 }"
      @init="initGraph"
    >
      <template #node="{ node }">
        <div class="group-node">
          {{ node.model.label }}
        </div>
      </template>

      <template #edge="{ edge }">
        <path
          stroke="#ddd"
          stroke-width="2"
          :marker-end="'url(#arrow)'"
          :d="path(edge)"
        ></path>
      </template>
      <ToolBox />
    </GraphVue>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ComponentPanel from '@/components/component-panel.vue'
import ConfigPanel from '@/components/config-panel.vue'
import { ToolBox, MiniMap, GraphVue, Graph, IEdge } from '@datafe/graph-vue'

import GraphStore from '@/stores/graph'

const action = [
  'drag-blank',
  'drag-node',
  'click-select',
  'connect-edge',
  'wheel-zoom',
  'brush-select'
]

const nodeCellMock = {
  nodes: [
    {
      id: '1',
      label: '1',
      ports: [{ id: '1-1', position: 'right', type: 'in' }, { position: 'top' }]
    },
    {
      id: '2',
      label: '2',
      ports: [{ position: 'left' }]
    }
  ],
  edges: [
    {
      fromPortId: '1-1',
      toNodeId: '2'
    }
  ]
}

@Component({
  components: {
    GraphVue,
    ToolBox,
    MiniMap,
    ComponentPanel,
    ConfigPanel
  }
})
export default class NodeCell extends Vue {
  graph!: Graph
  dataMock = nodeCellMock
  graphState = GraphStore.state
  nodeEditedDom: HTMLElement | null = null
  isEditText = false

  get action() {
    return action
  }

  initGraph(graph: Graph) {
    this.graphState.graph = graph
    this.graph = graph
  }

  path(edge: IEdge) {
    return `M ${edge.source.x} ${edge.source.y} L ${edge.target.x} ${edge.target.y}`
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
.group-node,
.normal-node {
  width: 100%;
  height: 100%;
  background: #eee;
  border: 2px solid #ddd;
}
.group-node {
  background: rgba(134, 244, 106, 0.654);
  transition: all 0.2s linear;
}
</style>
