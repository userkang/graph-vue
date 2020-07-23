<template>
  <MtdTooltip :content="warningTipsValue.text" placement="top" :visible="isShowTips">
    <span
      class="warning-tips"
      :style="{
            top: warningTipsValue.y - 10 + 'px',
            left: warningTipsValue.x + 'px'
        }"
    ></span>
  </MtdTooltip>
</template>

<style lang="scss" scoped>
.warning-tips {
  position: fixed;
  z-index: 999;
  background: red;
}
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { WarningTipsController } from '../../stores/graph/graphVisual/LocalState'

@Component
export default class WarningTips extends Vue {
  private warningTipsState = WarningTipsController.state
  private isTooltipShow = true

  get isShowTips() {
    return this.warningTipsState.isShow
  }

  get warningTipsValue() {
    return this.warningTipsState.value
  }
}
</script>
