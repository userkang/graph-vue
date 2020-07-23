<template>
  <div>
    <div class="tools">
      <!-- train | eval tab BEGIN -->
      <mtd-radio-group v-model="innerType" size="small">
        <mtd-radio-button value="train">train</mtd-radio-button>
        <mtd-radio-button v-if="evalOperator" value="eval">eval</mtd-radio-button>
      </mtd-radio-group>
      <!-- train | eval tab END -->

      <div class="tools-right">
        <!-- datepicker radio BEGIN -->
        <DatePicker />
        <!-- datepicker radio END -->
        <span class="tools-right-vs pointer" @click="$emit('addVSModel')">
          <i class="iconfont icon-fabu"></i>
          添加对比
        </span>
        <span class="pointer" @click="$emit('download')" v-if="chartState.batchMetrics.length < 2">
          <i class="iconfont icon-xiazai"></i>
          下载
        </span>
      </div>
    </div>
    <!-- AUC | LOSS radio BEGIN -->
    <mtd-radio-group v-model="innerMetricName" size="small">
      <mtd-radio value="auc">AUC</mtd-radio>
      <mtd-radio value="loss">LOSS</mtd-radio>
    </mtd-radio-group>
    <!-- AUC | LOSS radio END -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import DatePicker from './DatePicker.vue'
import { MetricStore, MetricCfgStore } from '@/stores/metric/Metric'
import { MetricPoint } from '@/types/metric'

@Component({
  components: {
    DatePicker
  }
})
export default class VSMetric extends Vue {
  private metricCfgStore = MetricCfgStore
  private MetricStore = MetricStore

  get chartState() {
    return this.MetricStore.state
  }

  get innerType() {
    return this.metricCfgStore.state.type
  }

  set innerType(val: string) {
    this.metricCfgStore.setType(val)
    this.metricCfgStore.setCurrentTime([])
    this.metricCfgStore.setTrainTime([])
  }

  get innerMetricName() {
    return this.metricCfgStore.state.metricName
  }

  set innerMetricName(val: keyof MetricPoint) {
    this.metricCfgStore.setName(val)
  }

  get evalOperator() {
    return this.metricCfgStore.state.evalOperator
  }
}
</script>

<style lang="scss" scoped>
.tools {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  &-right {
    color: #666;
    i {
      font-size: 12px;
      color: rgb(96, 107, 225);
      margin-right: 5px;
    }
    &-vs {
      margin-left: 30px;
      margin-right: 24px;
    }
  }
}
.pointer {
  cursor: pointer;
}
</style>