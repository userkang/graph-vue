import Base from '../../base'
import {
  GraphExecPayload,
  ParamConfigVo,
  TaskModelPayload,
  TaskUpdatePayload,
  ParamVersionVo,
  FieldSubmitItemVo,
  DescribeVo,
  TaskVo,
  NodeVoType
} from '@/types/graph'
import { executeModeMap } from '@/metaData/graph'
import {
  GraphStatusStore,
  GetGraphInfoStore
} from '@/stores/graph/graphVisual/GraphContent'
import store from '../../global'

interface ExecuteGraphPayload {
  graphId: number
  mode: string
  baseNodeId?: number
  execId: number
}

// execute graph included executing the all graph or single node
class ExecuteGraph extends Base {
  public async request(payload: ExecuteGraphPayload) {
    const { graphId, mode, baseNodeId, execId } = payload
    try {
      // this.state.loading = true;
      const res = await this.$requestHandle(
        'post',
        `/training/graph/${graphId}/exec/${execId}/run`,
        {
          mode: executeModeMap[mode],
          baseNodeId
        }
      )
      // 非测试实验里保证版本id和url里一样
      await GetGraphInfoStore.request(res.data.data, execId)
      // tslint:disable-next-line
    } catch (e) {}
  }

  public async testExecute(graphId: number) {
    try {
      // this.state.loading = true;
      const res = await this.$requestHandle(
        'get',
        `/training/test/graph/${graphId}/run`
      )
      await GetGraphInfoStore.request(res.data.data)
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const ExecuteGraphStore = new ExecuteGraph()

class StopGraph extends Base {
  public async request(payload: GraphExecPayload) {
    try {
      const { graphId, execId } = payload
      await this.$requestHandle(
        'get',
        `/training/graph/${graphId}/exec/${execId}/stop`
      )
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const StopGraphStore = new StopGraph()

interface UpdateGraphPayload {
  graphId: number
  graphName?: string
  graphDesc?: string
}

interface CheckoutPersistPayload {
  graphId: number
  persist: boolean
}

// update graph description mainly
class UpdateGraph extends Base {
  public async request(payload: UpdateGraphPayload) {
    const { graphId, graphName, graphDesc } = payload
    try {
      await this.$api.patch(`/training/graph/${graphId}`, {
        graphName,
        graphDesc
      })
    } catch (e) {
      this.$showMessage(e)
    }
  }

  public async checkoutPersist(payload: CheckoutPersistPayload) {
    const { graphId, persist } = payload
    try {
      const value = await this.$requestHandle(
        'post',
        `/training/graph/${graphId}/persist`,
        {
          persist
        }
      )
      return value
    } catch (e) {
      this.$showMessage(e)
    }
  }
}

export const UpdateGraphStore = new UpdateGraph()

interface AddNodePayload {
  graphId: number
  versionId: number
  x: number
  y: number
}

// drag left component and add it to graph as a node
class AddNode extends Base {
  public async request(payload: AddNodePayload) {
    try {
      const { graphId, versionId, x, y } = payload
      const res = await this.$requestHandle(
        'post',
        `/training/graph/${graphId}/node`,
        {
          componentVersionId: versionId,
          posX: x,
          posY: y
        }
      )
      await GetGraphInfoStore.request(res.data.data)
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const AddNodeStore = new AddNode()

interface DeleteNodePayload {
  graphId: number
  nodeId: number
}

// delete graph node
class DeleteNode extends Base {
  public async request(payload: DeleteNodePayload) {
    try {
      const res = await this.$requestHandle(
        'deleted',
        `/training/graph/${payload.graphId}/node/${payload.nodeId}`
      )
      await GetGraphInfoStore.request(res.data.data)
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const DeleteNodeStore = new DeleteNode()

interface NodePositionPayload {
  graphId: number
  nodeId: number
  x: number
  y: number
}

class UpdateNodePosition extends Base {
  public async request(payload: NodePositionPayload) {
    try {
      const { graphId, nodeId, x, y } = payload
      const res = await this.$requestHandle(
        'patch',
        `/training/graph/${graphId}/node/${nodeId}/move`,
        {
          posX: x,
          posY: y
        }
      )
      // await GetGraphInfoStore.request(res.data.data)
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const UpdateNodePositionStore = new UpdateNodePosition()

interface AddEdgePayload {
  graphId: number
  fromNodeId: number
  fromSlotId: number
  toNodeId: number
  toSlotId: number
}

class AddEdge extends Base {
  public async request(payload: AddEdgePayload) {
    const { graphId, fromNodeId, fromSlotId, toNodeId, toSlotId } = payload
    try {
      const res = await this.$requestHandle(
        'post',
        `/training/graph/${graphId}/edge`,
        {
          fromNodeId,
          fromSlotId,
          toNodeId,
          toSlotId
        }
      )
      await GetGraphInfoStore.request(res.data.data)
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const AddEdgeStore = new AddEdge()

interface DeleteEdgePayload {
  graphId: number
  edgeId: number
}

class DeleteEdge extends Base {
  public async request(payload: DeleteEdgePayload) {
    try {
      const { graphId, edgeId } = payload
      const res = await this.$requestHandle(
        'deleted',
        `/training/graph/${graphId}/edge/${edgeId}`
      )
      await GetGraphInfoStore.request(res.data.data)
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const DeleteEdgeStore = new DeleteEdge()

interface NodeDescribeVo {
  list: DescribeVo[]
  loading: boolean
}
class NodeDescribe extends Base {
  public state: NodeDescribeVo = {
    list: [],
    loading: true
  }

  public async getNodeDescribe(graphId: number, nodeId: number) {
    this.state.loading = true
    const res = await this.$requestHandle(
      'get',
      `training/graph/${graphId}/node/${nodeId}/describe`
    )
    // const res = await this.$requestHandle('get', '/training/component')
    if (res) {
      this.state.loading = false
      this.state.list = res.data.data
    }
  }
}

export const nodeDescribeStore = new NodeDescribe()

interface Field {
  name: string
  choosed: boolean
}
interface FieldInfo {
  fieldType: string
  fields: Field[]
  isSelectAll?: boolean
}

interface FieldInfoList {
  loading: boolean
  data: FieldInfo[]
}

// 特征目录，选择字段
class FieldList extends Base {
  public state: FieldInfoList = {
    loading: true,
    data: []
  }

  public clear() {
    this.state.loading = true
    this.state.data = []
  }

  public async submit(
    graphId: number,
    nodeId: number,
    paramId: number,
    submitData: FieldSubmitItemVo[]
  ) {
    try {
      const value = await this.$requestHandle(
        'patch',
        `/training/graph/${graphId}/node/${nodeId}/param/${paramId}/field`,
        {
          value: submitData
        }
      )
      const { refreshStatus } = value.data.data
      if (refreshStatus) {
        const { execId } = store.state.activeGraphExec
        await GraphStatusStore.polling({
          graphId,
          execId
        })
      }
      // tslint:disable-next-line
    } catch (e) {}
  }

  public async request(graphId: number, nodeId: number, paramId: number) {
    try {
      const value = await this.$requestHandle(
        'get',
        `/training/graph/${graphId}/node/${nodeId}/param/${paramId}/field`
      )
      if (value) {
        this.state.loading = false
        this.state.data = value.data.data
      } else {
        this.state.loading = false
      }
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const FieldListStore = new FieldList()

interface NodeParamsState {
  lastNodeId: number
  loadingStatus: string
  value: ParamConfigVo
}

interface SingleParamPayload {
  graphId?: number
  paramVersionId?: number
  paramId: number
  value: number | string | boolean
  tabIndex: number
  customVariable?: string
}

// fetch all params belongs to one node and modify some params belongs to one node
class NodeParams extends Base {
  public state: NodeParamsState = {
    lastNodeId: 0,
    loadingStatus: '',
    // @ts-ignore
    value: {}
  }

  public async request(nodeId: number, tabIndex: number) {
    try {
      this.state.loadingStatus = this.$STATUS_LOADING
      this.state.lastNodeId = nodeId
      // @ts-ignore
      this.state.value = {}
      // [...this.state.value.slice(0, tabIndex)]
      const value = await this.$requestHandle(
        'get',
        `/training/node/${nodeId}/param`
      )
      this.state.value = value.data.data
      // tslint:disable-next-line
    } catch (e) {}
    this.state.loadingStatus = this.$STATUS_LOADED
  }

  // update node params, which is using to save log too
  public async setSingleParamValue(payload: SingleParamPayload) {
    try {
      const { paramId, value: paramValue, tabIndex } = payload
      const value = await this.$requestHandle(
        'patch',
        `/training/node/${this.state.lastNodeId}/param/${paramId}`,
        { value: paramValue }
      )
      const { refreshParam, refreshStatus } = value.data.data
      if (refreshParam) {
        await this.request(this.state.lastNodeId, tabIndex)
      }
      if (refreshStatus) {
        const { graphId, execId } = store.state.activeGraphExec
        await GraphStatusStore.polling({
          graphId,
          execId
        })
      }
      // tslint:disable-next-line
    } catch (e) {}
  }

  public async saveParamVersionContent(payload: SingleParamPayload) {
    try {
      const {
        paramId,
        value: paramValue,
        paramVersionId,
        tabIndex,
        customVariable
      } = payload
      const { graphId } = store.state.activeGraphExec
      const value = await this.$requestHandle(
        'patch',
        `/training/graph/${graphId}/node/${this.state.lastNodeId}/param/${paramId}/paramVersion`,
        { paramVersionId, value: paramValue, customVariable }
      )
      if (value && value.data.code === 0) {
        this.$showMessage('保存成功')
      }
      const { refreshParam, refreshStatus } = value.data.data
      if (refreshParam) {
        await this.request(this.state.lastNodeId, tabIndex)
      }
      if (refreshStatus) {
        const { execId } = store.state.activeGraphExec
        await GraphStatusStore.polling({
          graphId,
          execId
        })
      }
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const NodeParamStore = new NodeParams()

// show some node logs triggered by contextmenu event
class NodeLog extends Base {
  public state = {
    value: {
      isShow: false,
      log: ''
    }
  }

  public async request(graphId: number, nodeId: number) {
    try {
      const value = await this.$requestHandle(
        'get',
        `/training/graph/${graphId}/node/${nodeId}/log`
      )
      this.state.value = value.data.data
      this.state.value.isShow = true
      // tslint:disable-next-line
    } catch (e) {}
  }

  public hide() {
    this.state.value = {
      isShow: false,
      log: ''
    }
  }
}

export const NodeLogStore = new NodeLog()

interface ExecuteScriptPayload {
  nodeId: number
  paramId: number
  value: string
}

// execute script param belongs to one param when show modal
class ExecuteScriptParam extends Base {
  public async request(payload: ExecuteScriptPayload) {
    try {
      const { nodeId, paramId, value } = payload
      this.$showMessage('运行中，请稍后')
      const result = await this.$requestHandle(
        'patch',
        `/training/node/${nodeId}/param/${paramId}/exec`,
        { value }
      )
      return result.data.data
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const ExecuteScriptParamStore = new ExecuteScriptParam()

export const planTypeList = [
  { label: '按天调度', value: 0 },
  { label: 'crontab调度', value: 1 }
]

export interface TaskVoType {
  taskId: number
  userDef: string
  comment: string
  planType: number
  crontabExpr: string
  taskNames: string
  readyTime: string
}

export const defaultTaskMock = () => ({
  userDef: '',
  comment: '',
  planType: 0,
  crontabExpr: '',
  taskNames: '',
  readyTime: ''
})

class RegisterTask extends Base {
  public async request(payload: TaskModelPayload) {
    try {
      const value = await this.$requestHandle(
        'post',
        `/task/exec/${payload.execId}/type/dag`,
        {
          userDef: payload.userDef,
          planType: payload.planType,
          readyTime: payload.readyTime,
          crontabExpr: payload.crontabExpr,
          taskNames: payload.taskNames,
          comment: payload.comment
        }
      )
      this.$showMessage(value.data.message)
    } catch (e) {
      this.$showMessage(e)
    }
  }
}

export const RegisterTaskStore = new RegisterTask()

class TaskOnline extends Base {
  public async request(payload: TaskUpdatePayload) {
    try {
      const value = await this.$requestHandle(
        'post',
        `/task/${payload.taskId}/online`
      )
      this.$showMessage(value.data.message)
    } catch (e) {
      this.$showMessage(e)
    }
  }
}

export const TaskOnlineStore = new TaskOnline()

class TaskOffline extends Base {
  public async request(payload: TaskUpdatePayload) {
    try {
      const value = await this.$requestHandle(
        'post',
        `/task/${payload.taskId}/offline`
      )
      this.$showMessage(value.data.message)
    } catch (e) {
      this.$showMessage(e)
    }
  }
}

export const TaskOfflineStore = new TaskOffline()

class TaskUpdate extends Base {
  public async request(payload: TaskVoType) {
    try {
      const value = await this.$requestHandle(
        'post',
        `/task/${payload.taskId}/update`,
        {
          planType: payload.planType,
          readyTime: payload.readyTime,
          crontabExpr: payload.crontabExpr,
          taskNames: payload.taskNames,
          comment: payload.comment
        }
      )
      this.$showMessage(value.data.message)
    } catch (e) {
      this.$showMessage(e)
    }
  }
}

export const TaskUpdateStore = new TaskUpdate()

export let defaultTaskUpdateForm = {
  taskId: 0,
  userDef: '',
  comment: '',
  planType: 0,
  crontabExpr: '',
  taskNames: '',
  readyTime: '',
  maxRetryTimes: 2,
  relationTaskNames: ''
}

interface TaskVoResultVo {
  data: TaskVo
  loading: boolean
}

export enum ScheduleType {
  'mlp-dag' = 10,
  cantor = 20,
  'mlp-afo' = 30
}
export interface Option {
  label: string
  value: string
}

const scheduleOptionsCancelSymbol = Symbol('scheduleOptions')

class Schedule extends Base {
  public state: TaskVoResultVo = {
    data: {
      taskId: 0,
      bindId: 0,
      regId: 0,
      type: '',
      taskName: '',
      queueName: '',
      userDef: '',
      owner: '',
      projName: '',
      comment: ''
    },
    loading: true
  }

  public async getSchedule(taskId: number) {
    this.state.loading = true
    const res = await this.$requestHandle('get', `/schedule/task/${taskId}`)
    this.state.loading = false
    if (res) {
      this.state.data = res.data.data
    }
  }

  public async offlineSchedule(taskId: number) {
    this.state.loading = true
    const res = await this.$requestHandle(
      'post',
      `/schedule/task/${taskId}/offline`
    )
    this.state.loading = false
    if (res) {
      this.$message.showMessage(res.data.message)
    }
  }

  public async onlineSchedule(taskId: number) {
    this.state.loading = true
    const res = await this.$requestHandle(
      'post',
      `/schedule/task/${taskId}/online`
    )
    this.state.loading = false
    if (res) {
      this.$message.showMessage(res.data.message)
    }
  }

  public async editSchedule(
    graphId: number,
    execId: number,
    regId: number,
    type: string,
    payload: TaskVo
  ) {
    this.state.loading = true
    const res = await this.$requestHandle(
      'post',
      `/schedule/task/${regId}/bind/${graphId}/reg/${execId}/type/${type}`,
      { ...payload }
    )
    this.state.loading = false
    if (res) {
      this.state.data = res.data.data
      this.$message.showMessage(res.data.message)
      return res.data.data
    }
  }

  public async submitSchedule(
    graphId: number,
    execId: number,
    type: string,
    payload: TaskVo
  ) {
    this.state.loading = true
    const res = await this.$requestHandle(
      'post',
      `/schedule/bind/${graphId}/reg/${execId}/type/${type}`,
      { ...payload }
    )
    this.state.loading = false
    if (res) {
      this.$message.showMessage(res.data.message)
      this.state.data = res.data.data
      return res.data.data
    }
  }

  public async getScheduleOptions(
    type: ScheduleType,
    query: string
  ): Promise<Option[]> {
    this.$cancelRequest(scheduleOptionsCancelSymbol)
    let res
    switch (type) {
      case ScheduleType.cantor:
        res = await this.$requestHandle(
          'get',
          '/utils/cantor/task',
          { query },
          true,
          { sourceType: scheduleOptionsCancelSymbol }
        )
        break
      case ScheduleType['mlp-afo']:
        res = await this.$requestHandle(
          'get',
          '/afo/schedule/relations',
          {
            query
          },
          true,
          { sourceType: scheduleOptionsCancelSymbol }
        )
        break
      case ScheduleType['mlp-dag']:
        res = await this.$requestHandle(
          'get',
          '/training/graph/relation',
          {
            query
          },
          true,
          { sourceType: scheduleOptionsCancelSymbol }
        )
        break
      default:
        throw new Error('unknown schedule type')
    }
    return res?.data.data || []
  }
}

export const ScheduleStore = new Schedule()

interface ParamVersionResult {
  data: ParamVersionVo[]
}
class ParamVersion extends Base {
  public state: ParamVersionResult = {
    data: []
  }

  public async getVersionList(nodeId: number, paramId: number) {
    const res = await this.$requestHandle(
      'get',
      `/training/node/${nodeId}/param/${paramId}/paramVersions`
    )
    if (res) {
      this.state.data = res.data.data
      return res.data.data
    }
  }
}

export const ParamVersionStore = new ParamVersion()

interface ParamVersionContentResult {
  data: ParamVersionVo
  loading: boolean
}
class ParamVersionContent extends Base {
  public state: ParamVersionContentResult = {
    data: {
      paramVersionId: 0,
      paramId: 0,
      value: '',
      createTime: '',
      updateTime: '',
      customVariable: '',
      creator: '',
      editor: ''
    },
    loading: true
  }

  public async getVersionContent(
    nodeId: number,
    paramId: number,
    paramVersionId: number | undefined
  ) {
    const res = await this.$requestHandle(
      'get',
      `/training/node/${nodeId}/param/${paramId}`,
      {
        paramVersionId: paramVersionId || ''
      }
    )
    if (res) {
      this.state.data = res.data.data
      return res.data.data
    }
  }

  public async getUpstreamContent(graphId: number, nodeId: number) {
    const res = await this.$requestHandle(
      'get',
      `/training/graph/${graphId}/node/${nodeId}/upstream`
    )
    if (res) {
      return res.data.data
    }
  }
}

export const ParamVersionContentStore = new ParamVersionContent()

class NodeUpdate extends Base {
  public async updateNode(nodeId: number, payload: NodeVoType) {
    try {
      const res = await this.$requestHandle(
        'patch',
        `/training/node/${nodeId}`,
        { ...payload }
      )
      await GetGraphInfoStore.request(res.data.data)
      this.$showMessage(res.data.message)
    } catch (e) {
      this.$showMessage(e)
    }
  }
}

export const NodeUpdateStore = new NodeUpdate()
