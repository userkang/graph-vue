<template>
  <div class="mindmap-template">
    <GraphVue
      ref="graph"
      :data="dataMock"
      :action="action"
      :layout="layout"
      @drop="handleDrop"
      @init="initGraph"
    >
      <!-- <template #edge="{ edge }">
        <path :d="path(edge)" class="graph-custom-edge"></path>
      </template> -->
      <template #node="{ node }">
        <div class="node-container" v-if="node.model.isShow">
          <div class="text-container">
            <p
              class="node-text"
              v-if="!(isEditText && node.hasState('selected'))"
            >
              {{ node.model.label }}
            </p>
            <mtd-input
              v-else
              ref="input"
              v-model="node.model.label"
              @change="editCallback(node.model)"
              :class="{
                'node-text-edited': isEditText,
                'node-text': !isEditText
              }"
            ></mtd-input>
          </div>
          <div class="add-icon">
            <mtd-icon
              name="mtdicon mtdicon-error-o"
              style="transform: rotate(45deg)"
              @click="addNode($event, node.model)"
            ></mtd-icon>
          </div>
          <div class="hide-icon">
            <mtd-icon
              name="mtdicon mtdicon-nosign"
              style="transform: rotate(-45deg)"
              @click="handleHideNode(node.model)"
            ></mtd-icon>
          </div>
        </div>
      </template>
      <template #port></template>
      <ToolBox />
    </GraphVue>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ComponentPanel from '@/components/component-panel.vue'
import ConfigPanel from '@/components/config-panel.vue'
import { ToolBox, Menu, MiniMap, GraphVue } from '@datafe/graph-vue'
import { INodeModel, IEdgeModel, IEdge, Graph } from '@datafe/graph-core'

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
  isEditText = false
  isShowAddIcon = false
  activeId = ''
  graph!: Graph
  num = 0

  get dataMock() {
    return this.graphConfigState.data
  }

  get action() {
    return this.graphConfigState.action
  }

  get layout() {
    return {
      rankdir: 'LR'
    }
  }

  get dragingInfo() {
    return this.componentState.dragingInfo
  }

  initGraph(graph: Graph) {
    this.graphState.graph = graph
    this.graph = graph
    this.initEvent()
  }

  initEvent() {
    this.graph.on('node.contextmenu', this.handleNodeContextMenu)
    this.graph.on('node.dblclick', this.handleNodeDblClick)
    this.graph.on('keyup', this.handleKeyUp)
  }

  addNode(e: DragEvent, nodeData) {
    e.preventDefault()
    !this.dataMock?.children && (this.dataMock.children = [])
    if (this.dataMock.id === nodeData.id) {
      this.dataMock.children.push({
        id: String(Date.now()),
        label: '新节点',
        isShow: true
      })
    } else {
      this.addChildNode(this.dataMock, nodeData.id)
    }
    this.graph.data(this.dataMock)
    this.graph.layout()
  }

  addChildNode(grandpaNode: INodeModel, nodeId: string) {
    !grandpaNode?.children && (grandpaNode.children = [])
    grandpaNode.children.find(item => {
      const isRealParent = item.id === nodeId
      !item?.children && isRealParent && (item.children = [])
      isRealParent &&
        item.children.push({
          id: String(Date.now()),
          label: '新节点',
          children: [],
          isShow: true
        })
      !isRealParent && this.addChildNode(item, nodeId)
      return isRealParent
    })
  }

  async handleHideNode(node: INodeModel) {
    await this.hideNode(node)
    this.graph.data(this.dataMock)
  }

  hideNode(node: INodeModel) {
    if (this.dataMock.id === node.id) {
      this.dataMock.children.forEach(item => {
        item.isShow = false
        this.hideChildNode(item)
      })
    } else {
      this.dataMock.children.forEach(item => {
        if (item.id === node.id) {
          this.hideChildNode(item)
        }
      })
    }
  }

  hideChildNode(parentNode) {
    parentNode?.children &&
      parentNode.children.forEach(item => {
        item.isShow = false
        this.hideChildNode(item)
      })
  }

  handleDrop(e: DragEvent) {
    e.preventDefault()
    const x = e.x - this.dragingInfo.offsetX * this.graph.getZoom()
    const y = e.y - this.dragingInfo.offsetY * this.graph.getZoom()
    const point = this.graph.getPointByClient(x, y)
    console.log(this.graph)

    this.graph.addNode({
      label: this.dragingInfo.component.componentName,
      x: point.x,
      y: point.y
    })
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
      this.graph.deleteNode(this.activeId)
    }
  }

  handleNodeContextMenu(e: MouseEvent, data: { id: string }) {
    this.menuShow = true
    this.activeId = data.id
  }

  handleNodeDblClick(e) {
    this.isEditText = true
    this.$nextTick(() => {
      const inputDom = this.$refs.input as any
      inputDom.select()
    })
  }

  editCallback(node) {
    this.dataMock.nodes.forEach(item => {
      item.id === node.id && (item.label = node.label)
    })
  }

  path(edge: IEdge) {
    const { x: x1, y: y1 } = edge.fromSlot
    const { x: x2, y: y2 } = edge.toSlot
    const xc = (y2 - y1) / 2
    return `M ${x1} ${y1} L ${x1} ${y1 + xc} L ${x1} ${y2 - xc} L ${x2} ${
      y2 - xc
    }  L ${x2} ${y2}`
  }

  async created() {
    await GraphStore.getMindMapData()
  }
}
</script>

<style lang="scss" scoped>
.mindmap-template {
  width: 100%;
  height: 100%;
  background: #333;
}
.node-container {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: transparent;
  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
}
.add-icon {
  display: none;
  color: white;
  background-color: transparent;
  font-size: 17px;
}
.hide-icon {
  position: absolute;
  // right: -18px;
  color: white;
  background-color: red;
  font-size: 17px;
}
.text-container {
  background-color: #333;
  width: calc(100% - 10px);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.node-text {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  width: calc(100% - 5px);
  height: calc(100% - 10px);
  background: #30e3ca;
  margin: 5px;
  user-select: text;
  ::v-deep input {
    text-align: center;
    border: none;
    font-size: 12px;
  }
}
.node-container:hover {
  .add-icon {
    display: block;
  }
  .node-text {
    outline: #30a2e3 solid 3px;
    outline-offset: 2px;
    color: red;
  }
}
.node-text-edited {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  width: calc(100% - 5px);
  height: calc(100% - 10px);
  background: #30e3ca;
  margin: 5px;
  user-select: text;
  ::v-deep input {
    text-align: center;
    border: none;
    font-size: 12px;
  }
  outline: #03476e solid 3px;
  outline-offset: 2px;
  color: red;
}
.graph-custom-edge {
  stroke: rgb(235, 226, 224);
  fill: none;
  &:hover {
    stroke: rgb(0, 195, 255);
  }
}
</style>
