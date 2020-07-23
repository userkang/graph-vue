<template>
  <div>
    <mtd-modal v-model="show" @close="closePreview" title="回归模型评估报告" width="1200px">
      <mtd-loading :loading="isLoading"></mtd-loading>
      <div v-if="!isLoading" class="card-wrap">
        <div class="card">
          <p class="small-name">目标</p>
          <p class="small-data">{{previewData.label}}</p>
          <div class="card-line"></div>
        </div>
        <div class="card">
          <p class="small-name">数据量</p>
          <p class="small-data">{{previewData.rows}}</p>
        </div>
        <div class="card">
          <p class="name">
            平均绝对误差
            <mtd-tooltip content="标签与预测值之间的平均绝对差，值越⼩模型质量越高" theme="light" placement="top">
              <i class="mtdicon mtdicon-question-circle-o" style="cursor: pointer;"></i>
            </mtd-tooltip>
          </p>
          <p class="data">{{(previewData.mae).toFixed(3)}}</p>
        </div>
        <div class="card">
          <p class="name">
            均方根误差
            <mtd-tooltip content="衡量模型预测值或估计值与观察值之间的差值，值越⼩模型质量越高" theme="light" placement="top">
              <i class="mtdicon mtdicon-question-circle-o" style="cursor: pointer;"></i>
            </mtd-tooltip>
          </p>
          <p class="data">{{(previewData.rmse).toFixed(3)}}</p>
        </div>
        <div class="card">
          <p class="name">
            均方根对数误差
            <mtd-tooltip content="进行对数转换后，标签值和预测值之间的平均平方差的平方根" theme="light" placement="top">
              <i class="mtdicon mtdicon-question-circle-o" style="cursor: pointer;"></i>
            </mtd-tooltip>
          </p>
          <p class="data">{{(previewData.rmsle).toFixed(3)}}</p>
        </div>
        <div class="card">
          <p class="name">
            R平方
            <mtd-tooltip content="标签与预测值之间的⽪尔逊相关系数的平方" theme="light" placement="top">
              <i class="mtdicon mtdicon-question-circle-o" style="cursor: pointer;"></i>
            </mtd-tooltip>
          </p>
          <p class="data">{{(previewData.r2).toFixed(3)}}</p>
        </div>
        <div class="card">
          <p class="name">
            平均绝对百分比误差
            <mtd-tooltip content="标签与预测值之间的平均绝对百分⽐差值" theme="light" placement="top">
              <i class="mtdicon mtdicon-question-circle-o" style="cursor: pointer;"></i>
            </mtd-tooltip>
          </p>
          <p class="data">{{(previewData.mape).toFixed(3)}}</p>
        </div>
      </div>

      <div v-if="!isLoading" class="chart-wrap">
        <Chart
          ref="histogram"
          :chartConfig="HistogramChart"
          :chartStyle="{width:'1080px', height:'400px'}"
        />
      </div>
      <div v-if="!isLoading && isShowFeatureWeights" class="chart-wrap">
        <Chart
          ref="feature"
          :chartConfig="featureWeightsData"
          :chartStyle="{width:'1080px', height:'400px'}"
        />
      </div>

      <div slot="footer" class="demo-modal-footer">
        <mtd-button class="close-btn" type="primary" @click="closePreview">关闭</mtd-button>
      </div>
    </mtd-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import Chart from './Chart.vue'
import { regressionPreviewListStore } from '@/stores/graph/graphVisual/DataPreviewList'
import { chartAssemblyToolTip } from '../../common/utils'
import {
  CurveVo,
  FeatureWeightVo,
  BinaryClassifyEvaluatorVo,
  HistogramBarChartVo,
  RegressionEvaluatorVo,
  HistogramVo,
  RegressionEvaluatorVoResult,
  BinaryClassifyEvaluatorVoResult
} from '@/types/graph'

