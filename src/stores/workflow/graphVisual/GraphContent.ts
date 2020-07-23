import { ExecStatusVoType, NodeVoStatusType } from '@/types/graph'
import Base from '@/stores/base'
import { graphInfoMock, graphStatusMock } from '@/mock/workflow'
import { ActiveWorkflowStore } from '@/stores/workflow/graphVisual/activeWorkflow'
import { SwitchGraphController } from '@/stores/workflow/graphVisual/SwitchGraph'

interface NodePositionPayload {
  nodes: Workflow.WorkflowNodeVo[]
  moveX: number
  moveY: number
}

interface GraphVisualState {
  isRefreshEdge: boolean
  isRequesting: boolean
  loadingStatus: string
  value: Workflow.WorkflowVo
  nodes: Workflow.WorkflowNodeVo[]
  edges: Workflow.WorkflowEdgeVo[]
  nodeGroups: Workflow.WorkflowNodeGroupVo[]
  componentId: number
  isEditGroup: boolean
  selecting: boolean
  linkedSlots: string[]
  isSlotActive: boolean
  transform: { translateX: string; translateY: string }
}

// graphDetail included visual chart info and right basic info panel
class GraphVisual extends Base {
  public state: GraphVisualState = {
    isRefreshEdge: false,
    isRequesting: false,
    loadingStatus: '',
    value: graphInfoMock,
    nodes: [],
    edges: [],
    nodeGroups: [],
    componentId: 0,
    isEditGroup: false,
    selecting: false,
    linkedSlots: [],
    isSlotActive: false,
    transform: {
      translateX: '0',
      translateY: '0'
    }
  }

  public setSlotActive(v: boolean) {
    this.state.isSlotActive = v
  }

  public async request(
    workflowId: number,
    isClean?: boolean,
    graphInfo?: Workflow.WorkflowVo
  ) {
    if (isClean) {
      this.state.loadingStatus = this.$STATUS_LOADING
    }
    try {
      let data
      if (graphInfo) {
        data = graphInfo
      } else {
        const value = await this.$requestHandle(
          'get',
          `/workflow/${workflowId}`
        )
        data = value.data.data
      }

      this.state.value = data
      this.state.nodes = data.nodes
      this.state.edges = data.edges
      this.state.nodeGroups = data.nodeGroups
      this.state.linkedSlots = this.extractLinkedSlots(this.state.edges)
      this.extractTransform()

      // 当前所在项目组
      const currentProjectName = localStorage.getItem('ml.projectName')

      // 是否锁定画布不可编辑
      const isGraphLocked =
        data.dag.locked || data.projectName !== currentProjectName
      await SwitchGraphController.changeCurrentGraphEdit(!isGraphLocked)

      this.state.loadingStatus = this.$STATUS_LOADED
      return data.id
      // tslint:disable-next-line
    } catch (e) {}
    this.state.loadingStatus = this.$STATUS_LOADED
    return 0
  }

  public updateNodePosition(payload: NodePositionPayload) {
    this.state.isRefreshEdge = true
    payload.nodes.forEach(item => {
      item.posX = item.startX + payload.moveX
      item.posY = item.startY + payload.moveY
    })

    setTimeout(() => {
      this.state.isRefreshEdge = false
    }, 0)
  }

  public updateNodeStatus(nodeStatus: NodeVoStatusType[]) {
    const nodes = [...this.state.nodes]
    nodes.forEach((node, nodeIndex) => {
      nodeStatus.forEach((status, statusIndex) => {
        if (node.id === status.nodeId) {
          // nodes[nodeIndex].status = status.status
        }
      })
    })
    this.state.nodes = nodes
  }

  public cleanContent() {
    this.state.nodes = []
    this.state.edges = []
    this.state.nodeGroups = []
    this.state.value = graphInfoMock
    this.state.componentId = 0
  }

