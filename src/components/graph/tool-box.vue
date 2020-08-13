<template>
  <div class="scale-panel" @click="handleChange">
    <li id="expand" class="iconfont iconfangdasuoxiao_X"></li>
    <li id="shrink" class="iconfont iconfangdasuoxiao_Y"></li>
    <li id="reset" class="iconfont iconhuiguiyuanwei-"></li>
    <li
      id="select"
      :class="{ select: isSelecting }"
      class="iconfont iconkuangxuan"
    ></li>
    <li id="fullscreen" class="iconfont iconquanping1"></li>
    <li id="layout" class="iconfont iconzidongpaiban"></li>
    <li id="fit" class="iconfont iconshipeihuabu"></li>
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
