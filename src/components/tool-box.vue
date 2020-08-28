<template>
  <div class="scale-panel" @click="handleChange" v-if="graph">
    <li title="放大" id="expand" class="iconfont iconfangdasuoxiao_X"></li>
    <li title="缩小" id="shrink" class="iconfont iconfangdasuoxiao_Y"></li>
    <li title="实际尺寸" id="reset" class="iconfont iconshijichicun"></li>
    <li
      title="框选"
      id="select"
      :class="{ select: isSelecting }"
      class="iconfont iconkuangxuan"
    ></li>
    <li title="全屏" id="fullScreen" class="iconfont iconquanping2"></li>
    <li title="自动布局" id="layout" class="iconfont iconzidongpaiban"></li>
    <li title="适应画布" id="fitView" class="iconfont iconshiyinghuabu"></li>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import GraphContent from './graph.vue'

@Component
export default class ToolBox extends Vue {
  get graph() {
    return (this.$parent as GraphContent).graph
  }

  get isSelecting() {
    return this.graph.eventController.isSelecting
  }

  handleChange(e: MouseEvent) {
    const { graph } = this
    const id = (e.target as HTMLElement).id
    switch (id) {
      case 'expand':
        graph.viewController.expand()
        break
      case 'shrink':
        graph.viewController.shrink()
        break
      case 'reset':
        graph.viewController.reset()
        break
      case 'select':
        graph.viewController.select()
        break
      case 'fullScreen':
        graph.viewController.fullScreen()
        break
      case 'layout':
        graph.layoutController.execute()
        break
      case 'fitView':
        graph.viewController.fitView()
        break
    }
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
    cursor: pointer;
    &:hover {
      background: $l2;
    }
  }
  .select {
    color: #ff9801;
  }
}
</style>
