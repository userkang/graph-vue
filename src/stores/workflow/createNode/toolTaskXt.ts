import Base from '@/stores/base'

export interface IWorkflowInfoPayload {
  workflowId: string
  nodeId: string
}

export interface IToolTaskXtPayload {
  nodeName: string
  nodeDesc: string
  createType: string
  xtName: string
  toolTaskType: string
  projName: string
  sourceEngine: string
  destEngine: string
}

export interface ITaskAddState {
  value: {
    taskUrl: string
  }
}

class ToolTaskXt extends Base {
  public state: ITaskAddState = {
    value: {
      taskUrl: ''
    }
  }

  public async createNode(
    workflowInfo: IWorkflowInfoPayload,
    payload: IToolTaskXtPayload
  ): Promise<ITaskAddState> {
    try {
      this.state.value.taskUrl = ''
      const value = await this.$requestHandle(
        'post',
        `/workflow/${workflowInfo.workflowId}/node/${workflowInfo.nodeId}/tool/xt`,
        {
          ...payload
        }
      )
      this.$setState(this.state, value)
      // tslint:disable-next-line
    } catch (e) {}
    return this.state
  }
}

export const ToolTaskXtStore = new ToolTaskXt()
