import {
  EdgeVoType,
  ExecStatusVoType,
  GraphVoType,
  GraphExecPayload,
  NodeVoStatusType,
  NodeStatusType,
  NodeVoType,
  TaskVo
} from '@/types/graph'
import Base from '@/stores/base'
import { graphInfoMock, graphStatusMock } from '@/mock/graph'
import { ActiveGraphController } from '@/stores/graph/graphVisual/LocalState'
import store from '@/stores/global'


interface GraphDagInfo {
  responseGraphId: number
  responseExecId: number
  dagId: number
}

interface ResetNodePositionPayload {
  nodeId: number
  x: number
  y: number
}

interface GraphVisualState {
  isRefreshEdge: boolean
  isRequesting: boolean
  loadingStatus: string
  value: GraphVoType
  nodes: NodeVoType[]
  edges: EdgeVoType[]
  linkedSlots: number[]
  isTest: boolean
  componentId: number
  componentVersionId: number
  task: TaskVo
  isDagActived: boolean
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
    linkedSlots: [],
    isTest: false,
    componentId: 0,
    componentVersionId: 0,
    task: {
      bindId: null,
      comment: null,
      crontabExpr: null,
      execDay: null,
      execHours: null,
      owner: '',
      planType: 0,
      projName: '',
      queueName: '',
      readyTime: '',
      regId: null,
      status: null,
      taskId: null,
      taskName: null,
      timeout: 7200,
      type: null,
      userDef: '106033',
      maxRetryTimes: 2,
      relations: [
        {
          dependPlatform: 20,
          taskName: '',
          dependType: 1
        }
      ]
    },
    isDagActived: false
  }

  public setTestState(v: boolean) {
    this.state.isTest = v
  }

  public setComponentId(v: number) {
    this.state.componentId = v
  }

  public setComponentVersionId(v: number) {
    this.state.componentVersionId = v
  }

  public async request(
    payload: GraphExecPayload,
    isClean?: boolean,
    graphInfo?: GraphVoType
  ): Promise<GraphDagInfo> {
    const { graphId, execId } = payload
    if (isClean) {
      this.state.loadingStatus = this.$STATUS_LOADING
    }
    try {
      let data
      if (graphInfo) {
        data = graphInfo
      } else {
        let value
        if (this.state.isTest) {
          value = await this.$requestHandle(
            'post',
            `/cmpt/component/${this.state.componentId}/version/${this.state.componentVersionId}/graph`
          )
        } else {
          value = await this.$requestHandle(
            'get',
            `/training/graph/${graphId}/exec/${execId}`
          )
        }
        data = value.data.data
      }

      this.state.value = data
      this.state.nodes = data.dag.nodes
      this.state.edges = data.dag.edges
      this.state.isDagActived = data.dag.actived
      this.state.linkedSlots = this.extractLinkedSlots(this.state.edges)
      ActiveGraphController.set({
        isActive: true,
        graphId: data.graphId,
        graphName: data.graphName,
        version: String(payload.execId),
        createTime: data.createTime,
        desc: data.graphDesc,
        persist: data.dag.persist,
        dagActive: data.dag.actived
      })
      const currentProjectName = localStorage.getItem('ml.projectName')
      const isGraphLocked =
        data.dag.locked || data.projectName !== currentProjectName
      await store.commit('changeCurrentGraphEdit', !isGraphLocked)
      // special logic: if execId is 0, need to replace execId with response execId(may be null, so assign 0)
      // if execId is not 0, return the execId of payload
      this.state.loadingStatus = this.$STATUS_LOADED
      return {
        responseGraphId: data.graphId,
        responseExecId: data.execId || 0,
        dagId: data.dag.graphId
      }
      // tslint:disable-next-line
    } catch (e) {}
    this.state.loadingStatus = this.$STATUS_LOADED
    return {
      responseGraphId: 0,
      responseExecId: 0,
      dagId: 0
    }
  }

  public updateNodePosition(payload: ResetNodePositionPayload) {
    this.state.isRefreshEdge = true
    const nodes = [...this.state.nodes]
    let index = -1
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeId === payload.nodeId) {
        index = i
        break
      }
    }
    if (index !== -1) {
      nodes[index] = {
        ...nodes[index],
        posX: payload.x,
        posY: payload.y
      }
      this.state.nodes = nodes
    }
    setTimeout(() => {
      this.state.isRefreshEdge = false
    }, 0)
  }

  public updateNodeStatus(nodeStatus: NodeVoStatusType[]) {
    const nodes = [...this.state.nodes]
    nodes.forEach((node, nodeIndex) => {
      nodeStatus.forEach((status, statusIndex) => {
        if (node.nodeId === status.nodeId) {
          nodes[nodeIndex].status = status.status
        }
      })
    })
    this.state.nodes = nodes
  }

  public cleanContent() {
    this.state.nodes = []
    this.state.edges = []
    this.state.value = graphInfoMock
    this.state.isTest = false
    this.state.componentId = 0
    this.state.componentVersionId = 0
  }

  private extractLinkedSlots(edges: EdgeVoType[]) {
    const linkedSlots: number[] = []
    edges.forEach(edge => {
      if (!linkedSlots.includes(edge.fromSlotId)) {
        linkedSlots.push(edge.fromSlotId)
      }
      if (!linkedSlots.includes(edge.toSlotId)) {
        linkedSlots.push(edge.toSlotId)
      }
    })
    return linkedSlots
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

  public async polling(payload: GraphExecPayload) {
    this.killTimer()
    let status = await this.request(payload)
    // if graph is in running status, polling the graph status
    if (status && status === ServiceStatus.RUNNING) {
      this.state.timer = setInterval(async () => {
        status = await this.request(payload)
        if (status !== ServiceStatus.RUNNING) {
          clearInterval(this.state.timer)
          this.state.timer = 0
        }
      }, 2000)
    }
  }

  public async request(payload: GraphExecPayload) {
    try {
      const { graphId, execId } = payload
      const value = await this.$requestHandle(
        'get',
        `/training/graph/${graphId}/exec/${execId}/status`
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
  public async request(
    payload: GraphExecPayload,
    isClean?: boolean
  ): Promise<number> {
    try {
      // first request graph content, then polling request graph status
      const graphDagInfo: GraphDagInfo = await GraphVisualStore.request(
        payload,
        isClean
      )
      GraphStatusStore.killTimer()
      // if execId is null, not polling graph status
      if (graphDagInfo.responseExecId) {
        await GraphStatusStore.polling({
          graphId: graphDagInfo.responseGraphId,
          execId: payload.execId
        })
      } else {
        GraphStatusStore.cleanContent()
      }
      return graphDagInfo.dagId
    } catch (e) {
      this.$showMessage(e)
    }
    return 0
  }
}

export const GraphRequestStore = new GraphRequest()

// 不发请求的获取Graph信息
class GetGraphInfo extends Base {
  public async request(data: GraphVoType, execId: number = 0): Promise<number> {
    try {
      const graphId = data.graphId
      // 将获取的实验信息通过data传入，而不需要再发出请求
      const graphDagInfo: GraphDagInfo = await GraphVisualStore.request(
        { graphId, execId },
        false,
        data
      )
      // 更新节点状态
      GraphVisualStore.updateNodeStatus(data.execStatus.nodeStatusList)

      if (
        data.execStatus.status &&
        data.execStatus.status === ServiceStatus.RUNNING
      ) {
        GraphStatusStore.killTimer()
        // if execId is null, not polling graph status
        if (graphDagInfo.responseExecId) {
          await GraphStatusStore.polling({
            graphId: graphDagInfo.responseGraphId,
            execId
          })
        } else {
          GraphStatusStore.cleanContent()
        }
      }

      return graphDagInfo.dagId
    } catch (e) {
      this.$showMessage(e)
    }
    return 0
  }
}

export const GetGraphInfoStore = new GetGraphInfo()
interface NodeStatusStoreType {
  loadingStatus: string
  value: NodeStatusType
}
interface NodeStatusPayload {
  nodeId: string | number
  graphId: string | number
}
class GraphNodeStatus extends Base {
  public state: NodeStatusStoreType = {
    loadingStatus: '',
    value: {
      metricOperator: false
    }
  }
  public async request(payload: NodeStatusPayload) {
    this.state.loadingStatus = this.$STATUS_LOADING
    try {
      // tslint:disable-next-line
      const value = await this.$requestHandle(
        'get',
        `/mlx/collector/graph/${payload.graphId}/node/${payload.nodeId}/metric-operator`
      )
      const data = value.data.data
      this.state.value.metricOperator = data
      return data
      // tslint:disable-next-line
    } catch (e) {}
    this.state.loadingStatus = this.$STATUS_LOADED
  }

  public reset() {
    this.state = {
      loadingStatus: '',
      value: {
        metricOperator: false
      }
    }
  }
}

export const GraphNodeStore = new GraphNodeStatus()
