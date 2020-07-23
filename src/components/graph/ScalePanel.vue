<template>
  <ul class="scale-panel" @click.capture="handleScale">
    <li id="expand">+</li>
    <li id="shrink">-</li>
    <li id="reset" class="iconfont icon-huiguiyuanwei"></li>
  </ul>
</template>

<style lang="scss" scoped>
$panel-height: 96px;
.scale-panel {
  position: absolute;
  right: 6px;
  bottom: 10px;
  width: 32px;
  height: $panel-height;
  background: #f7f9ff;
  border: 1px solid #e8ecfa;
  border-radius: 1px;
  color: #8a94c2;
  font-weight: 600;
  & > li {
    height: 33.33%;
    line-height: #{$panel-height / 3};
    border-bottom: 1px solid #e8ecfa;
    cursor: pointer;
    &:last-child {
      border-bottom: none;
      font-size: 12px;
    }
  }
  #expand,
  #shrink {
    font-size: 16px;
    line-height: 29px;
  }
}
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class ScalePanel extends Vue {
  private handleScale(event: MouseEvent) {
    const target = event.target as HTMLLIElement
    this.$emit('scaleChange', target.id)
  }
}
</script>
