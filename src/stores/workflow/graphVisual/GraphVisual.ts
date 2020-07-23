import Base from '../../base'
import {
  GetGraphInfoStore,
  GraphRequestStore
} from '@/stores/workflow/graphVisual/GraphContent'

interface AddNodePayload {
  componentId: number
  workflowId: number
  posX: number
  posY: number
}

// drag left component and add it to graph as a node
class AddNode extends Base {
  public async request(payload: AddNodePayload) {
    const { workflowId, componentId } = payload

    if (!componentId) {
      return
    }

    const res = await this.$requestHandle(
      'post',
      `/workflow/${workflowId}/node`,
      payload
    )
    await GraphRequestStore.request(workflowId)
    return res.data.data
    // tslint:disable-next-line
  }
}

export const AddNodeStore = new AddNode()

interface DeleteNodePayload {
  workflowId: number
  nodes: Workflow.WorkflowNodeVo[]
}

// delete graph node
class DeleteNode extends Base {
  public async request(payload: DeleteNodePayload) {
    const params = payload.nodes.map(item => {
      return { id: item.id }
    })

    try {
      const res = await this.$requestHandle(
        'post',
        `/workflow/${payload.workflowId}/node-list/delete`,
        params
      )
      await GetGraphInfoStore.request(res.data.data)
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const DeleteNodeStore = new DeleteNode()

class UpdateNodePosition extends Base {
  public async request(workflowId: number, payload: Workflow.WorkflowNodeVo[]) {
    const params = payload.map(item => {
      return { id: item.id, posX: item.posX, posY: item.posY }
    })

    try {
      const res = await this.$requestHandle(
        'post',
        `/workflow/${workflowId}/node-list/move`,
        params
      )
      // await GetGraphInfoStore.request(res.data.data)
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const UpdateNodePositionStore = new UpdateNodePosition()

class AddEdge extends Base {
  public async request(payload: Workflow.WorkflowEdgeVo) {
    const { workflowId } = payload
    try {
      const res = await this.$requestHandle(
        'post',
        `/workflow/${workflowId}/edge`,
        payload
      )
      await GetGraphInfoStore.request(res.data.data)
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const AddEdgeStore = new AddEdge()

interface DeleteEdgePayload {
  workflowId: number
  edgeId: number
}

class DeleteEdge extends Base {
  public async request(payload: DeleteEdgePayload) {
    try {
      const { workflowId, edgeId } = payload
      const res = await this.$requestHandle(
        'deleted',
        `/workflow/${workflowId}/edge/${edgeId}`
      )
      await GetGraphInfoStore.request(res.data.data)
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const DeleteEdgeStore = new DeleteEdge()

interface NodeCopyPayload {
  nodeId: number
  workflowId: number
  taskName?: string
}
class NodeCopy extends Base {
  public async updateNode(payload: NodeCopyPayload) {
    try {
      const { workflowId, nodeId, taskName } = payload
      const res = await this.$requestHandle(
        'post',
        `/workflow/${workflowId}/node/${nodeId}/copy`,
        { taskName }
      )
      await GetGraphInfoStore.request(res.data.data)
    } catch (e) {
      this.$showMessage(e)
    }
  }
  public async getNodeTaskNameInfo(payload: Omit<NodeCopyPayload, 'taskName'>): Promise<Workflow.ToolTaskNameVo> {
    const { workflowId, nodeId } = payload
    const res = await this.$requestHandle(
      'get',
      `/workflow/${workflowId}/node/${nodeId}/toolTask/name/get`
    )
    return res.data.data
  }
}

export const NodeCopyStore = new NodeCopy()

interface NodeReloadPayload {
  workflowId: number
  nodeId: number
}
class NodeReload extends Base {
  public async reload(payload: NodeReloadPayload) {
    try {
      const { workflowId, nodeId } = payload
      const res = await this.$requestHandle(
        'get',
        `/workflow/${workflowId}/node/${nodeId}/reload`
      )
      return res.data.data
    } catch (e) {
      this.$showMessage(e)
    }
  }
}

export const NodeReloadStore = new NodeReload()

interface ICreateNodeGroupPayload {
  workflowId: number
  nodeGroupName: string
  nodes: Array<{ id: number }>
}

interface INodeGroupPayload {
  workflowId: number
  nodeGroupId: number
  posX?: number
  posY?: number
}

interface IRenameGroupPayload extends INodeGroupPayload {
  nodeGroupName: string
}
class NodeGroup extends Base {
  public async createNodeGroup(payload: ICreateNodeGroupPayload) {
    try {
      const { workflowId, nodeGroupName, nodes } = payload
      const res = await this.$requestHandle(
        'post',
        `/workflow/${workflowId}/node-group`,
        {
          nodeGroupName,
          nodes
        }
      )
      await GetGraphInfoStore.request(res.data.data)
      this.$showMessage(res.data.message)
    } catch (e) {
      this.$showMessage(e)
    }
  }

  public async addNodeGroup(payload: INodeGroupPayload) {
    try {
      const { workflowId, nodeGroupId, posX, posY } = payload
      const res = await this.$requestHandle(
        'post',
        `/workflow/${workflowId}/node-group/share`,
        {
          nodeGroupId,
          posX,
          posY
        }
      )
      await GetGraphInfoStore.request(res.data.data)
    } catch (e) {
      this.$showMessage(e)
    }
  }

  public async rename(payload: IRenameGroupPayload) {
    try {
      const { workflowId, nodeGroupId, nodeGroupName } = payload
      const res = await this.$requestHandle(
        'patch',
        `/workflow/${workflowId}/node-group/${nodeGroupId}`,
        {
          nodeGroupName
        }
      )
      await GetGraphInfoStore.request(res.data.data)
    } catch (e) {
      this.$showMessage(e)
    }
  }

  public async fold(payload: INodeGroupPayload, value: boolean) {
    try {
      const { workflowId, nodeGroupId } = payload
      const res = await this.$requestHandle(
        'patch',
        `/workflow/${workflowId}/node-group/${nodeGroupId}`,
        {
          fold: value
        }
      )
      // await GetGraphInfoStore.request(res.data.data)
    } catch (e) {
      this.$showMessage(e)
    }
  }

  public async splitGroup(payload: INodeGroupPayload) {
    try {
      const { workflowId, nodeGroupId } = payload
      const res = await this.$requestHandle(
        'deleted',
        `/workflow/${workflowId}/node-group/${nodeGroupId}`
      )
      await GetGraphInfoStore.request(res.data.data)
    } catch (e) {
      this.$showMessage(e)
    }
  }

  public async execAFO(payload: INodeGroupPayload) {
    try {
      const { workflowId, nodeGroupId } = payload
      const res = await this.$requestHandle(
        'post',
        `/afo/workflow/${workflowId}/node-group/${nodeGroupId}/exec`
      )
      this.$showMessage('节点组开始执行')
      await GetGraphInfoStore.request(res.data.data)
    } catch (e) {
      this.$showMessage(e)
    }
  }
}

export const NodeGroupStore = new NodeGroup()
