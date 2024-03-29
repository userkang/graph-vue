<template>
  <div class="dag-container">
    <ComponentPanel />
    <GraphVue
      class="graph-wrapper"
      ref="graph"
      :data="dataMock"
      :action="action"
      :layout="layout"
      @drop="handleDrop"
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
  INode,
  INodeModel,
  IEdgeModel,
  IEdge,
  Graph
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
export default class DAG extends Vue {
  graphConfigState = GraphConfigStore.state
  componentState = ComponentListStore.state
  graphState = GraphStore.state
  menuShow = false
  activeId = ''
  graph!: Graph

  get dataMock() {
    return this.graphConfigState.data
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
    this.graph.on('node:mousedown', ({ target }: { target: INode }) => {
      target?.setZIndex(1000)
    })
    this.graph.on('edge:connected', (edgeModel: IEdgeModel) => {
      this.graph.addEdge(edgeModel)
    })
  }

  handleDrop(e: DragEvent) {
    e.preventDefault()
    const x = e.x - this.dragingInfo.offsetX * this.graph.getZoom()
    const y = e.y - this.dragingInfo.offsetY * this.graph.getZoom()
    const point = this.graph.getPointByClient(x, y)

    this.graph.addNode({
      label: this.dragingInfo.component.componentName,
      x: point.x,
      y: point.y
    })
  }

  path(edge: IEdge) {
    const { x: x1, y: y1 } = edge.fromPort
    const { x: x2, y: y2 } = edge.toPort
    const xc = (y2 - y1) / 2
    return `M ${x1} ${y1} L ${x1} ${y1 + xc} L ${x1} ${y2 - xc} L ${x2} ${
      y2 - xc
    }  L ${x2} ${y2}`
  }

  text(edge: IEdge) {
    const { fromPort, toPort } = edge
    return {
      x: (fromPort.x + toPort.x) / 2,
      y: (fromPort.y + toPort.y) / 2
    }
  }

  handleKeyUp(e: KeyboardEvent) {
    this.graph.stackStart()
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
        }
      }
    }
    this.graph.stackEnd()
  }

  deleteItem() {
    if (this.activeId) {
      this.graph.deleteNode(this.activeId)
    }
  }

  handleNodeContextMenu({ data }: { data: { id: string } }) {
    this.menuShow = true
    this.activeId = data.id
  }

  async created() {
    await GraphStore.getDagData()
  }
}
</script>

<style lang="scss" scoped>
.dag-container {
  width: 100%;
  height: 100%;
  display: flex;
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
  justify-content: flex-start;
  align-items: center;
  border: 2px solid #fff;
  box-sizing: border-box;
  font-size: 12px;
  border-radius: 10px;
  .left {
    width: 9%;
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
  stroke-dasharray: 2;
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

@keyframes dash {
  from {
    stroke-dashoffset: 320;
  }
  to {
    stroke-dashoffset: 0;
  }
}
::v-deep .graph-vue-edge {
  stroke-dasharray: 3;
  animation: dash 15s linear infinite;
}
</style>