  private extractLinkedSlots(edges: Workflow.WorkflowEdgeVo[]) {
    const linkedSlots: string[] = []
    edges.forEach(edge => {
      if (!linkedSlots.includes(edge.fromNodeId + 'out')) {
        linkedSlots.push(edge.fromNodeId + 'out')
      }
      if (!linkedSlots.includes(edge.toNodeId + 'in')) {
        linkedSlots.push(edge.toNodeId + 'in')
      }
    })
    return linkedSlots
  }

  private extractTransform() {
    if (this.state.value.transform) {
      const arr = this.state.value.transform.split(',')
      this.state.transform.translateX = arr[0]
      this.state.transform.translateY = arr[1]
    } else {
      this.state.transform.translateX = this.state.transform.translateY = '0'
    }
  }
}

export const GraphVisualStore = new GraphVisual()

interface GraphStatusState {
  timer: number
  value: ExecStatusVoType
}

class GraphStatus extends Base {
  public state: GraphStatusState = {
    timer: 0,
    value: graphStatusMock
  }

  public async request(id: number) {
    try {
      const value = await this.$requestHandle(
        'get',
        `/training/graph/${id}/exec/status`
      )
      this.state.value = value.data.data
      // polling node status to update graph content node status
      GraphVisualStore.updateNodeStatus(value.data.data.nodeStatusList)
      return this.state.value.status
      // tslint:disable-next-line
    } catch (e) {}
    return 0
  }

  public killTimer() {
    if (this.state.timer) {
      clearInterval(this.state.timer)
      this.state.timer = 0
    }
  }

  public cleanContent() {
    this.state.value = graphStatusMock
  }
}

export const GraphStatusStore = new GraphStatus()

class GraphRequest extends Base {
  public async request(workflowId: number, isClean?: boolean): Promise<number> {
    try {
      // first request graph content, then polling request graph status
      const id = await GraphVisualStore.request(workflowId, isClean)
      // GraphStatusStore.killTimer()
      // // if execId is null, not polling graph status
      // if (graphDagInfo.responseExecId) {
      //   await GraphStatusStore.polling(graphDagInfo.responseGraphId)
      // } else {
      //   GraphStatusStore.cleanContent()
      // }
      // return graphDagInfo.dagId
      return id
    } catch (e) {
      this.$showMessage(e)
    }
    return 0
  }
}

export const GraphRequestStore = new GraphRequest()

// 不发请求的获取Graph信息
class GetGraphInfo extends Base {
  public async request(data: Workflow.WorkflowVo): Promise<number> {
    try {
      // 将获取的实验信息通过data传入，而不需要再发出请求
      const id = await GraphVisualStore.request(data.id, false, data)
      // 更新节点状态
      // GraphVisualStore.updateNodeStatus(data.execStatus.nodeStatusList)

      // if (
      //   data.execStatus.status &&
      //   data.execStatus.status === ServiceStatus.RUNNING
      // ) {
      //   GraphStatusStore.killTimer()
      //   // if execId is null, not polling graph status
      //   if (graphDagInfo.responseExecId) {
      //     await GraphStatusStore.polling(workflowId)
      //   } else {
      //     GraphStatusStore.cleanContent()
      //   }
      // }

      return id
    } catch (e) {
      this.$showMessage(e)
    }
    return 0
  }
}

export const GetGraphInfoStore = new GetGraphInfo()


class DQC extends Base {
  state = {
    loading: false
  }
  async getDQCUrl(workflowId: number, nodeId: number) {
    this.state.loading = true
    try {
      const res = await this.$requestHandle('get', `/workflow/${workflowId}/node/${nodeId}/tool/dqc/get`)
      return res.data.data
    } finally {
      this.state.loading = false
    }
  }
}

export const DQCStore = new DQC()

class RelatedWorkflows extends Base {
  state = {
    loading: false,
    relatedWorkflows: []
  }
  async getRelatedWorkflows(nodeId: number) {
    this.state.loading = true
    this.state.relatedWorkflows = []
    try {
      const res = await this.$requestHandle('get', `/workflow/reference/${nodeId}`)
      return this.state.relatedWorkflows = res.data.data
    } finally {
      this.state.loading = false
    }
  }
}

export const RelatedWorkflowsStore = new RelatedWorkflows()
