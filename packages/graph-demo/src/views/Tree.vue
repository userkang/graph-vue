<template>
  <div class="dag_component">
    <GraphVue
      class="graph-wrapper"
      :data="dataMock"
      :action="action"
      :layout="layout"
      @init="initGraph"
    >
      <template #node="{ node }">
        <div
          class="node-container"
          :style="{
            'content-visibility': 'auto',
            'border-color': node.hasState('selected') ? '#606be1' : '#DEDFEC'
          }"
        >
          <div class="left" :class="[isLeaf(node.model) ? 'leaf' : '']"></div>
          <div class="right">
            {{ node.model.label }}
          </div>
        </div>
      </template>

      <template #edge="{ edge }">
        <path :d="path(edge)" class="graph-custom-edge"></path>
      </template>

      <template #port> </template>

      <MiniMap />
      <ToolBox />
      <Menu class="menu" v-model="menuShow">
        <li @click="deleteItem">删除</li>
        <li @click="deleteItem">删除</li>
      </Menu>
    </GraphVue>
    <ConfigPanel />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ComponentPanel from '@/components/component-panel.vue'
import ConfigPanel from '@/components/config-panel.vue'
import {
  ToolBox,
  Menu,
  MiniMap,
  GraphVue,
  INodeModel,
  IEdgeModel,
  IEdge,
  Graph,
  INode
} from '@datafe/graph-vue'

import GraphStore from '@/stores/graph'
import GraphConfigStore from '@/stores/graph-config'
import ComponentListStore from '@/stores/component-list'

@Component({
  components: {
    GraphVue,
    ToolBox,
    Menu,
    MiniMap,
    ComponentPanel,
    ConfigPanel
  }
})
export default class Tree extends Vue {
  graphConfigState = GraphConfigStore.state
  componentState = ComponentListStore.state
  graphState = GraphStore.state
  menuShow = false
  activeId = ''
  graph!: Graph

  get dataMock() {
    return this.graphConfigState.data || []
  }

  get action() {
    return this.graphConfigState.action
  }

  get layout() {
    return this.graphConfigState.layout
  }

  get dragingInfo() {
    return this.componentState.dragingInfo
  }

  isLeaf(node: INodeModel) {
    return !node.children || node.children.length === 0
  }

  initGraph(graph: Graph) {
    this.graphState.graph = graph
    this.graph = graph
    this.initEvent()
  }

  initEvent() {
    this.graph.on('node:contextmenu', this.handleNodeContextMenu)
    this.graph.on('keyup', this.handleKeyUp)
  }

  path(edge: IEdge) {
    const { x: x1, y: y1 } = edge.fromPort
    const { x: x2, y: y2 } = edge.toPort

    if (['TB', 'BT'].includes(this.graph.get('direction'))) {
      const xc = (y2 - y1) / 2
      return `
        M ${x1} ${y1}
        L ${x1} ${y1 + xc}
        L ${x1} ${y2 - xc}
        C ${x2} ${y2 - xc} ${x2} ${y2 - xc} ${x2} ${y2}
      `
    } else {
      const xc = (x2 - x1) / 2
      return `
        M ${x1} ${y1}
        L ${x1 + xc} ${y1}
        L ${x1 + xc} ${y2}
        C ${x2 - xc} ${y2} ${x2 - xc} ${y2} ${x2} ${y2}
      `
    }
  }

  text(edge: IEdge) {
    const { fromPort, toPort } = edge
    return {
      x: (fromPort.x + toPort.x) / 2,
      y: (fromPort.y + toPort.y) / 2
    }
  }

  handleKeyUp(e: KeyboardEvent) {
    e.stopPropagation()
    const tagName = (e.target as HTMLBodyElement).tagName
    if (tagName === 'BODY') {
      if (['Delete', 'Backspace'].includes(e.key)) {
        const selectedNodes = this.graph.findNodeByState('selected')
        const selectedEdges = this.graph.findEdgeByState('selected')
        if (selectedEdges.length) {
          this.graph.deleteEdge(selectedEdges[0].id)
        }
        if (selectedNodes.length) {
          const edges: IEdgeModel[] = []
          const nodes: INodeModel[] = []
          selectedNodes.forEach(item => {
            item.getEdges().forEach(edge => {
              edges.push(edge.model as IEdgeModel)
            })
            nodes.push(item.model)
            this.graph.deleteNode(item.id, false)
          })
          this.graph.pushStack('deleteNode', { nodes, edges })
        }
      }
    }
  }

  deleteItem() {
    if (this.activeId) {
      const node = this.graph.findNode(this.activeId)
      const children = node?.getAllTargetNodes()

      if (children) {
        children.forEach(item => {
          this.graph.deleteNode(item.id)
        })
      }

      this.graph.deleteNode(this.activeId)
    }
  }

  handleNodeContextMenu({ target }: { target: INode }) {
    this.menuShow = true
    this.activeId = target.id
  }

  async created() {
    await GraphStore.getTreeData()
  }
}
</script>

<style lang="scss" scoped>
.dag_component {
  display: flex;
  width: 100%;
  height: 100%;
}
.graph-wrapper {
  position: relative;
  flex: 1;
}
.node-container {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.85);
  color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #fff;
  box-sizing: border-box;
  font-size: 14px;
  border-radius: 10px;
  .left {
    width: 20%;
    height: 100%;
    background-color: orange;
    &.leaf {
      background-color: rgb(8, 184, 8);
    }
  }
  .right {
    flex: 1;
    text-align: center;
  }
}
.graph-custom-edge {
  stroke: rgb(235, 226, 224);
  stroke-width: 1.5;
  fill: none;
  &:hover {
    stroke: rgb(0, 195, 255);
  }
}
.menu li {
  height: 30px;
  line-height: 30px;
  padding-left: 20px;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    color: #333;
    background: #dbdef3;
  }
}
</style>
