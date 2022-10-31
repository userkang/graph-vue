<template>
  <div class="container">
    <GraphVue
      :data="dataMock"
      :action="action"
      @init="initGraph"
      :layout="layoutOptions"
    >
      <template #node="{ node }">
        <div v-if="node.model.type === 'group'" class="group-node">
          <button v-if="node.model.collapsed" @click="showChildren(node)">
            展开
          </button>
          <button v-else @click="hideChildren(node)">隐藏</button>
        </div>
        <div v-else class="normal-node">
          {{ node.model.label }}
        </div>
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
import {
  ToolBox,
  MiniMap,
  GraphVue,
  Graph,
  INode,
  IEdge
} from '@datafe/graph-vue'

import GraphStore from '@/stores/graph'

const groupPadding = 25

const action = [
  'drag-blank',
  'drag-node',
  'click-select',
  'connect-edge',
  'wheel-zoom',
  'brush-select',
  'wheel-move'
]

// const nodeCellMock = () => data

const nodeCellMock = {
  nodes: [
    {
      id: '4',
      label: 'parent4',
      type: 'group',
      collapsed: false
    },
    {
      id: '5',
      label: 'parent5',
      type: 'group',
      collapsed: false
    },
    {
      id: '1',
      label: 'children1',
      parentId: '4',
    },
    {
      id: '2',
      label: 'children2',
      parentId: '5'
    },
    {
      id: '3',
      label: 'children3',
      parentId: '5',
      zIndex: -1
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
  layoutOptions = { options: { rankdir: 'LR', ranksep: 20, nodesep: 10 } }

  get action() {
    return action
  }

  hideChildren(node: INode) {
    this.graph.stackStart()
    const children = node.getChildren()

    node.update({
      width: 180,
      height: 40
    })

    children.forEach(child => {
      child.hide()
    })

    node.update({
      width: 180,
      height: 40
    })
    node.model.collapsed = true

    this.layout(false)

    this.graph.stackEnd()
  }

  showChildren(node: INode) {
    const children = node.getChildren()
    children.forEach(child => {
      child.show()
    })
    node.model.collapsed = false

    this.resizeGroup(node)
    this.layout(false)
  }

  initGraph(graph: Graph) {
    this.graphState.graph = graph
    this.graph = graph

    this.initEvent()
    this.$nextTick(() => {
      this.initGroups()
    })
  }

  initEvent() {
    this.graph.on('node:moving', this.handleNodeMoving)
  }

  handleNodeMoving(node: INode) {
    const parent = node.getParent()
    if (parent) {
      this.resizeGroup(parent)
    }
  }

  initGroups() {
    this.layout(false)

    const groups = this.graph
      .getNodes()
      .filter(item => item.model.type === 'group')

    groups.forEach(group => {
      if (group.model.collapsed) {
        const children = group.getChildren()
        children
        children.forEach(child => {
          child.hide()
        })
      }
    })

    this.layout(false)
  }

  layout(stack = true) {
    // 获取根节点
    const rootNodes = this.graph.getNodes().filter(item => !item.model.parentId)
    const edges: Record<string, IEdge> = {}

    // 收集根节点相关的边
    rootNodes.forEach(item => {
      item.getEdges().forEach(edge => {
        if (!edges[edge.id]) {
          edges[edge.id] = edge
        }
      })
    })

    // 处理根节点下子节点布局
    rootNodes.forEach(item => {
      const childrenEdges: Record<string, IEdge> = {}
      const children = item.getChildren()

      if (children.length) {
        // 收集所有子节点的边
        children.forEach(child => {
          child.getEdges().forEach(edge => {
            if (!childrenEdges[edge.id]) {
              childrenEdges[edge.id] = edge
            }
          })
        })

        // 对子节点布局。默认布局不能满足需求，需要获取实例自定义布局位置
        const dagre = this.graph.layout(
          {
            data: { nodes: children, edges: Object.values(childrenEdges) }
          },
          stack
        )

        // 通过布局实例返回的坐标点，自定义布局位置。
        dagre.nodes().forEach((v: string) => {
          const childNode = this.graph.findNode(v) as INode
          const { x, y } = dagre.node(v)
          const posX = x - childNode.width / 2
          const posY = y - childNode.height / 2
          childNode.updatePosition(posX, posY)
        })
      }
    })

    // 布局后，再更新下group节点的大小
    rootNodes.forEach(item => {
      if (item.getChildren().length && !item.model.collapsed) {
        this.resizeGroup(item)
      }
    })

    // 对根节点进行布局
    this.graph.layout(
      {
        data: { nodes: rootNodes, edges: Object.values(edges) }
      },
      stack
    )

    rootNodes.forEach(item => {
      const children = item.getChildren()

      if (children.length) {
        // 通过布局实例返回的坐标点，自定义布局位置。
        children.forEach((node: INode) => {
          const posX = item.x + node.x + groupPadding
          const posY = item.y + node.y + groupPadding
          node.updatePosition(posX, posY)
        })
      }
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
  background: rgba(134, 244, 106, 0.654);
  transition: all 0.2s linear;
}
</style>
