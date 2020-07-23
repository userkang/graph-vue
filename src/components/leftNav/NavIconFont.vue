<template>
  <i class="file-icon-font iconfont" :class="[icon, {'is-fold-font': isFold}]"></i>
</template>

<style lang="scss" scoped>
.file-icon-font {
  display: inline-block;
  width: 14px;
  height: 15px;
  margin-right: 9px;
  margin-top: -36px;
  color: #8a94c2;
  &.is-fold-font {
    float: right;
    margin-top: 0;
    margin-right: 26px;
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class NavIconFont extends Vue {
  @Prop({
    type: String,
    default: 'icon-cq-icon-leftfile'
  })
  private icon!: string

  @Prop({
    type: Boolean,
    default: false
  })
  private isFold!: boolean
}
</script>
