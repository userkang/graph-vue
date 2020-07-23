<template>
  <div>
    <mtd-loading :loading="isLoading">
      <BasicTitle text="基础信息" />
      <Info />
      <BasicTitle text="训练模型" />
      <TrainModel ref="train" />
      <BasicTitle text="引擎参数设置" />
      <EngineParams ref="enginParams" />
      <BasicTitle text="训练数据读取" />
      <TrainData />
    </mtd-loading>
    <SelectStartVersionModal
      :show.sync="isStartupModalShow"
      :title="detail.jobName"
      @startup="startup"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import BasicTitle from './BasicTitle.vue'
import Info from './detail/Info.vue'
import TrainModel from './detail/TrainModel.vue'
import EngineParams from './detail/EngineParams.vue'
import TrainData from './detail/TrainData.vue'
import SelectStartVersionModal from './detail/SelectStartupVersionModal.vue'
import { StreamInfoStore } from '@/stores/stream/detail'
import eventBus from './eventBus'
import { StreamJobVo, StartupPayload } from '@/types/stream'
@Component({
  components: {
    BasicTitle,
    Info,
    TrainModel,
    EngineParams,
    TrainData,
    SelectStartVersionModal
  }
})
export default class BasicInfo extends Vue {
  private detailState = StreamInfoStore.state
  private isStartupModalShow = false

  get isLoading() {
    return this.detailState.isLoading
  }

  get detail() {
    return this.detailState.value
  }

  private save() {
    this.$nextTick(() => {
      const $train = this.$refs.train as any
      const $enginParams = this.$refs.enginParams as any
      Promise.all([$train.validate(), $enginParams.validate()]).then(() => {
        const { taskId, jobId } = this.$route.params
        StreamInfoStore.updateStreamInfo(this.detail as StreamJobVo, {
          taskId,
          jobId
        }).then((v: boolean) => {
          if (v) {
            this.$mtd.message({
              message: '保存成功',
              type: 'success'
            })
          }
        })
      })
    })
  }

  private startup(startParams: StartupPayload) {
    const { jobId, taskId } = this.$route.params
    StreamInfoStore.satartJob(startParams, { jobId, taskId }).then(
      (v: boolean) => {
        if (v) {
          this.fetchJobDetail()
        }
      }
    )
  }

  private shutdown() {
    const { jobId, taskId } = this.$route.params
    StreamInfoStore.shutdownStreamJob({
      jobId,
      taskId
    }).then((v: boolean) => {
      if (v) {
        StreamInfoStore.fetchStreamInfo({
          jobId,
          taskId
        })
      }
    })
  }

  private async del() {
    await this.$mtd.confirm({
      title: '提示',
      message:
        '删除操作将关闭正在运行中的任务，并且删除其相关的一切配置、指标和日志。是否确认删除？',
      width: '430px',
      type: 'warning',
      showCancelButton: true,
      okButtonText: '删除',
      okButtonProps: {
        type: 'danger'
      }
    })

    const { jobId, taskId } = this.$route.params
    await StreamInfoStore.delJob({
      jobId,
      taskId
    }).then((v: boolean) => {
      if (v) {
        this.$router.push({
          name: 'streamList'
        })
      }
    })
  }

  private fetchJobDetail() {
    const { jobId, taskId } = this.$route.params
    StreamInfoStore.fetchStreamInfo({ jobId, taskId })
  }

  private addEvents() {
    eventBus
      .$on('save', this.save)
      .$on('shotdown', this.shutdown)
      .$on('del', this.del)
      .$on('startup', () => (this.isStartupModalShow = true))
  }

  private mounted() {
    this.addEvents()
  }

  private beforeDestroy() {
    eventBus.$off()
    StreamInfoStore.reset()
  }
}
</script>

<style lang="scss" scoped>
</style>
