<template>
  <div class="scale-panel" @click="handleChange" v-if="graph">
    <li
      title="撤销"
      id="undo"
      :class="{ disable: !undoEnable }"
      class="iconfont iconundo"
    ></li>
    <li
      title="回撤"
      id="redo"
      :class="{ disable: !redoEnable }"
      class="iconfont iconredo"
    ></li>
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

  undoEnable = false
  redoEnable = false

  get graph() {
    return (this.$parent as GraphContent).graph
  }

  handleChange(e: MouseEvent) {
    const { graph } = this
    const id = (e.target as HTMLElement).id
    switch (id) {
      case 'undo':
        this.graph.undo()
        break
      case 'redo':
        this.graph.redo()
        break
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

  mounted() {
    this.graph.on('stackchange', () => {
      this.undoEnable = this.graph.getUndoStack().length > 0
      this.redoEnable = this.graph.getRedoStack().length > 0
    })
  }
}
</script>

<style lang="scss" scoped>
.scale-panel {
  position: absolute;
  display: flex;
  right: 10px;
  top: 10px;
  background: #383838;
  border: 1px solid #222;
  color: #ddd;
  font-weight: 400;
  font-size: 18px;
  & > li {
    display: flex;
    height: 30px;
    width: 30px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      background: #484848;
    }
  }
  .select {
    color: #ff9801;
  }
  #undo,
  #redo {
    font-size: 14px;
  }
  .disable {
    cursor: not-allowed;
    color: #585858;
    &:hover {
      background: none;
    }
  }
}
</style>
