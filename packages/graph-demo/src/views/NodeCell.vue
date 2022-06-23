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

const groupPadding = 25

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
        parentId: '4'
      },
      {
        id: '2',
        label: 'children',
        parentId: '5'
      },
      {
        id: '3',
        label: 'children',
        parentId: '5'
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
        type: 'group',
        collapsed: true
      },
      {
        id: '6',
        label: 'start'
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
      },
      {
        fromNodeId: '6',
        toNodeId: '5'
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
    node.update({
      width: 180,
      height: 40,
      collapsed: true
    })
    this.layout()
  }

  showChildren(node: INode) {
    const children = node.getChildren()
    children.forEach(child => {
      child.show()
    })
    node.update({
      collapsed: false
    })

    this.resizeGroup(node)
    this.layout()
  }

  initGraph(graph: Graph) {
    this.graphState.graph = graph
    this.graph = graph

    this.initEvent()
    this.initGroups()
  }

  initEvent() {
    this.graph.on('node:moving', this.handleNodeMoving)
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
    this.layout()

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
  }

  layout() {
    const rootNodes = this.graph.getNodes().filter(item => !item.model.parentId)
    const edges: Record<string, IEdge> = {}

    rootNodes.forEach(item => {
      item.getEdges().forEach(edge => {
        if (!edges[edge.id]) {
          edges[edge.id] = edge
        }
      })
    })

    this.graph.layout({
      data: { nodes: rootNodes, edges: Object.values(edges) }
    })

    rootNodes.forEach(item => {
      const childrenEdges: Record<string, IEdge> = {}
      const children = item.getChildren()
      children.forEach(child => {
        child.getEdges().forEach(edge => {
          if (!childrenEdges[edge.id]) {
            childrenEdges[edge.id] = edge
          }
        })
      })

      const dagre = this.graph.layout({
        data: { nodes: children, edges: Object.values(childrenEdges) }
      })

      dagre.nodes().forEach((v: string) => {
        const childNode = this.graph.findNode(v) as INode
        const { x, y } = dagre.node(v)
        const posX = item.x + x - childNode.width / 2 + groupPadding
        const posY = item.y + y - childNode.height / 2 + groupPadding
        childNode.updatePosition(posX, posY)
      })
    })
  }

  resizeGroup(node: INode) {
    const children = node.getChildren()
    const bbox = this.graph.getNodesBBox(children)
    node.update({
      width: bbox.width + 2 * groupPadding,
      height: bbox.height + 2 * groupPadding,
      x: bbox.left - groupPadding,
      y: bbox.top - groupPadding
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
