<template>
  <div class="mindmap-template">
    <GraphVue
      :data="dataMock"
      :action="action"
      :layout="layout"
      @init="initGraph"
    >
      <template #node="{ node }">
        <div class="node-container">
          <div class="left text-container" ref="nodeContainer">
            <p
              v-if="!isEditText"
              class="node-text"
              :class="{
                'node-text-selected': node.hasState('selected')
              }"
            >
              {{ node.model.label }}
            </p>
            <textarea
              ref="textarea"
              v-else-if="isEditText && node.hasState('selected')"
              v-model="node.model.label"
              @input="handleInput($event, node)"
              @blur="handleNodeBlur"
              :rows="rows"
              class="node-text"
              :class="{
                'node-text-edited': isEditText && node.hasState('selected')
              }"
            ></textarea>
            <p v-else class="node-text">
              {{ node.model.label }}
            </p>
          </div>
          <div class="right">
            <div
              class="hide-icon"
              v-if="node.getAllChildren().length && !node.model.isCollapsed"
            >
              <mtd-icon
                name="mtdicon mtdicon-nosign"
                style="transform: rotate(-45deg)"
                @click="hideNode(node)"
              ></mtd-icon>
            </div>
            <div
              class="show-icon"
              v-if="node.getAllChildren().length && node.model.isCollapsed"
              @click="showNode(node)"
            >
              {{ node.getAllChildren().length }}
            </div>
          </div>
        </div>
      </template>
      <template #edge="{ edge }">
        <path :d="path(edge)" class="graph-custom-edge"></path>
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
import { INodeModel, IEdgeModel, IEdge, Graph, INode } from '@datafe/graph-core'

import GraphStore from '@/stores/graph'

const action = [
  'drag-svg',
  'drag-node',
  'click-select',
  'create-edge',
  'wheel-zoom',
  'brush-select'
]

const layout = { rankdir: 'LR' }

const mindMapMock = () => {
  return {
    id: '1',
    label: '工具栏悬浮有说明',
    nodeId: 232,
    slots: [{ type: 'out', id: 'slot1' }],
    isCollapsed: false,
    children: [
      {
        id: '2',
        label: '拖动添加组件',
        isCollapsed: false
      },
      {
        id: '3',
        label: '拖动插槽连线',
        isCollapsed: false
      },
      {
        id: '4',
        label: '交互可配置',
        isCollapsed: false
      }
    ]
  }
}

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
  graph!: Graph
  dataMock = mindMapMock()
  graphState = GraphStore.state
  menuShow = false
  isEditText = false
  isShowAddIcon = false
  activeId = ''
  rows = 1

  get action() {
    return action
  }

  get layout() {
    return layout
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

  addNode(e: MouseEvent, parentNode: INode) {
    e.preventDefault()

    const node = this.graph.addNode({
      label: '新节点',
      isCollapsed: false
    })
    this.graph.addEdge({
      fromNodeId: parentNode.id,
      toNodeId: node.id
    })

    this.showNode(parentNode)
  }

  showNode(node: INode) {
    // node.clearState('isCollapsed')
    node.update({ isCollapsed: false })
    node.getAllChildren().forEach(item => {
      item.update({ isCollapsed: false })
      item.show()
    })
    this.graph.layout()
  }

  hideNode(node: INode) {
    // node.setState('isCollapsed')
    node.update({ isCollapsed: true })
    node.getAllChildren().forEach(item => {
      item.update({ isCollapsed: true })
      item.hide()
    })
    this.graph.emit('datachange')
  }

  handleKeyUp(e: KeyboardEvent) {
    e.stopPropagation()
    this.handleDeleteKey(e)
    this.handleTabKey(e)
    this.handleBlankSpaceKey(e)
  }

  handleDeleteKey(e: KeyboardEvent) {
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

  handleTabKey(e: KeyboardEvent) {
    if (['Tab'].includes(e.key)) {
      const selectedNodes = this.graph.findNodeByState('selected') || []
      selectedNodes.forEach(item => {
        const node = this.graph.addNode({
          label: '新节点',
          isCollapsed: false
        })
        node.setState('selected')
        this.graph.addEdge({
          fromNodeId: item.id,
          toNodeId: node.id
        })
        this.showNode(item)
        item.clearState('selected')
      })
    }
  }

  handleBlankSpaceKey(e) {
    const tagName = (e.target as HTMLBodyElement).tagName
    const isBlankSpace = e.key === ' '
    if (tagName !== 'BODY' || !isBlankSpace) {
      return
    }
    this.handleNodeDblClick()
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

  handleNodeBlur() {
    this.isEditText = false
    this.graph.layout()
  }

  handleNodeDblClick() {
    this.isEditText = true
    this.$nextTick(() => {
      const textareaDom = this.$refs.textarea as any
      textareaDom?.select()
    })
  }

  handleInput(e, node) {
    const len = Math.ceil(
      e.target.value.replace(/[^\x00-\xff]/g, '**').length / 2
    )
    const col = Math.ceil(len / 11)
    this.rows = col
    node.update({
      width: 180,
      height: 40 + 18 * (col - 1)
    })
  }

  path(edge: IEdge) {
    const { x: x1, y: y1 } = edge.fromSlot
    const { x: x2, y: y2 } = edge.toSlot
    const xc = (x1 - x2) / 3
    return `M ${x1} ${y1} L ${x1 - xc} ${y1}  L ${
      x1 - 2 * xc
    } ${y2} L ${x2} ${y2}`
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
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  background-color: transparent;
  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
  .left {
    flex-grow: 1;
  }
  .right {
    display: flex;
    align-items: center;
    width: 17px;
    min-width: 17px;
    max-width: 17px;
    height: 100%;
    min-height: 40px;
    flex-grow: 0;
  }
}
.add-icon {
  display: none;
  cursor: pointer;
  color: white;
  background-color: transparent;
  font-size: 17px;
}
.hide-icon {
  display: none;
  cursor: pointer;
  width: 16px;
  height: 16px;
  color: white;
  background-color: red;
  border-radius: 50%;
  font-size: 17px;
  pointer-events: visible;
}
.show-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  color: white;
  background-color: red;
  font-size: 16px;
}
.text-container {
  background-color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
}
.node-text {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  min-width: 150px;
  min-height: 30px;
  background: #30e3ca;
  margin: 5px;
  padding: 5px;
  user-select: text;
  resize: none;
  text-align: center;
  line-height: 1.5;
  font-size: 12px;
}
.node-container:hover {
  .hide-icon {
    display: flex;
    justify-content: center;
  }
  .node-text {
    outline: #63bcef solid 3px;
    outline-offset: 2px;
  }
}
.node-text-selected {
  outline: rgb(16, 76, 229) solid 3px !important;
  outline-offset: 2px;
}
.node-text-edited {
  outline: #033e92 solid 3px !important;
  outline-offset: 2px;
  background: white;
  color: #333;
}
.graph-custom-edge {
  stroke: rgb(235, 226, 224);
  fill: none;
  &:hover {
    stroke: rgb(0, 195, 255);
  }
}
</style>
