<template>
  <div class="container">
    <GraphVue
      :data="dataMock"
      :action="action"
      @init="initGraph"
      :layout="layoutOptions"
      :defaultNode="nodeSize"
    >
      <template #node="{ node }">
        <div v-if="node.model.type === 'group'" class="group-node">
          <div class="group-node-title">
            <div>{{ node.model.label }}</div>
            <div>
              <div
                class="group-node-icon"
                v-if="node.model.collapsed"
                @click="showChildren(node)"
              >
                +
              </div>
              <div class="group-node-icon" v-else @click="hideChildren(node)">
                -
              </div>
            </div>
          </div>
        </div>
        <div v-else class="normal-node">
          <div class="normal-node-left"></div>
          <div class="normal-node-right">
            <div class="normal-node-label">{{ node.model.label }}</div>
            <div class="normal-node-desc">{{ node.model.desc }}</div>
          </div>
        </div>
      </template>

      <template #port></template>
      <!-- <ToolBox /> -->
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
  IEdge,
  ILayout
} from '@datafe/graph-vue'

import GraphStore from '@/stores/graph'

const groupPadding = 10
const groupPaddingTop = 24

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
      id: '1',
      label: '1',
      desc: '供应链_网格化_维度扩展表',
      parentId: '2'
    },
    {
      id: '6',
      label: '6',
      desc: '供应链_网格化_维度扩展表',
      parentId: '2'
    },

    {
      id: '2',
      label: '2',
      desc: '供应链_网格化_维度扩展表',
      parentId: '3',
      type: 'group'
    },
    {
      id: '3',
      label: '3',
      desc: '供应链_网格化_维度扩展表',
      type: 'group'
    },
    {
      id: '4',
      label: '4',
      desc: '供应链_网格化_维度扩展表',
      type: 'group'
    },
    {
      id: '5',
      label: '5',
      desc: '供应链_网格化_维度扩展表',
      parentId: '4'
    }
  ],
  edges: [
    {
      fromNodeId: '1',
      toNodeId: '5'
    },
    {
      fromNodeId: '6',
      toNodeId: '1'
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
  layoutOptions: ILayout = { options: { rankdir: 'TB', ranksep: 80 } }
  nodeSize = {
    width: 200,
    height: 56
  }

  get action() {
    return action
  }

  hideChildren(node: INode) {
    this.graph.stackStart()
    let children = node.getChildren()

    node.update(this.nodeSize)

    while (children.length) {
      children.forEach(child => {
        children = child.getChildren()
        child.hide()
      })
    }

    node.model.collapsed = true

    this.graph.stackEnd()
  }

  showChildren(node: INode) {
    let children = node.getChildren()

    while (children.length) {
      children.forEach(child => {
        children = child.getChildren()
        child.show()
      })
    }

    node.model.collapsed = false

    this.resizeGroup(node)
  }

  initGraph(graph: Graph) {
    this.graphState.graph = graph
    this.graph = graph

    this.initEvent()
    this.$nextTick(() => {
      const rootNodes = this.graph
        .getNodes()
        .filter(item => !item.model.parentId)
      this.initGroups(rootNodes)
    })
  }

  initEvent() {
    this.graph.on('node:moving', this.handleNodeMoving)
  }

  handleNodeMoving(node: INode) {
    let parent = node.getParent()

    while (parent) {
      this.resizeGroup(parent)
      parent = parent.getParent()
    }
  }

  initGroups(nodes: INode[]) {
    nodes.forEach(node => {
      if (node.getChildren().length && !node.model.collapsed) {
        this.initGroups(node.getChildren())
        this.resizeGroup(node)
      }
    })

    this.graph.fitCenter()
  }

  resizeGroup(node: INode) {
    const children = node.getChildren()
    const bbox = this.graph.getNodesBBox(children)
    node.update({
      width: bbox.width + 2 * groupPadding,
      height: bbox.height + 2 * groupPadding + groupPaddingTop,
      x: bbox.left - groupPadding,
      y: bbox.top - groupPadding - groupPaddingTop
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background: #f4f5f7;
}
.group-node,
.normal-node {
  width: 100%;
  height: 100%;
}
.normal-node {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 6px;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #111925;
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 500;
  box-shadow: 0 2px 6px 0 rgba(17, 25, 37, 0.03);
  display: flex;
  box-sizing: border-box;
  .normal-node-left {
    width: 6px;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    height: 100%;
    background: #347bed;
  }
  .normal-node-right {
    padding: 0 15px;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .normal-node-desc {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: rgba(17, 25, 37, 0.65);
    line-height: 20px;
    font-weight: 400;
  }
}
.group-node {
  background: rgba(52, 123, 237, 0.1);
  border: 1px solid #347bed;
  border-radius: 10px;
  transition: all 0.2s linear;
  .group-node-title {
    height: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background: rgba(52, 123, 237, 0.1);
    border-top-left-radius: 9px;
    border-top-right-radius: 9px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #111925;
    letter-spacing: 0;
    line-height: 22px;
    font-weight: 500;
  }
  .group-node-icon {
    height: 100%;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: -4px -20px 0 0;
    font-size: 20px;
    cursor: pointer;
  }
}
</style>
