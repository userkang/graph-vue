import Base from '../base'
import {
  GraphExecPayload as GraphVersionPayload,
  GraphVoType
} from '@/types/graph'

export interface GraphStatusItem {
  status: number
  num: number
}

interface GraphStatusState {
  value: GraphStatusItem[]
  total: number
}

class GraphAnalysis extends Base {
  public state: GraphStatusState = {
    value: [],
    total: 0
  }

  public async request(id: number) {
    try {
      const value = await this.$requestHandle(
        'get',
        `/training/graph/${id}/statistic`
      )
      this.state.value = value.data.data
      this.state.total = this.calculateTotal(value.data.data)
      // tslint:disable-next-line
    } catch (e) {}
  }

  private calculateTotal(payload: GraphStatusItem[]) {
    let total = 0
    payload.forEach(item => {
      total += item.num
    })
    return total
  }
}

export const GraphAnalysisStore = new GraphAnalysis()

interface GraphExecPayload {
  id: number
  status: number[]
  submitTime: string
}

interface GraphExecState {
  value: GraphVoType[]
  loadingStatus: string
}

class GraphHistory extends Base {
  public state: GraphExecState = {
    value: [],
    loadingStatus: ''
  }

  public async request(payload: GraphExecPayload) {
    try {
      this.state.loadingStatus = this.$STATUS_LOADING
      this.state.value = []
      const value = await this.$requestHandle(
        'get',
        `/training/graph/${payload.id}/exec`,
        {
          status: payload.status,
          submitTime: payload.submitTime
        }
      )
      this.state.value = value.data.data
      // tslint:disable-next-line
    } catch (e) {}
    this.state.loadingStatus = this.$STATUS_LOADED
  }
}

export const GraphHistoryStore = new GraphHistory()

class DeleteExec extends Base {
  public async request(payload: GraphVersionPayload) {
    try {
      const { graphId, execId } = payload
      const value = await this.$requestHandle(
        'deleted',
        `/training/graph/${graphId}/exec/${execId}`
      )
      this.$showMessage(value.data.message)
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const DeleteExecStore = new DeleteExec()
