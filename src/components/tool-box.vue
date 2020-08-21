<template>
  <div class="scale-panel" @click="handleChange">
    <li title="放大" id="expand" class="iconfont iconfangdasuoxiao_X"></li>
    <li title="缩小" id="shrink" class="iconfont iconfangdasuoxiao_Y"></li>
    <li title="实际尺寸" id="reset" class="iconfont iconshijichicun"></li>
    <li
      title="框选"
      id="select"
      :class="{ select: isSelecting }"
      class="iconfont iconkuangxuan"
    ></li>
    <li title="全屏" id="fullscreen" class="iconfont iconquanping2"></li>
    <li title="自动布局" id="layout" class="iconfont iconzidongpaiban"></li>
    <li title="适应画布" id="fit" class="iconfont iconshiyinghuabu"></li>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ToolBox extends Vue {
  @Prop({
    required: false
  })
  isSelecting!: boolean

  handleChange(e: MouseEvent) {
    this.$emit('click', e)
  }
}
</script>

<style lang="scss" scoped>
.scale-panel {
  position: absolute;
  display: flex;
  right: 10px;
  top: 10px;
  background: #f7f9ff;
  border: 1px solid #e8ecfa;
  color: #8a94c2;
  font-weight: 600;
  font-size: 18px;
  & > li {
    display: flex;
    height: 30px;
    width: 30px;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #e8ecfa;
    cursor: pointer;
    &:last-child {
      border-right: none;
    }
    &:hover {
      background: $l2;
    }
  }
  .select {
    color: #ff9801;
  }
}
</style>
