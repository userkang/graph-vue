<template>
  <div class="container">
    <div class="top-panel">
      <div class="name">graph-demo</div>
      <a
        href="https://km.sankuai.com/page/505696797"
        target="_blank"
        class="link"
        >用户文档</a
      >
    </div>
    <div class="main-wrap">
      <ComponentPanel class="component-panel" />
      <div class="main-center-wrap">
        <GraphVue
          ref="graph"
          :data="dataMock"
          :action="action"
          :layout="layout"
          @drop="handleDrop"
          @nodeselectchange="handleNodeSelectChange"
        >
          <!-- <template #node="{ node }">
            <div
              class="node-container"
              :style="{
                'border-color': node.hasState('selected')
                  ? '#db3737'
                  : '#DEDFEC'
              }"
            >
              <div
                class="left"
                :class="[isLeaf(node.model) ? 'leaf' : '']"
              ></div>
              <div class="right">
                {{ node.model.label }}
              </div>
            </div>
          </template>

          <template #edge="{ edge }">
            <path :d="path(edge)" class="graph-custom-edge"></path>
            <text
              :x="text(edge).x"
              :y="text(edge).y"
              style="text-anchor: middle; fill: #aaa; font-size: 12px"
            >
              tag
            </text>
          </template>

          <template #port>
            <rect
              width="8"
              height="8"
              :transform="`translate(-4, -4)`"
              fill="#999"
            ></rect>
          </template> -->

          <MiniMap></MiniMap>

          <ToolBox class="tool-box"></ToolBox>

          <Menu class="menu" v-model="menuShow">
            <li @click="deleteItem">删除</li>
            <li @click="deleteItem">删除</li>
          </Menu>
        </GraphVue>
      </div>

      <ConfigPanel />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ComponentPanel from '@/components/component-panel.vue'
import ConfigPanel from '@/components/config-panel.vue'
import { ToolBox, Menu, MiniMap, GraphVue } from '@datafe/graph-vue'
import { INodeModel, Graph } from '@datafe/graph-core'

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
export default class GraphEditor extends Vue {
  graphConfigState = GraphConfigStore.state
  componentState = ComponentListStore.state
  graphState = GraphStore.state
  menuShow = false
  activeId = ''

  async created() {
    await GraphStore.getData()
  }

  get dataMock() {
    return this.graphConfigState.data
  }

  get action() {
    return this.graphConfigState.action
  }

  get graph() {
    this.graphState.graph = (this.$refs.graph as any).graph
    return this.graphState.graph as Graph
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

  handleNodeSelectChange(node) {
    console.log(node)
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

  path(edge: any) {
    const { x: x1, y: y1 } = edge.fromSlot
    const { x: x2, y: y2 } = edge.toSlot
    const xc = (y2 - y1) / 2
    return `M ${x1} ${y1} L ${x1} ${y1 + xc} L ${x1} ${y2 - xc} L ${x2} ${
      y2 - xc
    }  L ${x2} ${y2}`
  }

  text(edge) {
    const { fromSlot, toSlot } = edge
    return {
      x: (fromSlot.x + toSlot.x) / 2,
      y: (fromSlot.y + toSlot.y) / 2
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
          const edges = []
          const nodes = []
          selectedNodes.forEach(item => {
            item.getEdges().forEach(edge => {
              edges.push(edge.model)
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

  mounted() {
    this.graph.on('node.contextmenu', this.handleNodeContextMenu)
    this.graph.on('keyup', this.handleKeyUp)
  }
}
</script>

<style lang="scss" scoped>
.top-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 42px;
  background: #333;
  padding: 0px 10px;
  border-bottom: 1px solid #222;
  .name {
    font-size: 16px;
    font-weight: 800;
    color: #fff;
  }
  .link {
    font-size: 12px;
    color: #eee;
    text-decoration: none;
    margin-right: 10px;
    user-select: none;
  }
}
.main-wrap {
  position: relative;
  width: 100%;
  height: calc(100vh - 42px);
  display: flex;
}
.main-center-wrap {
  flex: 1;
  position: relative;
  background: #242424;
}
.node-container {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.85);
  color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #fff;
  box-sizing: border-box;
  font-size: 12px;
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
  stroke-width: 1px;
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
</style>
