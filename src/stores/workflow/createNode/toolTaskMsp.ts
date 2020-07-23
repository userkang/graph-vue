import Base from '@/stores/base'
import { ITaskAddState, IWorkflowInfoPayload } from './toolTaskXt'

export interface IToolTaskMspPayload {
  nodeName: string
  desc: string
  createType: string
  jobName: string
  cantorName: string
  projectName: string
  toolTaskType: string
  repos: string
  branch: string
  subDir: string
  mainPy: string
  queue: string
  mainClass: string
}

interface IJobPrefixPayload {
  projectName: string
  toolTaskType: string
}

class ToolTaskMsp extends Base {
  public state: ITaskAddState = {
    value: {
      taskUrl: ''
    }
  }

  public async createNode(
    workflowInfo: IWorkflowInfoPayload,
    payload: IToolTaskMspPayload
  ): Promise<ITaskAddState> {
    try {
      this.state.value.taskUrl = ''
      const value = await this.$requestHandle(
        'post',
        `/workflow/${workflowInfo.workflowId}/node/${workflowInfo.nodeId}/tool/msp`,
        {
          ...payload
        }
      )
      this.$setState(this.state, value)
      // tslint:disable-next-line
    } catch (e) {}
    return this.state
  }

  public async getJobPrefix(payload: IJobPrefixPayload) {
    try {
      const value = await this.$requestHandle('get', `/workflow/job-prefix`, {
        toolTaskType: payload.toolTaskType,
        projectName: payload.projectName
      })
      return value.data.data
      // tslint:disable-next-line
    } catch (e) {}
    return this.state
  }
}

export const ToolTaskMspStore = new ToolTaskMsp()
