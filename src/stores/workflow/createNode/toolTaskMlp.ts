import Base from '@/stores/base'
import { IWorkflowInfoPayload } from './toolTaskXt'
import { ToolTaskAfoCreateVo } from '@/types/createNode'

export type IToolTaskMlpPayload = ToolTaskAfoCreateVo

export interface ITaskAddState {
  value: any
}

class ToolTaskMlp extends Base {
  public state: ITaskAddState = {
    value: {}
  }

  public async createNode(
    workflowInfo: IWorkflowInfoPayload,
    payload: IToolTaskMlpPayload
  ): Promise<ITaskAddState> {
    try {
      const value = await this.$requestHandle(
        'post',
        `/workflow/${workflowInfo.workflowId}/node/${workflowInfo.nodeId}/tool/afo`,
        {
          ...payload
        }
      )
      this.$setState(this.state, value)
      // tslint:disable-next-line
    } catch (e) {
      console.error(e)
    }
    return this.state
  }
}

export const ToolTaskMlpStore = new ToolTaskMlp()