@Component({
  components: {
    Chart
  }
})
export default class DataPreviewModel extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private isShowPreview!: boolean

  @Prop(Number)
  private nodeId!: number

  @Prop(Number)
  private graphId!: number

  private previewDataState = regressionPreviewListStore.state

  // private previewData = regressionPreviewListStore.state.data;
  // private isLoading = regressionPreviewListStore.state.loading;

  private get previewData() {
    return this.previewDataState.data
  }

  private get isLoading() {
    return this.previewDataState.loading
  }

  private get isShowFeatureWeights() {
    const featureWeights: FeatureWeightVo[] =
      this.previewDataState.data.featureWeights || []
    return !!featureWeights.length
  }

  // private set isLoading(val) {
  //   this.isLoading = val;
  // }

  private get HistogramChart() {
    const residualDistribution: HistogramVo[] =
      this.previewDataState.data.residualDistribution || []
    const dataX: number[] = []
    const dataY: HistogramBarChartVo[] = []
    residualDistribution.forEach(item => {
      dataX.push(+((item.rangeLeft + item.rangeRight) / 2).toFixed(1))
      // dataX.push( parseInt(`${(item.rangeLeft + item.rangeRight) / 2}`, undefined) );
      dataY.push({
        value: item.height,
        start: +item.rangeLeft.toFixed(3),
        end: +item.rangeRight.toFixed(3),
        rate: item.rate
      })
    })

    return {
      grid: {
        right: '8%',
        bottom: '80'
      },
      toolbox: {
        feature: {
          myfeature1: {
            title: '显示数值',
            icon:
              'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
            onclick: () => {
              this.HistogramChart.series.label.show = !this.HistogramChart
                .series.label.show
              ;(this.$refs.histogram as any).chart.setOption(
                this.HistogramChart
              )
            }
          }
        }
      },
      xAxis: {
        type: 'category',
        data: dataX,
        axisLabel: {
          rotate: 40
        }
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
            // str += `[${params[0].axisValue}]<br/>`;
            str += `区间[${params[0].data.start} - ${params[0].data.end}]<br/>`
            params.forEach(item => {
              strRow = `实例数: ${item.value}（${(item.data.rate || 0).toFixed(
                2
              )}%）`
            })
            str += `${chartAssemblyToolTip('#1467D4', strRow, '')}`
          } else {
            str += 'none'
          }
          return str
        }
      },
      yAxis: {
        name: '残差分布',
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
      series: {
        data: dataY,
        type: 'bar',
        label: {
          show: false,
          position: 'top',
          textStyle: {
            color: 'black',
            fontSize: '60%'
          }
        }
      },
      dataZoom: [
        {
          type: 'slider'
        },
        {
          type: 'slider',
          yAxisIndex: [0],
          filterMode: 'none'
        },
        {
          type: 'inside'
        }
      ]
    }
  }

  private get featureWeightsData() {
    const featureWeights: FeatureWeightVo[] =
      this.previewDataState.data.featureWeights || []
    const dataX: string[] = []
    const dataY: number[] = []
    featureWeights.forEach(item => {
      dataX.push(item.feature)
      dataY.push(item.weight)
    })

    return {
      grid: {
        right: '8%',
        bottom: '140'
      },
      toolbox: {
        feature: {
          myfeature1: {
            title: '显示数值',
            icon:
              'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
            onclick: () => {
              this.featureWeightsData.series.label.show = !this
                .featureWeightsData.series.label.show
              ;(this.$refs.feature as any).chart.setOption(
                this.featureWeightsData
              )
            }
          }
        }
      },
      xAxis: {
        type: 'category',
        data: dataX,
        axisLabel: {
          rotate: 40
        }
      },
      color: ['#F7BC45'],
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
            str += `[${params[0].axisValue}]<br/>`
            params.forEach(item => {
              strRow = `value: ${item.value}`
            })
            str += `${chartAssemblyToolTip('#F7BC45', strRow, '')}`
          } else {
            str += 'none'
          }
          return str
        }
      },
      yAxis: {
        name: '特征重要性',
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
      series: {
        data: dataY,
        type: 'bar',
        label: {
          show: false,
          position: 'top',
          textStyle: {
            color: 'black',
            fontSize: '60%'
          }
        }
      },
      dataZoom: [
        {
          type: 'slider'
        },
        {
          type: 'slider',
          yAxisIndex: [0],
          filterMode: 'none'
        },
        {
          type: 'inside'
        }
      ]
    }
  }

  private get show() {
    return this.isShowPreview
  }
  private set show(v: boolean) {
    this.$emit('close-regression-preview')
  }

  private closePreview() {
    this.$emit('close-regression-preview')
  }
  private async created() {
    await regressionPreviewListStore.getPreviewData(this.graphId, this.nodeId)
  }
}
</script>

<style lang="scss" scoped>
.card-wrap {
  width: 1140px;
  height: 120px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  border: 1px solid #d8dbe0;
  margin-bottom: 16px;
  align-items: center;
  // padding: 15px 25px;
}
.chart-wrap {
  width: 1140px;
  height: 420px;
  border: 1px solid #d8dbe0;
  margin-bottom: 16px;
  align-items: center;
}
.card {
  display: flex;
  width: 14%;
  height: 84px;
  flex-direction: column;
  justify-content: center;
  border-right: 1px dotted #ddd;
  text-align: left;
  padding-left: 23px;
  &:last-child {
    border: none;
  }
}
.card:nth-child(7) {
  width: 180px;
}
.name {
  color: #494949;
  margin-bottom: 8px;
}
.tooltip-wrap {
  float: left;
}
.small-name {
  color: #494949;
  margin-bottom: 20px;
}
.small-data {
  color: #2a2a2a;
  font-weight: bold;
}
.data {
  color: #2a2a2a;
  font-weight: bold;
  font-size: 26px;
}
.mtd-modal-title {
  margin-left: 8px;
  color: #333;
  font-size: 18px;
}
.close-btn {
  background: #1b77ec;
  font-size: 13px;
  margin-right: 10px;
}
</style>