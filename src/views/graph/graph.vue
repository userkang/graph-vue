<template>
  <div class="graph-wrap">
    <ComponentPanel class="component-panel" />
    <div class="main-center-wrap">
      <Dag />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ComponentPanel from '@/components/graph/component-panel.vue'
import Dag from '@/components/graph/dag.vue'

interface CopyReturnValue {
  graphId: number
  graphName: string
}

@Component({
  components: {
    Dag,
    ComponentPanel
  }
})
export default class Graph extends Vue {}
</script>

<style lang="scss" scoped>
.graph-wrap {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
}
.main-center-wrap {
  flex: 1;
}
</style>
