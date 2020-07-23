<template>
  <div :style="chartStyle" ref="chartdom"></div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import { ChartStyle } from '@/types/graph'
import echarts from 'echarts'
import { chartAssemblyToolTip } from '../../common/utils'

@Component({ components: {} })
export default class Chart extends Vue {
  @Prop(Object)
  private chartConfig: any

  @Prop(Object)
  private chartStyle!: ChartStyle

  private chart: any

  private mounted() {
    this.chart = echarts.init(this.$refs.chartdom as HTMLDivElement)
    this.chart.setOption(this.chartConfig)
  }
}
</script>

<style lang="scss" scoped>
</style>