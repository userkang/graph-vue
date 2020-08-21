<template>
  <div class="main-wrap">
    <ComponentPanel class="component-panel" />
    <div class="main-center-wrap">
      <Graph />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ComponentPanel from '@/components/component-panel.vue'
import Graph from '@/components/graph.vue'

interface CopyReturnValue {
  graphId: number
  graphName: string
}

@Component({
  components: {
    Graph,
    ComponentPanel
  }
})
export default class GraphEditor extends Vue {}
</script>

<style lang="scss" scoped>
.main-wrap {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
}
.main-center-wrap {
  flex: 1;
}
</style>
