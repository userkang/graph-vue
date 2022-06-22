<template>
  <div class="container">
    <GraphVue
      :data="dataMock"
      :action="action"
      :layout="layout"
      @init="initGraph"
    >
      <template #node="{ node }">
        <div v-if="node.model.type === 'group'" class="group-node">
          <button v-if="node.model.collapsed" @click="showChildren(node)">
            展开
          </button>
          <button v-else @click="hideChildren(node)">隐藏</button>
        </div>
        <div v-else class="normal-node"></div>
      </template>

      <template #port="{ port }">
        <template v-if="port.model.isGroup">
          <circle
            graph-type="port"
            graph-id="slot3"
            :x="port.x"
            :y="port.y"
          ></circle>
        </template>
      </template>
      <ToolBox />
    </GraphVue>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ComponentPanel from '@/components/component-panel.vue'
import ConfigPanel from '@/components/config-panel.vue'
import { ToolBox, MiniMap, GraphVue } from '@datafe/graph-vue'
import {
  INodeModel,
  IEdgeModel,
  Graph,
  INode,
  IDataModel
} from '@datafe/graph-core'

import GraphStore from '@/stores/graph'

const action = [
  'drag-blank',
  'drag-node',
  'click-select',
  'connect-edge',
  'wheel-zoom',
  'brush-select'
]

const layout = { rankdir: 'TB' }

const nodeCellMock = (): IDataModel => {
  return {
    nodes: [
      {
        id: '2',
        label: 'children',
        parentId: '1',
        x: 300,
        y: 400
      },
      {
        id: '3',
        label: 'children',
        parentId: '5',
        x: 300,
        y: 500
      },
      {
        id: '4',
        label: 'children',
        parentId: '5',
        x: 300,
        y: 600
      },
      {
        id: '5',
        label: 'parent',
        type: 'group',
        width: 500,
        height: 600,
        collapsed: false,
        slots: [
          { type: 'in', isGroup: true },
          { type: 'out', isGroup: true }
        ]
      }
    ],
    edges: [
      {
        fromNodeId: '3',
        toNodeId: '4'
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

  get layout() {
    return layout
  }

  getGroup(port) {}

  getPorts(port: ISlot) {
    const node = this.graph.findNodeBySlot(String(port.id))
    const slots = node?.getChildren().map(item => {
      return [...item.slots]
    })
  }

  hideChildren(node: INode) {
    const children = node.getChildren()
    children.forEach(child => {
      child.hide()
      child.setState('skipLayout', true)
    })
    node.model.collapsed = true
    node.update({
      width: 180,
      height: 40
    })
    node.setState('skipLayout', false)

    this.handleEdge(node)
  }

  showChildren(node: INode) {
    const children = node.getChildren()
    children.forEach(child => {
      child.show()
      child.setState('skipLayout', false)
    })
    node.model.collapsed = false
    node.setState('skipLayout', true)
    this.resizeGroup(node)
  }

  initGraph(graph: Graph) {
    this.graphState.graph = graph
    this.graph = graph

    this.initEvent()
    this.initGroups()
  }

  handleEdge(node: INode) {
    const children = node.getChildren()
  }

  initEvent() {
    this.graph.on('node:moving', this.handleNodeMoving)
    this.graph.on('layout', this.afterLayout)
  }

  afterLayout() {
    this.$nextTick(() => {
      this.initGroups()
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
      group.setState('skipLayout', !group.model.collapsed)
      this.resizeGroup(group)
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
