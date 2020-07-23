import Base from '../../base'
import {
  CurveVo,
  FeatureWeightVo,
  BinaryClassifyEvaluatorVo,
  RegressionEvaluatorVo,
  HistogramVo,
  RegressionEvaluatorVoResult,
  BinaryClassifyEvaluatorVoResult
} from '@/types/graph'
import { Loading } from '@ss/mtd-vue'

class DataPreviewList extends Base {
  public state: any = {
    data: {},
    loading: true
  }

  public clear() {
    this.state.data = {}
    this.state.loading = true
  }

  public async getDataPreviewList(
    graphId: number,
    nodeId: number,
    slotIndex: number
  ) {
    this.state.loading = true
    const res = await this.$requestHandle(
      'get',
      `/training/graph/${graphId}/node/${nodeId}/slotindex/${slotIndex}/example`
    )
    if (res) {
      this.state.loading = false
      this.state.data = res.data.data
    } else {
      this.state.loading = false
    }
  }
}

export const dataPreviewListStore = new DataPreviewList()

class RegressionPreviewList extends Base {
  public state: RegressionEvaluatorVoResult = {
    // @ts-ignore
    data: {},
    loading: true
  }

  public async getPreviewData(graphId: number, nodeId: number) {
    this.state.loading = true
    const value = await this.$requestHandle(
      'get',
      `/training/graph/${graphId}/node/${nodeId}/evaluator/regression`
    )
    if (value) {
      this.state.loading = false
      this.state.data = value.data.data
    }
  }
}
export const regressionPreviewListStore = new RegressionPreviewList()

class BinaryPreviewList extends Base {
  public state: BinaryClassifyEvaluatorVoResult = {
    // @ts-ignore
    data: {},
    loading: true
  }

  public async getPreviewData(graphId: number, nodeId: number) {
    this.state.loading = true
    const value =
      // await this.$requestHandle('get', `/training/component`)
      await this.$requestHandle(
        'get',
        `/training/graph/${graphId}/node/${nodeId}/evaluator/binary`
      )
    if (value) {
      this.state.loading = false
      this.state.data = value.data.data
    }
  }
}
export const binaryPreviewListStore = new BinaryPreviewList()
