<template>
  <div class="config-panel-wrapper">
    <div class="title">画布配置</div>

    <div class="form-item">
      <div class="label">图方向</div>
      <select v-model="graphConfigState.layout.options.rankdir">
        <option value="TB">TB（自上而下）</option>
        <option value="LR">LR（从左往右）</option>
        <option value="BT">BT（从下往上）</option>
        <option value="RL">RL（从右往左）</option>
      </select>
    </div>

    <div class="form-item">
      <div class="label">对齐方式</div>
      <select v-model="graphConfigState.layout.options.align">
        <option :value="undefined">默认（居中对齐）</option>
        <option value="UL">UL（上左对齐）</option>
        <option value="UR">UR（上右对齐）</option>
        <option value="DL">DL（下左对齐）</option>
        <option value="DR">DR（下右对齐）</option>
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
import { Component, Vue } from 'vue-property-decorator'
import GraphConfigStore from '@/stores/graph-config'
import GraphStore from '@/stores/graph'
import { editor } from 'monaco-editor'

@Component
export default class ConfigPanel extends Vue {
  editor: editor.IStandaloneCodeEditor = null as any
  graphConfigState = GraphConfigStore.state
  graphState = GraphStore.state
  actionList = {
    'drag-blank': '拖动画布',
    'drag-node': '拖动节点',
    'click-select': '点击选中',
    'connect-edge': '连接边',
    'wheel-move': '滚轮移动画布',
    'wheel-zoom': '双指缩放',
    'brush-select': '框选'
  }

  get graph() {
    return this.graphState.graph
  }

  async mounted() {
    this.editor = await editor.create(
      document.getElementById('dataContent') as HTMLElement,
      {
        value: JSON.stringify(this.graphConfigState.data, null, ' '),
        language: 'mysql',
        lineNumbers: 'off', // 不要行号
        scrollBeyondLastLine: false, // 去掉最后一行后面的空白
        overviewRulerBorder: false, // 不要滚动条的边框
        scrollbar: {
          horizontalHasArrows: false,
          verticalScrollbarSize: 4,
          horizontal: 'hidden'
        },
        minimap: {
          enabled: false
        },
        folding: false,
        contextmenu: false,
        tabSize: 1,
        lineDecorationsWidth: 0,
        automaticLayout: true,
        theme: 'vs-dark',
        renderIndentGuides: false
      }
    )

    this.editor.onDidBlurEditorText(() => {
      try {
        const content = JSON.parse(this.editor.getValue())
        this.graphConfigState.data = content
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('数据格式不正确')
      }
    })
    this.graph?.on('datachange', () => {
      const model = this.graph?.getDataModel()
      this.editor.setValue(JSON.stringify(model, null, ' '))
    })
  }

  beforeDestory() {
    this.editor.dispose()
  }
}
</script>

<style lang="scss" scoped>
.config-panel-wrapper {
  overflow: auto;
  width: 190px;
  height: 100%;
  box-sizing: border-box;
  background: #2d2d2d;
  border-left: 1px solid #222;
  color: #ddd;
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
    font-size: 12px;
    border: none;
    outline: none;
    padding: 3px 2px;
    vertical-align: middle;
    color: #ddd;
    cursor: pointer;
    background: #484848;
    &:focus {
      box-shadow: none;
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
  color: #ddd;
  text-align: left;
  padding: 10px 0px;
}
.data-content {
  width: 100%;
  display: block;
  height: 400px;
  box-sizing: border-box;
  white-space: pre-line;
  line-height: 1.4;
}
</style>
