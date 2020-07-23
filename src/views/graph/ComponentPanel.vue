<template>
  <section class="comp-panel">
    <div style="padding: 10px;" v-if="!isTest">
      <MtdButton
        class="submit-btn white-icon"
        style="width: 100%;"
        icon="iconfont icon-shenqingjiaruxiangmuzu"
        @click="createExperiment"
      >创建实验</MtdButton>
    </div>
    <div class="comp-content">
      <h4>组件</h4>
      <ComponentNav :componentList="graphComponentValue" />
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ComponentNav from '../../components/graph/ComponentNav.vue'
import { ComponentListStore } from '../../stores/graph/graphVisual/ComponentList'
import { GraphVisualStore } from '@/stores/graph/graphVisual/GraphContent'

@Component({
  components: {
    ComponentNav
  }
})
export default class ComponentPanel extends Vue {
  private graphComponentState = ComponentListStore.state
  private graphVisualState = GraphVisualStore.state

  get isTest() {
    return this.graphVisualState.isTest
  }

  get graphComponentValue() {
    return this.graphComponentState.value
  }

  private createExperiment() {
    return this.$emit('createExperiment')
  }

  private async mounted() {
    if (this.isTest) {
      await ComponentListStore.getTestComponent()
    } else {
      await ComponentListStore.request()
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-content {
  height: calc(100% - 54px);
  overflow: auto;
  h4 {
    font-size: 12px;
    color: #8a94c2;
    font-weight: normal;
    text-align: left;
    margin: 5px 0;
    padding-left: 10px;
  }
}
</style>
