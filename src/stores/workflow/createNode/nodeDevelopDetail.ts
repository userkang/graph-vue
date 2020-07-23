import Base from '@/stores/base'

interface IDetailPayload {
  workflowId: string
  nodeId: string
}

interface INodeDetailState {
  value: {
    taskUrl: string
  }
  loadingStatus: string
}

class NodeDevelopDetail extends Base {
  public state: INodeDetailState = {
    value: {
      taskUrl: ''
    },
    loadingStatus: ''
  }

  public async getTaskUrl(payload: IDetailPayload) {
    try {
      this.state.loadingStatus = this.$STATUS_LOADING
      const value = await this.$requestHandle(
        'get',
        `/workflow/${payload.workflowId}/node/${payload.nodeId}/task`
      )
      this.state.value.taskUrl = value.data.data
      this.state.loadingStatus = this.$STATUS_LOADED

      return value.data.data
      // tslint:disable-next-line
    } catch (e) {
      this.state.loadingStatus = this.$STATUS_LOADED
    }
  }
}

export const NodeDevelopDetailStore = new NodeDevelopDetail()
