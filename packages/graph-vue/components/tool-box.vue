<template>
  <div class="graph-vue-tool-box" @click="handleChange">
    <li
      title="撤销"
      id="undo"
      :class="{ 'graph-vue-tool-box-disable': !undoEnable }"
      class="graph-vue-tool-box-item iconundo"
    ></li>
    <li
      title="回撤"
      id="redo"
      :class="{ 'graph-vue-tool-box-disable': !redoEnable }"
      class="graph-vue-tool-box-item iconredo"
    ></li>
    <li
      title="放大"
      id="expand"
      class="graph-vue-tool-box-item iconfangdasuoxiao_X"
    ></li>
    <li
      title="缩小"
      id="shrink"
      class="graph-vue-tool-box-item iconfangdasuoxiao_Y"
    ></li>
    <li
      title="实际尺寸"
      id="reset"
      class="graph-vue-tool-box-item iconshijichicun"
    ></li>
    <li
      title="框选"
      id="select"
      :class="{ 'graph-vue-tool-box-select': isBrushing }"
      class="graph-vue-tool-box-item iconkuangxuan"
    ></li>
    <li
      title="全屏"
      id="fullScreen"
      class="graph-vue-tool-box-item iconquanping2"
    ></li>
    <li
      title="自动布局"
      id="layout"
      class="graph-vue-tool-box-item iconzidongpaiban"
    ></li>
    <li
      title="适应画布"
      id="fitView"
      class="graph-vue-tool-box-item iconshiyinghuabu"
    ></li>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isBrushing: false,
      undoEnable: false,
      redoEnable: false
    }
  },
  computed: {
    graph() {
      return this.$parent.graph
    }
  },
  methods: {
    handleChange(e) {
      if (!this.graph) {
        return
      }
      const id = e.target.id
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
          this.graph.layout()
          break
        case 'fitView':
          this.graph.fitView()
          break
      }
    },
    expand() {
      this.graph.zoom(this.graph.getZoom() + 0.1)
    },
    shrink() {
      this.graph.zoom(this.graph.getZoom() - 0.1)
    },
    reset() {
      this.graph.zoom(1)
    },
    brushSelect() {
      // 通过设置 brushing 属性，避免 brush-select 和 drag-blank 行为拖动事件的冲突问题。
      this.isBrushing = !this.graph.get('brushing')
      this.graph.set('brushing', this.isBrushing)
    }
  },
  mounted() {
    this.graph.on('stackchange', () => {
      this.undoEnable = this.graph.getUndoStack().length > 0
      this.redoEnable = this.graph.getRedoStack().length > 0

      this.graph.on('mouseup', () => {
          if (this.graph.get('brushing')) {
            this.graph.set('brushing', false)
            this.isBrushing = false
          }
        })
      })
  }
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'graph-vue-iconfont'; /* Project id 1805014 */
  src: url('../assets/iconfont.woff2') format('woff2'),
    url('../assets/iconfont.woff') format('woff'),
    url('../assets/iconfont.ttf') format('truetype');
}
.graph-vue-tool-box-item {
  font-family: 'graph-vue-iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.iconredo:before {
  content: '\f094';
}

.iconundo:before {
  content: '\f124';
}

.iconshiyinghuabu:before {
  content: '\e635';
}

.iconshijichicun:before {
  content: '\ed13';
}

.iconquanping2:before {
  content: '\e643';
}

.iconshiyinghuabu1:before {
  content: '\e612';
}

.iconzidongpaiban:before {
  content: '\e77c';
}

.iconfangdasuoxiao_X:before {
  content: '\e81d';
}

.iconfangdasuoxiao_Y:before {
  content: '\e62b';
}

.iconhuiguiyuanwei-:before {
  content: '\e723';
}

.iconkuangxuan:before {
  content: '\e6fd';
}

.iconzujian:before {
  content: '\e992';
}

.iconjian:before {
  content: '\e651';
}

.iconjian-square:before {
  content: '\e600';
}

.iconjia:before {
  content: '\e601';
}

.iconicon-zengjia:before {
  content: '\e602';
}
.graph-vue-tool-box {
  position: absolute;
  display: flex;
  right: 10px;
  top: 10px;
  background: #383838;
  border: 1px solid #222;
  color: #ddd;
  font-weight: 400;
  font-size: 18px;
}
.graph-vue-tool-box-item {
  display: flex;
  height: 30px;
  width: 30px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.graph-vue-tool-box-item:hover {
  background: #484848;
}
.graph-vue-tool-box-select {
  color: #ff9801;
}
#graph-vue-undo,
#graph-vue-redo {
  font-size: 14px;
}
.graph-vue-tool-box-disable {
  cursor: not-allowed;
  color: #585858;
  pointer-events: none;
}
.graph-vue-tool-box-disable:hover {
  background: none;
}
</style>
