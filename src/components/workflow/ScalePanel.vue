<template>
  <ul class="scale-panel" @click="handleScale">
    <li id="expand">+</li>
    <li id="shrink">-</li>
    <li
      id="select"
      :class="{ 'select' : selectState}"
      @click="select"
      class="iconfont icon-kuangxuan"
    ></li>
    <li id="reset" class="iconfont icon-huiguiyuanwei"></li>
    <!-- <li id="reset" class="iconfont icon-huiguiyuanwei"></li> -->
  </ul>
</template>

<style lang="scss" scoped>
.scale-panel {
  position: absolute;
  right: 6px;
  bottom: 10px;
  width: 32px;
  background: #f7f9ff;
  border: 1px solid #e8ecfa;
  border-radius: 1px;
  color: #8a94c2;
  font-weight: 600;
  & > li {
    height: 30px;
    line-height: 30px;
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
  .select {
    color: #ff9801;
  }
}
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { GraphVisualStore } from '@/stores/workflow/graphVisual/GraphContent'

@Component
export default class ScalePanel extends Vue {
  graphVisualState = GraphVisualStore.state

  get selectState() {
    return this.graphVisualState.selecting
  }

  handleScale(event: MouseEvent) {
    const target = event.target as HTMLLIElement
    this.$emit('scaleChange', target.id)
  }

  select(e: MouseEvent) {
    e.stopPropagation()
    this.graphVisualState.selecting = true
  }
}
</script>
