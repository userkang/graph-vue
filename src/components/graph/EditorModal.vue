<template>
  <MtdModal
    v-model="editorDisplayValue.isShow"
    placement="top"
    class="editor-modal"
    @close="hideEditorModal"
    :mask-closable="false"
  >
    <div slot="title">
      <h4 style="font-size: 18px;color: #333333;font-weight: normal">脚本编辑框</h4>
    </div>

    <div class='select-wrap'>
      <span class='msg-name-long'>版本选择</span>
      <mtd-select class="value-select" @change="handleParamVersionIdChange" v-model="paramVersionId">
        <mtd-option
          class='msg-value-short'
          v-for="(item,index) in ParamVersionList"
          :key="index"
          :label="item.paramVersionId"
          :value="item.paramVersionId">
            <p>{{ item.paramVersionId }}</p>
            <span class="gray-text">编辑者：{{ item.editor }} 编辑时间：{{item.updateTime}}</span>
          </mtd-option>
      </mtd-select>

      <span class='msg-name-long'>自定义参数</span>
      <mtd-input 
        v-model="ParamVersionContent.customVariable"
        class='msg-value-short' 
        type="text" 
        placeholder="-v">
      </mtd-input>

      <span class='upstream' v-for="(item, index) in upstreamList" :key="index">上游数据表{{index + 1}}：
        <mtd-tooltip :content="item.name" theme="light" placement='top'>
          <p>{{item.name}}</p>
        </mtd-tooltip>
      </span>

    </div>

    <div class="editor-modal-content">
      <div v-if="isLoading" class='loadingWrap'>
        <mtd-loading message='' :loading="true"></mtd-loading>
      </div>
      <CodeEditor
        v-model="ParamVersionContent.value"
        width="calc(100vw - 200px)"
        height="50vh"
        class="editor-wrap"
        @onChange="handleCodeChange"
      />
      <div class="code-gap">
        <span>Running result</span>
        <i class="iconfont icon-zhankai" :class="{'rotate': isLogShow}" @click="handleLogShow"></i>
      </div>
      <CodeEditor
        v-if="isLogShow"
        width="calc(100vw - 200px)"
        height="20vh"
        v-model="logContent"
        class="editor-wrap"
      />
    </div>
    <div style='margin-top:10px' slot="footer">
      <MtdButton @click="hideEditorModal" :disabled="!isExecuteEnable">取消</MtdButton>
      <MtdButton
        class="submit-btn"
        :disabled="!canHandle"
        style="margin-left: 10px"
        @click="handleSave(false)"
      >保存</MtdButton>
      <MtdButton
        class="submit-btn"
        style="margin-left: 10px;"
        @click="handleExecute"
        :disabled="!canHandle"
      >
        <div style="display: flex; align-items: center;justify-content: center">
          运行
          <img
            v-if="!isExecuteEnable"
            src="../../assets/running-rotate.svg"
            class="running-rotate"
          />
        </div>
      </MtdButton>
    </div>
  </MtdModal>
</template>

