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
        <Graph ref="graph" :data="dataMock" :action="action">
          <template #node="{ node }">
            <div class="node-container">
              <div
                class="left"
                :class="[isLeaf(node.model) ? 'leaf' : '']"
              ></div>
              <div class="right">值为{{ node.model.label }}</div>
            </div>
          </template>

          <template #edge="{ edge }">
            <path :d="path(edge)" class="edge-wrapper"></path>
            <text
              :x="text(edge).x"
              :y="text(edge).y"
              style="text-anchor: middle; fill: #999"
              >tag</text
            >
          </template>

          <template #port="{ port }">
            <rect
              width="10"
              height="10"
              :transform="`translate(-5, -5)`"
              fill="red"
            ></rect>
          </template>

          <Minimap></Minimap>
          <div>1234</div>
        </Graph>
      </div>

      <!-- <ConfigPanel /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ComponentPanel from '@/components/component-panel.vue'
import ConfigPanel from '@/components/config-panel.vue'
import { Graph, ToolBox, Menu, Minimap } from '@datafe/graph-vue/index'

import GraphStore from '@/stores/graph'
import { INodeModel, IEdgeModel } from '@datafe/graph-core'
import { GraphConfigStore } from '@/stores/graph-config'

interface CopyReturnValue {
  graphId: number
  graphName: string
}

@Component({
  components: {
    Graph,
    ToolBox,
    Menu,
    Minimap,
    ComponentPanel,
    ConfigPanel,
  },
})
export default class GraphEditor extends Vue {
  // data: any = []
  graphConfigState = GraphConfigStore.state

  async created() {
    await GraphStore.getData()
    this.graph.on('port.click', this.handelNodeClick)
  }

  handelNodeClick(e, node) {
    console.log(e, node)
  }

  get dataMock() {
    return this.graphConfigState.data
  }

  get action() {
    return this.graphConfigState.action
  }

  get graph() {
    return (this.$refs.graph as any).graph as Graph
  }

  isLeaf(node: INodeModel) {
    return !node.children || node.children.length === 0
  }

  direction = 'TB'

  path(edge: any) {
    const { fromSlot, toSlot } = edge
    const x2 = toSlot.x
    const y2 = toSlot.y

    return `M ${fromSlot.x} ${fromSlot.y} L ${x2} ${y2}`
  }

  text(edge) {
    const { fromSlot, toSlot } = edge
    return {
      x: (fromSlot.x + toSlot.x) / 2,
      y: (fromSlot.y + toSlot.y) / 2,
    }
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
.edge-wrapper {
  stroke: rgb(235, 226, 224);
  stroke-width: 2px;
  &:hover {
    stroke: rgb(0, 195, 255);
  }
}
</style>
