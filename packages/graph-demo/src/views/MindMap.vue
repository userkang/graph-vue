<template>
  <div class="mindmap-template">
    <GraphVue
      :data="dataMock"
      :action="action"
      :layout="layout"
      @init="initGraph"
    >
      <template v-slot:node="{ node }">
        <div class="node-container">
          <div
            ref="textarea"
            contenteditable
            v-if="isEditText && node.hasState('selected')"
            @focus="handleNodeFocus"
            @blur="handleNodeBlur($event, node)"
            class="node-text"
            :class="{
              'node-text-edited': isEditText && node.hasState('selected')
            }"
          >
            <span>{{ node.model.label }}</span>
          </div>
          <span
            v-else
            class="node-text"
            :class="{
              'node-text-selected': node.hasState('selected')
            }"
            >{{ node.model.label }}</span
          >
          <div class="right">
            <div
              class="hide-icon"
              v-if="
                node.getAllTargetNodes().length &&
                !node.model.isCollapsed &&
                !isEditText
              "
            >
              <mtd-icon
                name="mtdicon mtdicon-nosign"
                style="transform: rotate(-45deg)"
                @click="hideNode(node)"
              ></mtd-icon>
            </div>
            <div
              class="show-icon"
              v-if="
                node.getAllTargetNodes().length &&
                node.model.isCollapsed &&
                !isEditText
              "
              @click="showNode(node)"
            >
              {{ node.getAllTargetNodes().length }}
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
import { ToolBox, MiniMap, GraphVue } from '@datafe/graph-vue'
import { INodeModel, IEdgeModel, IEdge, Graph, INode } from '@datafe/graph-core'

import GraphStore from '@/stores/graph'

const action = [
  'drag-blank',
  'drag-node',
  'click-select',
  'connect-edge',
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
    MiniMap,
    ComponentPanel,
    ConfigPanel
  }
})
export default class MindMap extends Vue {
  graph!: Graph
  dataMock = mindMapMock()
  graphState = GraphStore.state
  nodeEditedDom: HTMLElement | null = null
  isEditText = false

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
    this.graph.on('node:mousedown', this.handleNodeDrag)
    this.graph.on('node:dblclick', this.handleNodeDblClick)
    this.graph.on('keydown', this.handleKeyDown)

    this.graph.on('node:change:selected', (nodes: INode[]) => {
      nodes.forEach((item: INode) => {
        item?.setZIndex(1000)
      })
    })
  }

  addNode(e: MouseEvent, parentNode: INode) {
    e.preventDefault()

    const node = this.graph.addNode({
      label: '新节点',
      isCollapsed: false
    })
    this.graph.addEdge({
      fromNodeId: parentNode.id,
      toNodeId: node?.id
    })

    this.showNode(parentNode)
  }

  showNode(node: INode) {
    node.update({ isCollapsed: false })
    node.getAllTargetNodes().forEach(item => {
      item.update({ isCollapsed: false })
      item.show()
    })
    this.graph.layout()
  }

  hideNode(node: INode) {
    node.update({ isCollapsed: true })
    node.getAllTargetNodes().forEach(item => {
      item.update({ isCollapsed: true })
      item.hide()
    })
    this.graph.emit('datachange')
  }

  handleKeyDown(e: KeyboardEvent) {
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
      e.preventDefault()
      const selectedNodes = this.graph.findNodeByState('selected') || []
      selectedNodes.forEach(item => {
        const node = this.graph.addNode({
          label: '新节点',
          isCollapsed: false
        })
        node?.setState('selected')
        this.graph.addEdge({
          fromNodeId: item.id,
          toNodeId: node?.id
        })
        this.showNode(item)
        item.clearState('selected')
      })
    }
  }

  handleBlankSpaceKey(e: KeyboardEvent) {
    const tagName = (e.target as HTMLBodyElement).tagName
    const isBlankSpace = e.key === ' '
    if (tagName !== 'BODY' || !isBlankSpace) {
      return
    }
    this.handleNodeDblClick()
  }

  handleNodeDrag({ target }: { target: INode }) {
    target?.setZIndex(1000)
  }

  handleNodeFocus() {
    this.nodeEditedDom =
      document.querySelector('.node-text-edited')?.parentElement || null
  }

  handleNodeBlur(e, node: INode) {
    e.preventDefault()
    this.isEditText = false
    node.update({
      label: e.target
        .querySelector('span')
        .innerText.replace(/<br\/?>/gi, '\n')
        .trim()
    })
    this.$nextTick(() => {
      const height = this.nodeEditedDom?.getBoundingClientRect().height
      node.update({
        width: 180,
        height
      })
      this.graph.layout()
    })
  }

  handleNodeDblClick() {
    this.isEditText = true
    this.$nextTick(() => {
      const textareaDom = this.$refs.textarea as HTMLElement
      this.textFocus(textareaDom)
    })
  }

  textFocus(el: HTMLElement) {
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  }

  path(edge: IEdge) {
    const { x: x1, y: y1 } = edge.fromSlot
    const { x: x2, y: y2 } = edge.toSlot
    const xc = (x1 - x2) / 3
    return `M ${x1 - 10} ${y1} L ${x1 - xc} ${y1}  L ${
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
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  background-color: transparent;
  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
  .right {
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-10px);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
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
  background-color: transparent;
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
  border: 1px solid white;
  background-color: transparent;
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
  width: 100%;
  height: 100%;
  min-height: 30px;
  background: #30e3ca;
  margin: 5px;
  padding: 5px;
  user-select: text;
  resize: none;
  text-align: center;
  line-height: 1.5;
  font-size: 12px;
  word-break: break-all;
  word-wrap: break-word;
  white-space: pre-line;
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
