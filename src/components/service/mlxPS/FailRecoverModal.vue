<template>
  <mtd-modal v-model="localShow" title="故障恢复">
    <mtd-row class="sub-title">恢复进度</mtd-row>
    <mtd-steps
      :active="progressList[this.psStatus].step"
      :status="progressList[this.psStatus].status"
      size="small"
      :is-center="false"
    >
      <mtd-step title="初始化"></mtd-step>
      <mtd-step title="启动ps"></mtd-step>
      <mtd-step title="加载模型"></mtd-step>
      <mtd-step title="启动fetcher"></mtd-step>
      <mtd-step title="启动Flink任务"></mtd-step>
    </mtd-steps>

    <mtd-row class="sub-title">恢复日志</mtd-row>

    <div class="log-wrapper">
      <CodeEditor height="450px" :value="log" />
    </div>

    <div slot="footer">
      <mtd-button @click="close">取消</mtd-button>
      <mtd-button
        type="primary"
        @click="startRecover"
        :disabled="!couldStart"
        :loading="loading"
      >{{ loading? '恢复中' : '开始恢复' }}</mtd-button>
    </div>
  </mtd-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import CodeEditor from '@/components/CodeEditor.vue'
import { MLXPSRecoverStore } from '@/stores/service/mlxPS/mlxPS'
import { progressList } from '@/metaData/mlxPS'

@Component({
  components: {
    CodeEditor
  }
})
export default class FailRecoverModal extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  show = false

  psRecoverState = MLXPSRecoverStore.state

  couldStart = false
  progressList = progressList
  loading = false

  get log() {
    return this.psRecoverState.data.log
  }

  get psStatus() {
    return this.psRecoverState.data.status
  }

  get localShow() {
    if (this.show) {
      this.init()
    }
    return this.show
  }

  set localShow(v: boolean) {
    this.$emit('update:show', v)
  }

  close() {
    this.localShow = false
  }

  async sleep() {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000)
    })
  }

  async startRecover() {
    const id = this.$route.params.id
    const code = await MLXPSRecoverStore.startPsRecover(id)

    if (code === 0) {
      this.loading = true
      do {
        await MLXPSRecoverStore.getPsRecoverProgress(id)
        const status = this.progressList[this.psStatus].status
        await this.sleep()
      } while (!['error', 'finish'].includes(status))
    }
    this.loading = false
  }

  async init() {
    const id = this.$route.params.id
    this.couldStart = await MLXPSRecoverStore.checkPsRecover(id)
    await MLXPSRecoverStore.getPsRecoverProgress(id)
  }
}
</script>

<style lang="scss" scoped>
.sub-title {
  font-weight: 800;
  margin: 15px 0;
}
::v-deep .vue-ace-wrap {
  border-radius: 0px;
}
</style>