<template>
  <div>
    <dmc-modal v-model="show" @close="closePreview" title="二分类模型评估报告" width="1200px">
      <mtd-loading :loading="isLoading"></mtd-loading>
      <div v-if="!isLoading" class="card-wrap">
        <div class="card">
          <p class="small-name">目标</p>
          <p class="small-data">{{previewData.label}}</p>
        </div>
        <div class="card">
          <p class="small-name">数据量</p>
          <p class="small-data">
            {{previewData.rows}}
            <span class="gray-text">行</span>
          </p>
        </div>
        <div class="card">
          <p class="name">目标列分布</p>
          <p class="small-data">
            {{previewData.labelStatistics[0].label}}：{{previewData.labelStatistics[0].count}}
            <span
              class="gray-text"
            >（{{(previewData.labelStatistics[0].percentage).toFixed(3)}}%）</span>
          </p>
          <p class="small-data">
            {{previewData.labelStatistics[1].label}}：{{previewData.labelStatistics[1].count}}
            <span
              class="gray-text"
            >（{{(previewData.labelStatistics[1].percentage).toFixed(3)}}%）</span>
          </p>
        </div>
        <div class="card">
          <p class="name">
            F1
            <mtd-tooltip content="精确率和召回率的调和平均数" theme="light" placement="top">
              <i class="mtdicon mtdicon-question-circle-o" style="cursor: pointer;"></i>
            </mtd-tooltip>
          </p>
          <p class="data">{{(previewData.f1).toFixed(3)}}</p>
        </div>
        <div class="card">
          <p class="name">
            准确率
            <mtd-tooltip content="模型生成的正确分类预测所占的比例" theme="light" placement="top">
              <i class="mtdicon mtdicon-question-circle-o" style="cursor: pointer;"></i>
            </mtd-tooltip>
          </p>
          <p class="data">{{previewData.accuracy ? (previewData.accuracy).toFixed(3) : '-'}}</p>
        </div>
        <div class="card">
          <p class="name">
            对数损失
            <mtd-tooltip content="模型预测与标签值之间的交叉熵" theme="light" placement="top">
              <i class="mtdicon mtdicon-question-circle-o" style="cursor: pointer;"></i>
            </mtd-tooltip>
          </p>
          <p
            class="data"
          >{{(previewData.loss === +previewData.loss) ? (previewData.loss).toFixed(3) : previewData.loss}}</p>
        </div>
      </div>

      <div v-if="!isLoading" class="middle-wrap">
        <div class="small-chart">
          <div class="chart-text-wrap">
            <span class="name">PRC</span>
            <span class="detail">AUC：{{(previewData.pr.auc).toFixed(3)}}</span>
          </div>
          <Chart :chartConfig="PRCChartData" :chartStyle="{width:'310px', height:'262px'}" />
        </div>
        <div class="small-chart">
          <div class="chart-text-wrap">
            <span class="name">ROC</span>
            <span class="detail">AUC：{{(previewData.roc.auc).toFixed(3)}}</span>
          </div>
          <Chart
            :chartConfig="ROCChartData"
            :chartStyle="{width:'310px', height:'262px', marginLeft:'10px'}"
          />
        </div>
        <div class="small-chart">
          <div class="table-text">混淆矩阵</div>
          <div class="table">
            <div class="table-head">
              <div class="head-item-first">
                <span class="row-name">真实标签</span>
                <span class="line-name">预测标签</span>
              </div>
              <div class="head-item">{{previewData.labels[0]}}</div>
              <div class="head-item">{{previewData.labels[1]}}</div>
            </div>
            <div class="table-body">
              <div class="left-item-gray">{{previewData.labels[0]}}</div>
              <div class="left-item right-border">{{previewData.confusionMatrix[0][0]}}</div>
              <div class="left-item">{{previewData.confusionMatrix[0][1]}}</div>
              <div class="left-item-gray">{{previewData.labels[1]}}</div>
              <div class="left-item right-border">{{previewData.confusionMatrix[1][0]}}</div>
              <div class="left-item">{{previewData.confusionMatrix[1][1]}}</div>
            </div>
          </div>
        </div>
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
    </dmc-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import Chart from './Chart.vue'
