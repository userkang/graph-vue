<template>
  <div class="graph-wrap">
    <!-- <MenuTips v-if="menuTipsValue.isShow" :tips="tips" />
    <WarningTips />-->
    <ComponentPanel class="component-panel" />
    <div class="main-center-wrap">
      <!-- <GraphListWrap ref="graphListWrap" /> -->
      <!-- <div class="main-center-bottom"> -->
      <!-- <ExecutePanel
          v-if="workflowId"
          @createNodeGroup="showCreateNodeGroup"
        /> -->
      <Dag />
      <!-- <FormFolder /> -->
      <!-- </div> -->
    </div>
    <!-- <TablePanel
      class="form-panel"
      :isRightTableShow="isRightTableShow"
      :class="{'unfold-table-panel': isRightTableShow}"
    />-->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
// import GraphListWrap from '@/views/workflow/GraphListWrap.vue'
import ComponentPanel from '@/components/graph/component-panel.vue'
// import TablePanel from '@/views/workflow/FormPanel.vue'
import Dag from '@/components/graph/dag.vue'
// import MenuTips from '@/components/workflow/MenuTips.vue'

// import FormFolder from '@/components/workflow/FormFolder.vue'
// import WarningTips from '@/components/workflow/WarningTips.vue'
// import TimePanel from '@/components/workflow/TimePanel.vue'
// import ExecutePanel from '@/components/workflow/ExecutePanel.vue'

// import { CreateGraphStore, CopyGraphStore } from '@/stores/graph/GraphList'
// import { SwitchGraphController } from '@/stores/workflow/graphVisual/SwitchGraph'
// import {
//   GraphRequestStore,
//   GraphVisualStore
// } from '@/stores/workflow/graphVisual/GraphContent'
// import { MenuTipsController } from '@/stores/workflow/graphVisual/LocalState'
// import { GraphModalPayload, GraphItemType, NodeVoType } from '@/types/graph'

interface CopyReturnValue {
  graphId: number
  graphName: string
}

@Component({
  components: {
    // ExecutePanel,
    // TimePanel,
    // WarningTips,
    // FormFolder,
    // MenuTips,
    // GraphContent,
    Dag,
    ComponentPanel
    // TablePanel,
    // GraphListWrap
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
