<template>
  <div class="container">
    <div class="top-panel">
      <div class="name">graph-editor</div>
      <a
        href="https://km.sankuai.com/page/505696797"
        target="_blank"
        class="link"
        >用户文档</a
      >
    </div>
    <div class="main-wrap">
      <test-slots>
        <!-- <template v-slot:node="slotProps">{{ slotProps }} </template> -->
      </test-slots>
      <ComponentPanel class="component-panel" />
      <div class="main-center-wrap">
        <Graph ref="graphRef">
          <template #node="{ node }">
            <div class="node-container">
              <div
                class="left"
                :class="[isLeaf(node.model) ? 'leaf' : '']"
              ></div>
              <div class="right">值为{{ node.model.label }}</div>
            </div>
          </template>

          <template #edge="{ edge, graph }">
            <path
              :d="path(edge, graph)"
              class="edge-wrapper"
              graph-type="edge"
              :graph-id="edge.id"
            ></path>
          </template>

          <template #slot="{linkSlot}">
            <circle
              :style="{
                stroke: 'blue',
                fill: 'aqua'
              }"
              graph-type="slot"
              :graph-id="linkSlot.id"
              class="slot-style"
              :r="6"
              :transform="`translate(${linkSlot.x}, ${linkSlot.y})`"
            ></circle>
          </template>

          <!-- <div slot="node"></div> -->

          <!-- <Edge></Edge> -->

          <!-- <Node>
            <div slot="label"></div>
            <div ></div>
            </Node> -->
        </Graph>
      </div>
      <ConfigPanel />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ComponentPanel from '@/components/component-panel.vue'
import ConfigPanel from '@/components/config-panel.vue'
import Graph from '@/components/graph.vue'

import GraphStore from '@/stores/graph'
import Node from '@/components/graphSlots/node.vue'
import Style from '@/components/graphSlots/Style.vue'
import Edge from '@/components/graphSlots/Edge.vue'
import TestSlots from './TestSlots.vue'
import { INodeModel, IEdgeModel } from '@datafe/graph-core'
import { calculateCurve } from '@/assets/js/utils'

interface CopyReturnValue {
  graphId: number
  graphName: string
}

@Component({
  components: {
    Graph,
    ComponentPanel,
    ConfigPanel,
    Node,
    Style,
    Edge,
    TestSlots
  }
})
export default class GraphEditor extends Vue {
  created() {
    GraphStore.getData()
  }

  isLeaf(node: INodeModel) {
    return !node.children || node.children.length === 0
  }

  direction = 'TB'

  path(edge: any, graph: any) {
    const { fromSlot, toSlot } = edge
    const x2 = toSlot.x
    const y2 = toSlot.y
    const direction = graph.get('direction')

    return `M ${fromSlot.x} ${fromSlot.y} L ${x2} ${y2}`
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
  background-color: rgba(255, 255, 255, 0.5);
  color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .left {
    width: 30%;
    height: 100%;
    background-color: orange;
    &.leaf {
      background-color: green;
    }
  }
  .right {
    flex: 1;
    text-align: center;
  }
}
.edge-wrapper {
  stroke: aqua;
  stroke-width: 2px;
  &:hover {
    stroke: blue;
  }
}
</style>
