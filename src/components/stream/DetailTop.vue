<template>
  <div>
    <div class="wrap-top">
      <div>
        <span @click="back" style="cursor: pointer">
          <mtd-icon class="back" name="arrow-left"></mtd-icon>
        </span>
        <span class="line">|</span>
        <span class="name">{{ detail.jobName }}</span>
        <JobStatus :status="detail.jobStatus" />
        <mtd-tooltip content="前往实时计算平台可查看当前作业指标、日志、报警等信息。" size="small" placement="bottom-end">
          <span style="margin-left: 14px;">
            <a target="_blank" :href="jumpUrl">实时计算平台</a>
          </span>
        </mtd-tooltip>
      </div>
      <div>
        <mtd-button
          size="small"
          class="btn"
          v-if="active === 'basic-info' && ['DOWN', 'FAILED', 'KILLED'].includes(detail.jobStatus)"
          @click="save"
        >
          <i class="iconfont icon-cunchushiyong"></i>
          保存
        </mtd-button>
        <mtd-button
          v-if="['DOWN', 'FAILED', 'KILLED'].includes(detail.jobStatus)"
          size="small"
          class="btn"
          @click="del"
        >
          <i class="iconfont icon-Dashboard-shanchu"></i>
          删除
        </mtd-button>
        <mtd-button
          v-if="['RUNNING', 'FAILED'].includes(detail.jobStatus)"
          size="small"
          class="btn"
          @click="shutdown"
        >停止</mtd-button>
        <mtd-button v-if="['RUNNING'].includes(detail.jobStatus)" size="small" class="btn">
          <a :href="detail.trackingUrl" target="_blank">作业日志</a>
        </mtd-button>
        <mtd-button
          v-if="['DOWN', 'FAILED', 'KILLED'].includes(detail.jobStatus)"
          size="small"
          type="primary"
          class="btn"
          @click="startup"
        >启动</mtd-button>
        <mtd-button
          size="small"
          class="btn"
          v-if="!['DOWN'].includes(detail.jobStatus)"
          @click="isShowLogModal=true"
        >执行日志</mtd-button>
        <!-- <mtd-button
                size="small"
                class="btn"
            >
                <i class="iconfont icon-jiqi-chakanrizhi"></i>
                指标模型
        </mtd-button>-->
      </div>
    </div>
    <ExecutionLogModal
      :show.sync="isShowLogModal"
      :taskId="$route.params.taskId"
      :jobId="$route.params.jobId"
      :isDeploying="true"
    />
  </div>
</template>

<script lang="ts">
// 基本信息 tab 下有 保存
// DOWN       删除 运行
// ACTIVE     停止，查看日志
// DEPLOYING  查看日志
// KILLING    查看日志

import { Vue, Component, Prop } from 'vue-property-decorator'
import { StreamInfoStore } from '@/stores/stream/detail'
import JobStatus from '@/components/stream/JobStatus.vue'
import ExecutionLogModal from './detail/ExecutionLogModal.vue'
import eventBus from './eventBus'

@Component({
  components: {
    JobStatus,
    ExecutionLogModal
  }
})
export default class DetailTop extends Vue {
  @Prop({
    type: String
  })
  private active!: string

  private timeId!: number

  private isShowLogModal: boolean = false

  private detailState = StreamInfoStore.state

  get jumpUrl() {
    const { jobId } = this.$route.params
    return `http://rt.sankuai.com/job/${jobId}/setting-basic`
  }

  get detail() {
    return this.detailState.value
  }

  private save() {
    eventBus.$emit('save')
  }

  private startup() {
    eventBus.$emit('startup')
  }

  private shutdown() {
    eventBus.$emit('shotdown')
  }

  private del() {
    eventBus.$emit('del')
  }

  private back() {
    this.$router.push({
      name: 'streamList'
    })
  }

  private mounted() {
    const { taskId, jobId } = this.$route.params
    this.timeId = setInterval(() => {
      StreamInfoStore.updateStatus({ taskId, jobId })
    }, 1000)
  }

  private beforeDestroy() {
    clearInterval(this.timeId)
  }
}
</script>

<style lang="scss" scoped>
.wrap-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 26px;
  line-height: 26px;
  .back {
    display: inline-block;
    font-size: 20px;
    height: 26px;
    line-height: 26px;
  }
  .line {
    color: rgba(150, 154, 203, 0.23);
    margin: 0 10px 0;
  }
  .name {
    font-size: 18px;
    color: #31306b;
    margin-right: 32px;
  }
  .btn {
    margin-right: 12px;
    i {
      font-size: 12px;
    }
  }
  .icon-Dashboard-shanchu {
    color: #ff6459;
  }
  .icon-cunchushiyong {
    color: #606be1;
  }
  .icon-jiqi-chakanrizhi {
    color: #8a94c2;
  }
}
</style>
