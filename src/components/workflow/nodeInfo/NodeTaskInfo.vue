<template>
  <div class="param-wrap">
    <div class="param-title">
      <i class="slide"></i>
      <i
        class="iconfont icon-daohangxialasanjiao fold-param-icon"
        :class="{ 'fold-status': isFold }"
        @click="changeFold"
      ></i>
      <h4 class="comp-name">任务信息</h4>
    </div>
    <section class="param-content" v-show="!isFold">
      <template v-if="!activeNodeTaskInfo.bindToolTask && !activeNodeTaskInfo.toolTaskAfoType">
        <p class="label-text">暂无关联任务信息</p>
      </template>
      <template v-else-if="!activeNodeTaskInfo.toolTaskAfoType">
        <label class="param-item-label">关联任务</label>
        <p class="label-text">{{ activeNodeTaskInfo.taskName }}</p>

        <label class="param-item-label">任务状态</label>
        <!-- TODO: 这里是否需要翻译 -->
        <p class="label-text">{{ activeNodeTaskInfo.statusCom }}</p>

        <label class="param-item-label">租户</label>
        <p class="label-text">{{ activeNodeTaskInfo.tenant }}</p>

        <label class="param-item-label">项目组</label>
        <p class="label-text">{{ activeNodeTaskInfo.prjName }}</p>

        <label class="param-item-label">责任人</label>
        <p class="label-text">{{ activeNodeTaskInfo.creator }}</p>

        <label class="param-item-label">创建时间</label>
        <p class="label-text">{{ activeNodeTaskInfo.createTime }}</p>

        <label class="param-item-label">更新时间</label>
        <p class="label-text">{{ activeNodeTaskInfo.updateTime }}</p>

        <label class="param-item-label">最近执行时间</label>
        <p class="label-text">{{ activeNodeTaskInfo.lastestExecTime }}</p>

        <label class="param-item-label">任务描述</label>
        <p class="label-text">{{ activeNodeTaskInfo.desc }}</p>

        <label class="param-item-label flex">执行统计</label>
        <ExecStatus :execDetail="activeNodeTaskInfo.execDetail" @change="changeTimeType"></ExecStatus>
      </template>
      <template v-else>
        <label class="param-item-label">任务类型</label>
        <p class="label-text">{{ activeNodeTaskInfo.toolTaskAfoTypeChn }}</p>

        <label class="param-item-label">任务名称</label>
        <p class="label-text">{{ activeNodeTaskInfo.taskName }}</p>

        <label class="param-item-label">任务描述</label>
        <p class="label-text">{{ activeNodeTaskInfo.taskDesc }}</p>

        <label class="param-item-label">租户</label>
        <p class="label-text">{{ activeNodeTaskInfo.tenant }}</p>

        <label class="param-item-label">项目组</label>
        <p class="label-text">{{ activeNodeTaskInfo.prjName }}</p>

        <label class="param-item-label">责任人</label>
        <p class="label-text">{{ activeNodeTaskInfo.creator }}</p>

        <label class="param-item-label">创建时间</label>
        <p class="label-text">{{ activeNodeTaskInfo.createTime }}</p>

        <label class="param-item-label">更新时间</label>
        <p class="label-text">{{ activeNodeTaskInfo.updateTime }}</p>

        <label class="param-item-label">调度上线时间</label>
        <p class="label-text">{{ activeNodeTaskInfo.latestOnlineTime }}</p>

        <label class="param-item-label">最近执行时间</label>
        <p class="label-text">{{ activeNodeTaskInfo.lastestExecTime }}</p>

        <label class="param-item-label">最近执行耗时</label>
        <p class="label-text">{{ activeNodeTaskInfo.latestRunTime }}</p>

        <label class="param-item-label">最近执行日志</label>
        <p class="label-text">{{ activeNodeTaskInfo.latestYarnLog }}</p>
        <a
          class="label-text"
          :href="activeNodeTaskInfo.latestTensorBoardLog"
          target="_blank"
        >TensorBoard</a>

        <label class="param-item-label flex">执行统计</label>
        <ExecStatus :execDetail="activeNodeTaskInfo.execDetail" @change="changeTimeType"></ExecStatus>
      </template>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ActiveNodeTaskInfoStore } from '@/stores/workflow/graphVisual/activeNode'
import ExecStatus from './ExecStatus.vue'

@Component({
  components: {
    ExecStatus
  }
})
export default class NodeTaskInfo extends Vue {
  isFold = false

  activeNodeTaskInfoState = ActiveNodeTaskInfoStore.state

  get activeNodeTaskInfo() {
    return this.activeNodeTaskInfoState.value
  }

  changeFold() {
    this.isFold = !this.isFold
  }

  changeTimeType(value: string) {
    this.$emit('changeTimeType', value)
  }
}
</script>