import { binaryPreviewListStore } from '@/stores/graph/graphVisual/DataPreviewList'
import { chartAssemblyToolTip } from '../../common/utils'
import {
  CurveVo,
  FeatureWeightVo,
  BinaryClassifyEvaluatorVo,
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

  private previewDataState = binaryPreviewListStore.state

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

  private get featureWeightsData() {
    const featureWeights: FeatureWeightVo[] =
      this.previewDataState.data.featureWeights || []
    const dataX: string[] = []
    const dataY: number[] = []
    featureWeights.forEach(item => {
      dataX.push(item.feature)
      dataY.push(item.weight ? +item.weight.toFixed(2) : item.weight)
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
              strRow = `特征重要性: ${item.value}%`
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

  private get PRCChartData() {
    const pr: CurveVo = this.previewDataState.data.pr
    const dataX: number[] = []
    const dataY: number[] = []
    if (pr && pr.points) {
      pr.points.forEach(item => {
        dataX.push(item[0] ? +item[0].toFixed(2) : item[0])
        dataY.push(item[1] ? +item[1].toFixed(3) : item[1])
      })
    }

    return {
      xAxis: {
        type: 'category',
        data: dataX,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dotted'
          }
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
            let XRow: string = ''
            params.forEach(item => {
              XRow = `召回率: ${params[0].axisValue}`
              strRow = `精确率: ${item.value}`
            })
            str += `${chartAssemblyToolTip('#1467D4', XRow, '')}`
            str += `${chartAssemblyToolTip('#1467D4', strRow, '')}`
          } else {
            str += 'none'
          }
          return str
        }
      },
      yAxis: {
        name: 'PRC',
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
          type: 'line',
          areaStyle: {
            opacity: 0.1
          },
          lineStyle: {
            width: 3
          }
        }
      ]
    }
  }

  private get ROCChartData() {
    const roc: CurveVo = this.previewDataState.data.roc
    const dataX: number[] = []
    const dataY: number[] = []
    if (roc && roc.points) {
      roc.points.forEach(item => {
        dataX.push(item[0] ? +item[0].toFixed(2) : item[0])
        dataY.push(item[1] ? +item[1].toFixed(3) : item[1])
      })
    }

    return {
      xAxis: {
        type: 'category',
        data: dataX,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dotted'
          }
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
            let XRow: string = ''
            // str += `[${params[0].axisValue}]<br/>`;
            params.forEach(item => {
              XRow = `假正率: ${params[0].axisValue}`
              strRow = `真正率: ${item.value}`
            })
            str += `${chartAssemblyToolTip('#1467D4', XRow, '')}`
            str += `${chartAssemblyToolTip('#1467D4', strRow, '')}`
          } else {
            str += 'none'
          }
          return str
        }
      },
      yAxis: {
        name: 'ROC',
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
          type: 'line',
          areaStyle: {
            opacity: 0.1
          },
          lineStyle: {
            width: 3
          }
        }
      ]
    }
  }

  private get show() {
    return this.isShowPreview
  }
  private set show(v: boolean) {
    this.$emit('close-binary-preview')
  }

  private closePreview() {
    this.$emit('close-binary-preview')
  }
  private async created() {
    await binaryPreviewListStore.getPreviewData(this.graphId, this.nodeId)
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
  .card {
    display: flex;
    width: 16%;
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
}
.chart-wrap {
  width: 1140px;
  height: 420px;
  border: 1px solid #d8dbe0;
  margin-bottom: 16px;
  align-items: center;
}

.middle-wrap {
  display: flex;
  width: 1140px;
  height: 340px;
  margin-bottom: 16px;
  justify-content: space-between;
}
.small-chart {
  display: flex;
  width: 368px;
  height: 100%;
  flex-direction: column;
  align-items: center;
  // justify-content:center;
  border: 1px solid #d8dbe0;
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
.gray-text {
  color: #747474;
}
.data {
  color: #2a2a2a;
  font-weight: bold;
  font-size: 26px;
}
.chart-text-wrap {
  display: flex;
  width: 100%;
  height: 40px;
  padding: 18px 25px 0px;
  justify-content: space-between;
  .name {
    color: #494949;
    font-weight: bold;
  }
  .detail {
    color: #494949;
  }
}
.table-text {
  height: 60px;
  width: 100%;
  padding-left: 20px;
  color: #494949;
  line-height: 60px;
  font-weight: bold;
}
.table {
  width: 100%;
  height: 260px;
  .table-head {
    height: 90px;
    width: 100%;
    background: #f4f5f6;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #e8e8e8;
    text-align: center;
    line-height: 90px;
    font-weight: bold;
    .head-item {
      width: 122px;
      height: 100%;
      line-height: 90px;
    }
    .head-item-first {
      width: 122px;
      height: 100%;
      line-height: 90px;
      border-right: 1px solid #e8e8e8;
      background: linear-gradient(
        36deg,
        transparent 49.1%,
        #e8e8e8 49.5%,
        #e8e8e8 50%,
        transparent 50%
      );
      .row-name {
        position: relative;
        top: 15px;
      }
      .line-name {
        position: relative;
        top: -15px;
      }
    }
  }
  .table-body {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    .left-item {
      width: 122px;
      height: 84px;
      text-align: center;
      line-height: 84px;
      border-bottom: 1px solid #e8e8e8;
    }
    .right-border {
      border-right: 1px solid #e8e8e8;
    }
    .left-item-gray {
      width: 122px;
      height: 84px;
      text-align: center;
      line-height: 84px;
      background: #f4f5f6;
      border-bottom: 1px solid #e8e8e8;
      font-weight: bold;
    }
  }
}
.close-btn {
  background: #1b77ec;
  font-size: 13px;
  margin-right: 10px;
}
</style>