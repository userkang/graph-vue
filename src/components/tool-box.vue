<template>
  <div class="scale-panel" @click="handleChange" v-if="graph">
    <li title="放大" id="expand" class="iconfont iconfangdasuoxiao_X"></li>
    <li title="缩小" id="shrink" class="iconfont iconfangdasuoxiao_Y"></li>
    <li title="实际尺寸" id="reset" class="iconfont iconshijichicun"></li>
    <li
      title="框选"
      id="select"
      :class="{ select: isBrushing }"
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
  @Prop()
  isBrushing = false

  get graph() {
    return (this.$parent as GraphContent).graph
  }

  handleChange(e: MouseEvent) {
    const { graph } = this
    const id = (e.target as HTMLElement).id
    switch (id) {
      case 'expand':
        this.expand()
        break
      case 'shrink':
        this.shrink()
        break
      case 'reset':
        this.reset()
        break
      case 'select':
        this.brushSelect()
        break
      case 'fullScreen':
        this.graph.fullScreen()
        break
      case 'layout':
        graph.layout()
        break
      case 'fitView':
        this.graph.fitView()
        break
    }
  }

  expand() {
    this.graph.zoom(this.graph.getZoom() + 0.1)
  }

  shrink() {
    this.graph.zoom(this.graph.getZoom() - 0.1)
  }

  reset() {
    this.graph.zoom(1)
  }

  brushSelect() {
    this.graph.setBrushing(!this.graph.getBrushing())
    this.$emit('clickBrush', this.graph.getBrushing())
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
