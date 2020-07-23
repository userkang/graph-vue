<template>
  <div class="chart-wrap">
    <div class="chart" ref="chartdom"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import {
  HistogramVo,
  RingVo,
  PieDataVo,
  DescribeVo,
  BarDataVo
} from '@/types/graph'
import echarts from 'echarts'
import { chartAssemblyToolTip } from '../../common/utils'

@Component({ components: {} })
export default class Chart extends Vue {
  @Prop(String)
  private chartType!: string

  @Prop(Array)
  private pieData!: RingVo[]

  @Prop(Array)
  private barData!: HistogramVo[]

  private chart!: any

  private initData() {
    // 避免用TS描述setOption繁杂的类型，同时避免any，此处定义柱图和原型图的option
    if (this.chartType === 'histogram') {
      const dataX: number[] = []
      const dataY: BarDataVo[] = []
      this.barData.forEach((item: HistogramVo) => {
        dataX.push(+((item.rangeLeft + item.rangeRight) / 2).toFixed(1))
        dataY.push({
          value: item.height,
          start: +item.rangeLeft.toFixed(3),
          end: +item.rangeRight.toFixed(3),
          rate: item.rate
        })
      })

      this.chart.setOption({
        xAxis: {
          type: 'category',
          data: dataX
        },
        color: ['#1467D4'],
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.93)',
          extraCssText: 'box-shadow: 0 2px 2px 0 rgba(0,0,0,0.21);',
          textStyle: {
            color: '#4E4E4E'
          },
          formatter: (params: any[]) => {
            let str = ''
            if (params.length > 0) {
              let strRow: string = ''
              str += `区间[${params[0].data.start} - ${params[0].data.end}]<br/>`
              params.forEach(item => {
                strRow = `实例数: ${item.value}（${(
                  item.data.rate || 0
                ).toFixed(2)}%）`
              })
              str += `${chartAssemblyToolTip('#1467D4', strRow, '')}`
            } else {
              str += 'none'
            }
            return str
          }
        },
        yAxis: {
          name: '实例数',
          type: 'value',
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dotted'
            }
          }
        },
        series: [
          {
            data: dataY,
            type: 'bar'
          }
        ]
      })
    } else {
      const pieDataUseFull: PieDataVo[] = []
      const legendData: string[] = []
      if (this.pieData) {
        this.pieData.forEach((item: RingVo) => {
          pieDataUseFull.push({
            name: item.name,
            value: item.count // ? +(item.rate).toFixed(3) : item.rate
          })
          legendData.push(item.name)
        })
      }

      this.chart.setOption({
        color: ['#1467D4', '#F7BC45', '#444B5E', '#44B3B9'],
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: 'rgba(255,255,255,0.93)',
          extraCssText: 'box-shadow: 0 2px 2px 0 rgba(0,0,0,0.21);',
          textStyle: {
            color: '#4E4E4E'
          }
        },
        legend: {
          type: 'scroll',
          right: 10,
          top: 20,
          bottom: 20,
          data: legendData
        },
        series: [
          {
            type: 'pie',
            label: {
              show: pieDataUseFull.length <= 100,
              formatter: '{d}%'
            },
            radius: ['50%', '70%'],
            data: pieDataUseFull
          }
        ]
      })
    }
  }

  private mounted() {
    this.chart = echarts.init(this.$refs.chartdom as HTMLDivElement)
    this.initData()
  }
}
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 300px;
}
.chart-wrap {
  width: 100%;
  border-top: 2px solid #f5b812;
  overflow: scroll;
}
</style>