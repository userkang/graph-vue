import Base from '@/stores/base'
import { GetGraphInfoStore } from '@/stores/workflow/graphVisual/GraphContent'
import { graphNodeMock } from '@/mock/workflow'

export interface IbaseInfoUpdatePayload {
  nodeName?: string
  nodeDesc?: string
}

interface IActiveNodePayload {
  timeType?: string
  workflowId: string
  nodeId: string
}

export interface IUpstreamItem {
  taskName: string
  taskUrl: string
  nodeId: string
  workflowId: string
}

export interface IUpstreamInfo {
  strongRelation: IUpstreamItem[]
  weakRelation: IUpstreamItem[]
}

export interface IExtraInfo {
  dqcStatus: string
  dqcUrl: string
  dqcName: string
  slaStatus: number
  slaUrl: string
  cantorStatus: number
  cantorUrl: string
  cantorName: string
}

export type ITaskInfo = Workflow.ToolTaskDetailVo

export interface IBaseInfo {
  componentType: string
  nodeName: string
  desc: string
}

interface IBaseInfoState {
  value: IBaseInfo
}

interface ITaskInfoState {
  value: ITaskInfo
  loadingStatus: string
}

interface IUpstreamInfoState {
  value: IUpstreamInfo
}

interface IExtraInfoState {
  value: IExtraInfo
}

class ActiveNodeBaseInfo extends Base {
  public state: IBaseInfoState = {
    value: {
      componentType: '',
      nodeName: '',
      desc: ''
    }
  }

  public async getBaseInfo(payload: IActiveNodePayload) {
    try {
      const value = await this.$requestHandle(
        'get',
        `/workflow/${payload.workflowId}/node/${payload.nodeId}`
      )
      this.$setState(this.state, value)
      // tslint:disable-next-line
    } catch (e) {}
    return this.state
  }

  public async updateBaseInfo(
    workflowInfo: IActiveNodePayload,
    payload: IbaseInfoUpdatePayload
  ) {
    try {
      const value = await this.$requestHandle(
        'patch',
        `/workflow/${workflowInfo.workflowId}/node/${workflowInfo.nodeId}`,
        {
          ...payload
        }
      )
      await GetGraphInfoStore.request(value.data.data)
      this.getBaseInfo(workflowInfo)
      // tslint:disable-next-line
    } catch (e) {}
  }

  public set(payload: IBaseInfo) {
    this.state.value = payload
  }
}

export const ActiveNodeBaseInfoStore = new ActiveNodeBaseInfo()

class ActiveNodeTaskInfo extends Base {
  public state: ITaskInfoState = {
    value: {
      taskName: '',
      toolTaskAfoType: '',
      toolTaskAfoTypeChn: '',
      taskDesc: '',
      taskUrl: '',
      status: '',
      tenant: '',
      prjName: '',
      creator: '',
      editor: '',
      createTime: '',
      updateTime: '',
      flagRequset: false,
      bindToolTask: false,
      latestOnlineTime: '',
      latestRunTime: '',
      latestYarnLog: '',
      latestTensorBoardLog: '',
      lastestExecTime: '',
      execDetail: {
        timeType: '',
        execCount: 0,
        newCount: 0,
        runningCount: 0,
        finishedCount: 0,
        failCount: 0
      }
    },
    loadingStatus: ''
  }
  public async getTaskInfo(payload: IActiveNodePayload) {
    try {
      const { timeType } = payload
      this.state.loadingStatus = this.$STATUS_LOADING
      const value = await this.$requestHandle(
        'get',
        `/workflow/${payload.workflowId}/node/${payload.nodeId}/toolTask/get`,
        { timeType }
      )
      if (value.data.code === 0 && value.data.data.bindToolTask) {
        this.state.value = value.data.data
      }
      this.$setState(this.state, value)
      this.state.loadingStatus = this.$STATUS_LOADED
      // tslint:disable-next-line
    } catch (e) {}
    return this.state
  }
}

export const ActiveNodeTaskInfoStore = new ActiveNodeTaskInfo()

class ActiveNodeUpstreamInfo extends Base {
  public state: IUpstreamInfoState = {
    value: {
      strongRelation: [],
      weakRelation: []
    }
  }

  public async getUpstreamInfo(payload: IActiveNodePayload) {
    try {
      const value = await this.$requestHandle(
        'get',
        `/workflow/${payload.workflowId}/node/${payload.nodeId}/toolTask/getUpstream`
      )
      this.$setState(this.state, value)
      // tslint:disable-next-line
    } catch (e) {}
    return this.state
  }
}

export const ActiveNodeUpstreamInfoStore = new ActiveNodeUpstreamInfo()

class ActiveNodeExtraInfo extends Base {
  public state: IExtraInfoState = {
    value: {
      dqcStatus: '',
      dqcUrl: '',
      dqcName: '',
      slaStatus: 0,
      slaUrl: '',
      cantorStatus: 0,
      cantorUrl: '',
      cantorName: ''
    }
  }

  public async getExtraInfo(payload: IActiveNodePayload) {
    try {
      const value = await this.$requestHandle(
        'get',
        `/workflow/${payload.workflowId}/node/${payload.nodeId}/toolTask/getExtra`
      )
      this.$setState(this.state, value)
      // tslint:disable-next-line
    } catch (e) {}
    return this.state
  }
}

export const ActiveNodeExtraInfoStore = new ActiveNodeExtraInfo()

interface IActiveNodeState {
  value: Workflow.WorkflowNodeVo
  selectNodeIds: Workflow.WorkflowNodeVo[]
}
class ActiveNode {
  public state: IActiveNodeState = {
    value: graphNodeMock,
    selectNodeIds: []
  }

  public setState(v: Workflow.WorkflowNodeVo) {
    this.state.value = v
  }

  public setSelectNodeIds(v: Workflow.WorkflowNodeVo[]) {
    this.state.selectNodeIds = v
  }
}

export const ActiveNodeStore = new ActiveNode()
