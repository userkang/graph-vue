<template>
  <div>
    <mtd-select @change="handleChange" v-model="timeType" size="small">
      <mtd-option v-for="(item, index) in filterList" :key="index" :label="item" :value="index" />
    </mtd-select>
    <template v-if="execDetail">
      <p class="label-text">总任务：{{ execDetail.execCount }}</p>
      <p class="label-text">未开始：{{ execDetail.newCount }}</p>
      <p class="label-text">运行中：{{ execDetail.runningCount }}</p>
      <p class="label-text">运行成功：{{ execDetail.finishedCount }}</p>
      <p class="label-text">运行失败：{{ execDetail.failCount }}</p>
    </template>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({})
export default class ExecStatus extends Vue {
  @Prop({ type: Object })
  execDetail!: Workflow.ToolTaskExecDetailVo

  private filterList = {
    latestWeek: '最近一周',
    latestMonth: '最近一月'
  }
  private timeType = 'latestWeek'

  handleChange(value: string) {
    this.$emit('change', value)
  }
}
</script>