<template>
  <mtd-tooltip placement="right" :size="size" v-bind="$attrs">
    <i class="iconfont icon-dayi"></i>
    <div slot="content">
      <slot></slot>
    </div>
  </mtd-tooltip>
</template>

<style lang="scss" scoped>
.icon-dayi {
  color: #606be1;
  font-size: 15px;
}
</style>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component({})
export default class ToolTip extends Vue {
  @Prop({
    default: 'small',
    type: String
  })
  size!: string
}
</script>

