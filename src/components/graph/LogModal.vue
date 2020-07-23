<template>
  <MtdModal
    class="editor-modal"
    :visible="nodeLogValue.isShow"
    :mask-closable="false"
    placement="top"
    @close="handleClose"
  >
    <h4 class="editor-modal__title">查看日志</h4>
    <div v-if="nodeLogValue.hasYarnLog" class="yarn-log">
      <a :href="nodeLogValue.yarnLogUrl" target="_blank">查看YARN日志</a>
    </div>

    <div class="editor-modal__code">
      <CodeEditor v-model="nodeLogValue.log" />
    </div>
    <footer slot="footer">
      <MtdButton type="primary" @click="handleClose">关闭</MtdButton>
    </footer>
  </MtdModal>
</template>

<style lang="scss" scoped>
.editor-modal {
  .mtd-modal {
    width: 90vw;
    height: 90vh;
  }
  &__title {
    font-size: 18px;
    color: #333333;
    font-weight: normal;
  }
  &__code {
    width: 80vw;
    height: 70vh;
    background: #f2f4fa;
    border-radius: 1px;
    margin-top: 20px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .yarn-log {
    text-align: right;
    margin-top: 10px;
    cursor: pointer;
  }
}
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { NodeLogStore } from '../../stores/graph/graphVisual/GraphVisual'
import CodeEditor from '../CodeEditor.vue'
@Component({
  components: {
    CodeEditor
  }
})
export default class LogModal extends Vue {
  private nodeLogState = NodeLogStore.state

  get nodeLogValue() {
    return this.nodeLogState.value
  }

  private handleClose() {
    NodeLogStore.hide()
  }
}
</script>
