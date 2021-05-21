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
      <ComponentPanel class="component-panel" />
      <div class="main-center-wrap">
        <Graph ref="graphRef" />
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

interface CopyReturnValue {
  graphId: number
  graphName: string
}

@Component({
  components: {
    Graph,
    ComponentPanel,
    ConfigPanel
  }
})
export default class GraphEditor extends Vue {
  created() {
    GraphStore.getData()
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
</style>
