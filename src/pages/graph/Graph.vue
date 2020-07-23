<template>
  <div class="experiment-graph-wrap">
    <!-- <MenuTips v-if="menuTipsValue.isShow" :tips="tips" />
    <WarningTips />
    <ComponentPanel @addNode="addNode" /> -->
    <div
      class="main-center-wrap"
      :class="{'unfold-center-wrap': isRightTableShow}"
      @transitionend="handleTransitionEnd"
    >
      <GraphListWrap ref="graphListWrap" />
      <div class="main-center-bottom">
        <ExecutePanel v-if="workflowId" @createNodeGroup="showCreateNodeGroup" />
        <GraphContent @addNode="addNode" />
        <FormFolder />
      </div>
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
import GraphListWrap from '@/views/workflow/GraphListWrap.vue'
import ComponentPanel from '@/views/workflow/ComponentPanel.vue'
import TablePanel from '@/views/workflow/FormPanel.vue'
import GraphContent from '@/views/workflow/GraphContent.vue'
import MenuTips from '@/components/workflow/MenuTips.vue'

import FormFolder from '@/components/workflow/FormFolder.vue'
import WarningTips from '@/components/workflow/WarningTips.vue'
import TimePanel from '@/components/workflow/TimePanel.vue'
import ExecutePanel from '@/components/workflow/ExecutePanel.vue'

import { CreateGraphStore, CopyGraphStore } from '@/stores/graph/GraphList'
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
    GraphContent,
    // ComponentPanel,
    // TablePanel,
    // GraphListWrap
  }
})
export default class Graph extends Vue {}
</script>

<style lang="scss" scoped>
@mixin tablePanelAnimation {
  transition-property: width;
  transition-duration: 0.5s;
}

.experiment-graph-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;

  &:after {
    clear: both;
    display: block;
    visibility: hidden;
    content: '';
  }

  .form-panel {
    width: 0;
    box-sizing: border-box;
    box-shadow: 0 1px 2px 0 rgba(50, 54, 101, 0.08);

    &.unfold-table-panel {
      width: 200px;
      min-width: 200px;
      max-width: 40%;
      overflow: auto;
    }
  }

  .main-center-wrap {
    flex: 1;
    .main-center-bottom {
      position: relative;
      display: flex;
      height: calc(100% - 44px);
    }
  }
}
</style>