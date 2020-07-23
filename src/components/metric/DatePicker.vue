<template>
  <mtd-date-picker
    type="daterange"
    v-model="innerDate"
    placeholder="选择时间"
    :options="dateOptions"
    size="small"
    style="width: 200px"
    :editable="false"
  ></mtd-date-picker>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { MetricCfgStore, MetricStore } from '@/stores/metric/Metric'
const ONE_DAY_MS = 3600 * 1000 * 24

@Component({})
export default class DatePicker extends Vue {
  private metricCfgStore = MetricCfgStore
  private dateOptions: any = {
    disabledDate(date: Date) {
      return date && date.getTime() > Date.now()
    }
  }

  get innerDate() {
    return this.metricCfgStore.state.currentTime
  }

  set innerDate(val: Date[]) {
    if (!val.length) {
      return
    }
    val[1].setHours(23, 59, 59, 999)
    this.metricCfgStore.setCurrentTime(val)
    MetricStore.requestAll()
  }

  get trainTime() {
    return this.metricCfgStore.state.trainTime
  }

  @Watch('trainTime')
  private handleTimeRangeChange(val: Date[]) {
    if (!val.length) {
      return
    }
    this.dateOptions.disabledDate = (date: Date) => {
      const time = date.getTime()
      const trainStartTime = val[0].setHours(0, 0, 0, 0)
      const trainEndTime = val[1].setHours(23, 59, 59, 999)
      return time < trainStartTime || time > trainEndTime
    }
  }
}
</script>