<template>
  <section class="comp-panel">
    <div class="title">组件</div>
    <ComponentNav :componentList="graphComponentValue" />
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ComponentNav from '@/components/graph/component-nav.vue'
import { ComponentListStore } from '@/stores/graph/componentList'
// import { HistoryListController } from '@/stores/graph/graphVisual/HistoryList'

@Component({
  components: {
    ComponentNav
  }
})
export default class ComponentPanel extends Vue {
  private graphComponentState = ComponentListStore.state
  private initX = 0
  private initPanelWidth = 0
  // private graphListState = HistoryListController.state

  get graphComponentValue() {
    return this.graphComponentState.list
  }

  private createExperiment() {
    return this.$emit('createExperiment')
  }

  private async mounted() {
    await ComponentListStore.getComponentList()
  }
}
</script>

<style lang="scss" scoped>
.comp-panel {
  position: relative;
  width: 200px;
  height: 100%;
  box-sizing: border-box;
  background: $l1;
  border-right: 1px solid $l2;
}
.title {
  font-size: 12px;
  color: $d1;
  text-align: left;
  margin: 5px 10px;
}
</style>
