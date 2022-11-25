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
  IEdge,
  ILayout
} from '@datafe/graph-vue'

import GraphStore from '@/stores/graph'

const groupPadding = 20
const groupPaddingTop = 40

const action = [
  'drag-blank',
  'drag-node',
  'click-select',
  'connect-edge',
  'wheel-zoom',
  'brush-select',
  'wheel-move'
]

const nodeCellMock = {
  nodes: [
    {
      id: '6',
      label: 'dim_sc_grid_ext',
      desc: '供应链_网格化_维度扩展表'
    },
    {
      id: '4',
      label: '节点组1',
      type: 'group',
      collapsed: true
    },
    {
      id: '5',
      label: '节点组2',
      type: 'group',
      collapsed: false
    },
    {
      id: '1',
      label: 'dim_sc_grid_ext',
      desc: '供应链_网格化_维度扩展表',
      parentId: '4'
    },
    {
      id: '2',
      label: 'dim_sc_grid_ext2',
      desc: '供应链_网格化_维度扩展表',
      parentId: '5'
    },
    {
      id: '3',
      label: 'dim_sc_grid_ext3',
      desc: '供应链_网格化_维度扩展表',
      parentId: '5'
    }
  ],
  edges: [
    {
      fromNodeId: '6',
      toNodeId: '4'
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
  layoutOptions: ILayout = { options: { rankdir: 'LR', ranksep: 100 } }
  nodeSize = {
    width: 200,
    height: 56
  }

  get action() {
    return action
  }

  hideChildren(node: INode) {
    this.graph.stackStart()
    const children = node.getChildren()

    node.update(this.nodeSize)

    children.forEach(child => {
      child.hide()
    })

    node.update(this.nodeSize)
    node.model.collapsed = true

    this.graph.layout()
    this.graph.stackEnd()
  }

  showChildren(node: INode) {
    const children = node.getChildren()
    children.forEach(child => {
      child.show()
    })
    node.model.collapsed = false

    this.resizeGroup(node)

    this.graph.layout()
  }

  initGraph(graph: Graph) {
    this.graphState.graph = graph
    this.graph = graph

    this.initEvent()
    this.$nextTick(() => {
      this.initGroups()
      this.graph.layout()
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
    const groups = this.graph
      .getNodes()
      .filter(item => item.model.type === 'group')

    groups.forEach(group => {
      if (group.model.collapsed) {
        this.hideChildren(group)
      }
    })
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
    height: 36px;
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
