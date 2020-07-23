<template>
  <mtd-modal v-model="isShowMlx" :destroy-on-close="true" title="模型指标" width="1122px">
    <FilterTools @addVSModel="addVSModel" @download="download" ref="filter" />
    <Chart />
    <AddVSModal :show.sync="isShowAddVS" :modelList="modelListValue" />
  </mtd-modal>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import FilterTools from '../../components/metric/FilterTools.vue'
import Chart from '../../components/metric/Chart.vue'
import AddVSModal from './AddVSModal.vue'
import { MetricStore, MetricCfgStore } from '@/stores/metric/Metric'
import { MetricModelListStore } from '@/stores/model'
import { ChartCompParamsType } from '@/types/metric'

@Component({
  components: {
    FilterTools,
    Chart,
    AddVSModal
  }
})
export default class ModalMetric extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean
  @Prop({
    default: ''
  })
  private queryCategory!: string

  @Prop({
    // tslint:disable-next-line
    default: () => {}
  })
  private chartParams!: object

  private isShowAddVS: boolean = false
  private modeListState = MetricModelListStore.state

  get isShowMlx() {
    return this.show
  }

  set isShowMlx(v: boolean) {
    this.$emit('update:show', v)
    MetricCfgStore.reset()
    MetricStore.reset()
  }

  get modelListValue() {
    return this.modeListState.value
  }

  @Watch('chartParams')
  private handleVersionIdChange(data: ChartCompParamsType) {
    MetricCfgStore.setQueryCategory(this.queryCategory)
    MetricCfgStore.setChartParams(data)
    MetricStore.requestAll()
  }

  private addVSModel() {
    this.isShowAddVS = true
  }

  private download() {
    MetricStore.download()
  }

  private async mounted() {
    // request for vsable list
    await MetricModelListStore.request({
      modelType: 'MLX'
    })
  }
}
</script>