<style lang="scss">
.editor-modal {
  .mtd-modal {
    max-height: 100vh;
    max-width: 100vw;
  }
  .code-gap {
    height: 22px;
    width: calc(100vw - 200px);
    background: #515151;
    padding: 0 20px;
    span {
      font-size: 14px;
      color: #9b9f9b;
    }
    i {
      float: right;
      color: #9b9f9b;
      font-size: 12px;
      cursor: pointer;
      &.rotate {
        transform: rotate(180deg);
      }
    }
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .running-rotate {
    animation-name: rotate;
    animation-iteration-count: infinite;
    animation-duration: 2s;
    color: #fff;
    width: 14px;
    height: 14px;
    display: inline-block;
    margin-left: 4px;
  }
  .value-select {
    margin-right: 20px;
  }
  .msg-name-long {
    margin-right: 10px;
  }
  .editor-modal-content {
    position: relative;
  }
  .loadingWrap {
    width: 100%;
    height: 100%;
    z-index: 99;
    position: absolute;
    top: 21px;
    left: 2px;
    right: 0;
    bottom: 0;
    background: #fff;
    opacity: 0.2;
  }
  .upstream {
    display: inline-block;
    margin-left: 20px;
    p {
      display: inline-block;
      width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: bottom;
    }
  }
}
.gray-text {
  color: #aaa;
}
</style>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import { EditorModalDisplayController, EditorModalPayload } from '../../stores/graph/graphVisual/LocalState'
import { ExecuteScriptParamStore, NodeParamStore, ParamVersionStore, ParamVersionContentStore } from '../../stores/graph/graphVisual/GraphVisual'
import CodeEditor from '../CodeEditor.vue'
import { GlobalState } from '../../stores/global'
import { ParamVersionVo, NodeUpstreamVo } from '../../types/graph'

@Component({
  components: {
    CodeEditor
  }
})
export default class EditorModal extends Vue {
  private editorDisplayState = EditorModalDisplayController.state
  private isLogShow: boolean = true
  private isLoading: boolean = false
  private isExecuteEnable: boolean = true
  private codeContent: string = ''
  private logContent: string = ''
  private nodeParamState = NodeParamStore.state
  private ParamVersionState = ParamVersionStore.state
  private ParamVersionContentState = ParamVersionContentStore.state
  private paramVersionId: number = 0;
  private oldCustomVariable!: string;
  private upstreamList: NodeUpstreamVo[] = [];
  private selectedVersionInfo: ParamVersionVo = {
    paramVersionId: 0,
    paramId: 0,
    value: '',
    createTime: '',
    updateTime: '',
    customVariable: '',
    creator: '',
    editor: ''
  };


  @Prop(Number)
  private graphId!: number;

  @Prop(String)
  private name!: string;

  private get ParamVersionList() {
    return this.ParamVersionState.data;
  }

  private get ParamVersionContent() {
    return this.ParamVersionContentState.data;
  }

  get lastNodeId() {
    return this.nodeParamState.lastNodeId
  }

  get editorDisplayValue() {
    return this.editorDisplayState.value
  }

  get canEditGraph() {
    return (this.$store.state as GlobalState).isCurrentGraphCanBeEdit
  }

  get canHandle() {
    return this.isExecuteEnable && this.canEditGraph
  }

  private handleParamVersionIdChange(paramVersionId: number) {
    this.paramVersionId = paramVersionId;
    const { nodeId, paramId } = this.editorDisplayValue
    ParamVersionContentStore.getVersionContent(nodeId, paramId, paramVersionId);
  }

  private handleLogShow() {
    this.isLogShow = !this.isLogShow
  }

  private hideEditorModal() {
    this.logContent = ''
    EditorModalDisplayController.hide()
  }

  private handleCodeChange(content: string) {
    this.codeContent = content
  }

  private async handleSave(isExecute: boolean|undefined) {
    this.isLoading = true;
    const { paramId, value } = this.editorDisplayValue
    if (this.codeContent !== value || this.oldCustomVariable !== this.ParamVersionContent.customVariable) {
      await NodeParamStore.saveParamVersionContent({
        graphId: this.graphId,
        paramVersionId: this.paramVersionId,
        paramId,
        value: this.codeContent + '',
        tabIndex: 0,
        customVariable: this.ParamVersionContent.customVariable || '-v'
      })
      this.init();
      await NodeParamStore.request(NodeParamStore.state.lastNodeId, 0)
    }
    this.isLoading = false;
    if(!isExecute) {
      EditorModalDisplayController.hide()
    }
  }

  private async handleExecute() {
    if (this.isExecuteEnable) {
      const { nodeId, paramId } = this.editorDisplayValue
      this.isExecuteEnable = false
      await this.handleSave(true)
      const log = await ExecuteScriptParamStore.request({
        nodeId,
        paramId,
        value: this.codeContent
      })
      await NodeParamStore.request(this.lastNodeId, 0)
      if (log) {
        this.logContent = log
      }
      this.isExecuteEnable = true
    }
    this.isLoading = false;
  }

  @Watch('editorDisplayValue', { deep: true })
  private watchEditorValue(value: EditorModalPayload) {
    this.codeContent = value.value
  }

  private async init() {
    this.isLoading = true;
    const { nodeId, paramId } = this.editorDisplayValue
    const list = await ParamVersionStore.getVersionList(nodeId, paramId);
    this.selectedVersionInfo = await ParamVersionContentStore.getVersionContent(nodeId, paramId, undefined);
    if(this.name === 'SQLTool') {
      this.upstreamList = await ParamVersionContentStore.getUpstreamContent(this.graphId, nodeId);
    }
    this.paramVersionId = this.selectedVersionInfo.paramVersionId || 0;
    this.oldCustomVariable = this.selectedVersionInfo.customVariable;
    this.codeContent = this.selectedVersionInfo.value
    this.isLoading = false;
  }

  private created() {
    this.init();
  }
}
</script>
