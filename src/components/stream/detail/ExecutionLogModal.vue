<template>
  <mtd-modal
    v-model="localShow"
    title="执行日志"
    width="1300px"
    :destroy-on-close="true"
    placement="top"
  >
    <div class="content" id="logTextWrap">
      <span id="logText">{{ log.message || log.log }}</span>
    </div>
  </mtd-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import {
  PublishHistoryStore,
  JobDeployingLogStore
} from '@/stores/stream/detail'
import { Node } from '@ss/mtd-vue/types/tree'

@Component
export default class ExecutionLogModal extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean

  @Prop({
    type: String,
    default: ''
  })
  private s3LogKey!: string

  @Prop({
    default: ''
  })
  private taskId!: number | string

  @Prop({
    default: ''
  })
  private jobId!: number | string

  @Prop({
    type: Boolean,
    default: false
  })
  private isDeploying!: boolean

  private publishSate = this.isDeploying
    ? JobDeployingLogStore.state
    : PublishHistoryStore.state

  private timeId!: number

  get localShow() {
    return this.show
  }

  set localShow(v: boolean) {
    this.$emit('update:show', v)
  }

  get log() {
    return this.publishSate
  }

  @Watch('s3LogKey')
  private handleKeyChange(v: string) {
    if (v.length && !this.isDeploying) {
      PublishHistoryStore.fetchLog(
        {
          s3LogKey: v
        },
        {
          taskId: this.taskId,
          jobId: this.jobId
        }
      )
    }
  }

  @Watch('localShow')
  private handleLocalShow(v: boolean) {
    if (v && this.isDeploying) {
      this.timeId = setInterval(async () => {
        const value = await JobDeployingLogStore.fetchDeployingLog({
          taskId: this.taskId,
          jobId: this.jobId
        })
        if (value) {
          clearInterval(this.timeId)
        }

        this.$nextTick(() => {
          const logTextWrap = document.getElementById(
            'logTextWrap'
          ) as HTMLDivElement
          const logText = document.getElementById('logText') as HTMLDivElement
          logTextWrap.scrollTop = logText.offsetHeight
        })
      }, 1000)
    }

    if (!v) {
      clearInterval(this.timeId)
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  background: rgb(29, 30, 25);
  white-space: pre-line;
  word-break: break-word;
  height: 650px;
  overflow: auto;
  padding: 10px;
  border-radius: 5px;
  color: #aaa;
  line-height: 1.5;
}
</style>
