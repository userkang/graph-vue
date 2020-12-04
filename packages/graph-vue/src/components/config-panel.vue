<template>
  <div class="config-panel-wrapper">
    <div class="title">画布配置</div>

    <div class="form-item">
      <div class="label">图方向</div>
      <select v-model="graphConfigState.drection">
        <option value="TB">TB（自上而下）</option>
        <option value="LR">LR（从左往右）</option>
      </select>
    </div>

    <div class="form-item">
      <div class="label">交互行为</div>
      <div class="checkbox-item" v-for="(item, key) in actionList" :key="key">
        <input
          :id="key"
          type="checkbox"
          :value="key"
          v-model="graphConfigState.action"
        />
        <label :for="key">{{ item }}</label>
      </div>
    </div>

    <div class="form-item">
      <div class="label">数据</div>
      <div class="data-content" id="dataContent"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { GraphConfigStore } from '@/stores/graph-config'
import { editor } from 'monaco-editor'

@Component
export default class ConfigPanel extends Vue {
  editor = null
  graphConfigState = GraphConfigStore.state
  actionList = {
    'drag-svg': '拖动画布',
    'drag-node': '拖动节点',
    'click-select': '点击选中',
    'create-edge': '创建边',
    'wheel-move': '滚轮移动画布',
    'wheel-zoom': '双指缩放',
    'brush-select': '框选'
  }

  mounted() {
    this.editor = editor.create(document.getElementById('dataContent'), {
      value: JSON.stringify(this.graphConfigState.data),
      language: 'json',
      lineNumbers: 'off',
      scrollBeyondLastLine: false,
      overviewRulerBorder: false, // 不要滚动条的边框
      scrollbar: {
        horizontalHasArrows: false,
        verticalScrollbarSize: 4,
        horizontal: 'hidden'
      },
      minimap: {
        // 不要小地图
        enabled: false
      },
      folding: false,
      contextmenu: false,
      formatOnPaste: true,
      tabSize: 1,
      lineDecorationsWidth: 0
    })

    this.editor.onDidBlurEditorText(e => {
      try {
        const content = JSON.parse(this.editor.getValue())
        this.graphConfigState.data = content
      } catch (error) {
        console.log('数据格式不正确')
      }
    })
  }

  // @Watch('configState.data')
  // handleDataChange() {
    // this.editor.setValue(this.graphConfigState.data)
  // }
}
</script>

<style lang="scss" scoped>
.config-panel-wrapper {
  overflow: auto;
  width: 190px;
  height: 100%;
  box-sizing: border-box;
  background: $l1;
  border-left: 1px solid $l2;
  color: #666;
  font-size: 14px;
  padding: 5px 10px;
  .form-item {
    width: 100%;
    margin-bottom: 7px;
  }
  .label {
    font-size: 12px;
    padding: 5px 0;
    font-weight: 800;
  }
  input,
  select,
  textarea {
    line-height: 1;
    font-size: 12px;
    border: 1px solid #eee;
    outline: none;
    padding: 3px 2px;
    box-shadow: 0 2px 3px 0 #eee;
    vertical-align: middle;
    cursor: pointer;
    &:focus {
      border: 1px solid rgb(9, 104, 194);
    }
  }
  select {
    width: 100%;
  }
  input[type='text'] {
    width: 100%;
  }
  label {
    padding: 4px 2px;
    font-size: 12px;
    cursor: pointer;
  }
  .checkbox-item {
    display: inline-flex;
    align-items: center;
    margin-right: 10px;
    margin-bottom: 5px;
    height: 20px;
  }
}
.title {
  font-size: 12px;
  color: $d1;
  text-align: left;
  padding: 10px 0px;
}
.data-content {
  width: 100%;
  display: block;
  height: 400px;
  box-sizing: border-box;
  white-space: pre-line;
}
</style>
