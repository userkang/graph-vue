<template>
  <div class="container">
    <GraphVue :data="dataMock" :action="action" @init="initGraph">
      <template #node="{ node }">
        <div v-if="node.model.type === 'group'" class="group-node">
          <button v-if="node.model.collapsed" @click="showChildren(node)">
            展开
          </button>
          <button v-else @click="hideChildren(node)">隐藏</button>
        </div>
        <div v-else class="normal-node">{{ node.model.label }}</div>
      </template>

      <template #port></template>
      <ToolBox />
      <button style="position: absolute; left: 10px; top: 10px" @click="layout">
        整理
      </button>
    </GraphVue>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ComponentPanel from '@/components/component-panel.vue'
import ConfigPanel from '@/components/config-panel.vue'
import { ToolBox, MiniMap, GraphVue } from '@datafe/graph-vue'
import { Graph, INode, IDataModel, IEdge } from '@datafe/graph-core'

import GraphStore from '@/stores/graph'

const action = [
  'drag-blank',
  'drag-node',
  'click-select',
  'connect-edge',
  'wheel-zoom',
  'brush-select'
]

const nodeCellMock = (): IDataModel => {
  return {
    nodes: [
      {
        id: '1',
        label: 'children',
        parentId: '4',
        x: 300,
        y: 400
      },
      {
        id: '2',
        label: 'children',
        parentId: '5',
        x: 300,
        y: 500
      },
      {
        id: '3',
        label: 'children',
        parentId: '5',
        x: 300,
        y: 600
      },
      {
        id: '4',
        label: 'parent',
        type: 'group',
        collapsed: true
      },
      {
        id: '5',
        label: 'parent',
        type: 'group'
      }
    ],
    edges: [
      {
        fromNodeId: '4',
        toNodeId: '5'
      },
      {
        fromNodeId: '2',
        toNodeId: '3'
      }
    ]
  }
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
  dataMock = nodeCellMock()
  graphState = GraphStore.state
  nodeEditedDom: HTMLElement | null = null
  isEditText = false

  get action() {
    return action
  }

  hideChildren(node: INode) {
    const children = node.getChildren()
    children.forEach(child => {
      child.hide()
    })
    node.model.collapsed = true
    node.update({
      width: 180,
      height: 40
    })
  }

  showChildren(node: INode) {
    const children = node.getChildren()
    children.forEach(child => {
      child.show()
    })
    node.model.collapsed = false
    this.resizeGroup(node)
  }

  initGraph(graph: Graph) {
    this.graphState.graph = graph
    this.graph = graph

    this.initEvent()
    this.initGroups()
  }

  initEvent() {
    this.graph.on('node:moving', this.handleNodeMoving)
    this.graph.on('layout', this.afterLayout)
  }

  afterLayout() {
    this.$nextTick(() => {
      // this.initGroups()
    })
  }

  handleNodeMoving(nodes: INode[]) {
    nodes.forEach(node => {
      const parent = node.getParent()
      if (parent) {
        this.resizeGroup(parent)
      }
    })
  }

  initGroups() {
    const groups = this.graph
      .getNodes()
      .filter(item => item.model.type === 'group')
    groups.forEach(group => {
      if (group.model.collapsed) {
        this.hideChildren(group)
      } else {
        this.showChildren(group)
      }
    })

    // this.graph.layout()
  }

  layout() {
    const groups = this.graph
      .getNodes()
      .filter(item => item.model.type === 'group')
    const edges: Record<string, IEdge> = {}
    const children = []

    groups.forEach(item => {
      item.getEdges().forEach(edge => {
        if (!edges[edge.id]) {
          edges[edge.id] = edge
        }
      })

      item.getChildren()
    })

    this.graph.layout({
      data: { nodes: groups, edges: Object.values(edges) }
    })
  }

  resizeGroup(node: INode) {
    const children = node.getChildren()
    const bbox = this.graph.getNodesBBox(children)
    node.update({
      width: bbox.width + 50,
      height: bbox.height + 50,
      x: bbox.left - 25,
      y: bbox.top - 25
    })
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
  background: rgba(3, 3, 3, 0.1);
}
</style>
