<template>
  <div class="chart" ref="chart"></div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import echarts from 'echarts'
import * as _ from 'lodash' // FIXME: 模板里有 _.forEach 如果单独引用报错
import tooltipTpl from './tooltipTpl.js'
import CFG from './chartCfg.js'
import { MetricPoint } from '@/types/metric'

const { title, legend, grid, tooltip, xAxis, yAxis, series, lineColors } = CFG

import { MetricStore, MetricCfgStore } from '@/stores/metric/Metric'

@Component({ components: {} })
export default class Chart extends Vue {
  private metricCfgStore = MetricCfgStore
  private MetricStore = MetricStore
  private chart: any = ''
  private timeId: number = 0

  get chartState() {
    return this.MetricStore.state
  }

  @Watch('metricCfgStore.state.metricName')
  private handleMetricNameChange(v: string) {
    this.renderGeneralChart()
  }
  // @Watch('metricCfgStore.state.type')
  private handleMetricCfgChange() {
    MetricStore.requestAll()
  }

  @Watch('chartState.batchMetrics', { deep: true })
  private handleChartStateChange() {
    this.renderGeneralChart()
  }

  private renderGeneralChart() {
    const { batchMetrics, batchPoints, markPoints, labels } = this.chartState
    if (!batchPoints.length) {
      return
    }
    // const modelName = batchMetrics.map((item: MetricPoint[]) => {
    //     return item.length ? item[0]['metricTag'] : ''
    // })
    const yText = this.metricCfgStore.state.metricName
    const realSeries = batchMetrics.map(
      (item: MetricPoint[], index: number) => {
        const serie: any = {
          ...series,
          name: labels[index],
          lineStyle: {
            color: lineColors[index]
          },
          itemStyle: {
            color: lineColors[index]
          },
          data: item.map((el: MetricPoint, j: number) => ({
            value: [batchPoints[j], el[yText]],
            itemLabel: labels[index],
            originalData: el
          }))
        }
        if (!index && batchMetrics.length === 1) {
          const { epochPoints, epochMetrics } = markPoints
          const data: any = []
          epochPoints.forEach((x: number, pointIndex: number) => {
            const i = batchPoints.indexOf(x)
            if (i > -1) {
              data.push({
                xAxis: i,
                yAxis: epochMetrics[pointIndex][yText]
              })
            }
          })
          serie.markPoint = {
            data,
            symbol: 'circle',
            symbolSize: 10,
            symbolOffset: [0, '-23%'],
            itemStyle: {
              color: lineColors[0]
            }
          }
        }
        return serie
      }
    )
    this.chart.clear()
    this.chart.setOption({
      title: [
        {
          text: 'eval_batch',
          ...title.x_left_bottom,
          textStyle: title.textStyle
        },
        {
          text: yText,
          ...title.y_top,
          textStyle: title.textStyle
        }
      ],
      legend: {
        ...legend,
        data: labels
      },
      dataZoom: [
        {
          start: 0,
          end: 100, // 这个点是 X 轴最大的那个点
          bottom: 110
        },
        {
          type: 'inside',
          filterMode: 'filters.ts',
          start: 0,
          end: 100,
          bottom: 110
        }
      ],
      grid,
      tooltip: {
        ...tooltip,
        formatter(list: any) {
          const info: any = {
            list: []
          }
          ;(list as any).forEach((item: any) => {
            const { data, color } = item
            const { originalData, itemLabel } = data
            info.batch = originalData.batch
            // info.epoch = originalData.epoch;
            info.reportTime = originalData.reportTime
            originalData.color = color
            originalData.isEpoach = false
            // originalData.label = originalData.metricTag
            originalData.style = `border: 1px solid ${color}`
            info.list.push(originalData)
            // 单独处理 epoch
            if (realSeries.length && realSeries[0]['markPoint']) {
              const epochMetrics = realSeries[0]['markPoint']['data']
              const epochMetric = epochMetrics.find(
                (el: any) => el.xAxis === item.dataIndex
              )
              if (epochMetric) {
                const epochIndex = markPoints['epochPoints'].indexOf(
                  epochMetric.xAxis + 1
                )
                const epochValue = markPoints['epochMetrics'][epochIndex]
                info.list.push({
                  color,
                  isEpoach: true,
                  style: `background: ${color}`,
                  label: epochValue.metricTag,
                  ...epochValue
                })
              }
            }
          })
          return _.template(tooltipTpl)(info)
        }
      },
      xAxis: {
        interval: Math.ceil(batchPoints.length / 20),
        ...xAxis
      },
      yAxis,
      series: realSeries
    })
  }

  private mounted() {
    this.chart = echarts.init(this.$refs.chart as HTMLDivElement)

    // 5秒刷新一次数据
    this.timeId = setInterval(() => {
      this.handleMetricCfgChange()
    }, 5000)
  }

  private beforeDestroy() {
    clearInterval(this.timeId)
  }
}
</script>

<style lang="scss">
.ml_chart_tooltip {
  text-align: left;
  font-size: 12px;
  padding: 6px 10px;
  color: #6f6f6f;
  &-header {
    margin-bottom: 6px;
  }
  &-body {
    display: flex;
  }
}
.ml_chart_bold-text {
  color: #464646;
  margin-left: 8px;
}

.ml30 {
  margin-left: 30px;
}
.ml10 {
  margin-left: 10px;
}
.mr30 {
  margin-right: 30px;
}
.ml_chart_linespace {
  margin: 6px 0;
}
.ml_chart_marker {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-left: -12px;
  border-radius: 50%;
  // background: red;
  background-color: #fff;
}
</style>

<style lang="scss" scoped>
.chart {
  width: 1080px;
  height: 500px;
}
</style>