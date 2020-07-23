import Base from '@/stores/base'

export interface IActiveWorkflowInfo {
  isActive: boolean
  id: string
  bizSubject: string
  bizLine: string
  groupName: string
  groupId: string
  workflowName: string
  owner: string
  workflowDesc: string
  createTime: string
  updateTime: string
  hidden: boolean
}

export interface IUpdateWorkflowPayload {
  workflowId: string | number
  groupId?: string
  workflowName?: string
  owner?: string
  workflowDesc?: string
  transform?: string
}

function getDefaultValue() {
  return {
    isActive: true,
    id: '',
    bizSubject: '',
    bizLine: '',
    groupName: '',
    groupId: '',
    workflowName: '',
    owner: '',
    workflowDesc: '',
    createTime: '',
    updateTime: '',
    hidden: true
  }
}

interface IActiveWorkflowState {
  value: IActiveWorkflowInfo
}

class ActiveWorkflow extends Base {
  public state: IActiveWorkflowState = {
    value: getDefaultValue()
  }

  public async request(id: string | number) {
    try {
      const value = await this.$requestHandle('get', `/workflow/${id}/basic`)
      this.$setState(this.state, value)
      this.show()
      // tslint:disable-next-line
    } catch (e) {}
    return this.state
  }

  public set(payload: IActiveWorkflowInfo) {
    this.state.value = payload
  }

  public show() {
    this.state.value = {
      ...this.state.value,
      isActive: true
    }
  }

  public hide() {
    this.state.value = {
      ...this.state.value,
      isActive: false
    }
  }

  public clean() {
    this.state.value = getDefaultValue()
  }

  public async update(payload: IUpdateWorkflowPayload) {
    try {
      await this.$requestHandle('patch', `/workflow/${payload.workflowId}`, {
        ...payload
      })
      // tslint:disable-next-line
    } catch (e) {}
    return this.state
  }
}

export const ActiveWorkflowStore = new ActiveWorkflow()
