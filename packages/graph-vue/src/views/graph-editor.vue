<template>
  <div class="container">
    <div class="top-panel">
      <div class="name">graph-editor</div>
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
  height: 42px;
  line-height: 42px;
  background: #fff;
  padding: 0px 10px;
  box-shadow: inset 0 2px 3px 0 #eee;
  .name {
    font-size: 16px;
    font-weight: 800;
    font-style: italic;
    color: #666;
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
