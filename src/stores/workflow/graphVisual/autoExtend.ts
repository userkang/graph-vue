import Base from '@/stores/base'
import { IWorkflowInfoPayload } from '../createNode/toolTaskXt'

interface IExtendPayload {
  upstream: number
  downstream: number
  taskType: string[]
}

interface INodeItem {
  id: number
  workflowId: number
  nodeGroupId: number
  componentId: number
  componentType: string
  nodeName: string
  desc: string
  posX: number
  posY: number
  createTime: string
  hidden: boolean
}

interface IEdgeItem {
  id: number
  workflowId: number
  nodeGroupId: number
  fromNodeId: number
  toNodeId: number
}

interface IWorkflowExtendState {
  value: {
    groupId: number
    id: number
    workflowName: string
    desc: string
    creator: string
    createTime: string
    updateTime: string
    nodes: INodeItem[]
    edges: IEdgeItem[]
  }
}

class AutoExtend extends Base {
  public state: IWorkflowExtendState = {
    value: {
      groupId: 0,
      id: 0,
      workflowName: '',
      desc: '',
      creator: '',
      createTime: '',
      updateTime: '',
      nodes: [],
      edges: []
    }
  }

  public async workflowExtend(
    workflowInfo: IWorkflowInfoPayload,
    payload: IExtendPayload
  ) {
    try {
      const value = await this.$requestHandle(
        'post',
        `/workflow/${workflowInfo.workflowId}/node/${workflowInfo.nodeId}/extend`,
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

export const AutoExtendStore = new AutoExtend()
