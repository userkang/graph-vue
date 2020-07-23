import Base from '../base'
import { GraphModalPayload, GraphVoType, WXProjectVoType } from '@/types/graph'

interface GraphListPayload {
  page: number
  size: number
  sort: string
  query: string
}

interface GraphListState {
  value: {
    currentPageNo: number
    pageSize: number
    totalCount: number
    totalPageCount: number
    items: GraphVoType[]
  }
  loadingStatus: string
}

// 拉取实验列表
class GraphList extends Base {
  public state: GraphListState = {
    value: {
      currentPageNo: 0,
      pageSize: 0,
      totalCount: 0,
      totalPageCount: 0,
      items: []
    },
    loadingStatus: ''
  }

  public async request(payload: GraphListPayload) {
    try {
      this.state.loadingStatus = this.$STATUS_LOADING
      this.state.value.items = []
      const value = await this.$requestHandle('get', '/training/graph', payload)
      this.state.value = value.data.data
      // tslint:disable-next-line
    } catch (e) {}
    this.state.loadingStatus = this.$STATUS_LOADED
  }
}

export const GraphListStore = new GraphList()

interface ProjectState {
  value: WXProjectVoType[]
  activeProject: WXProjectVoType
}

class ProjectList extends Base {
  public state: ProjectState = {
    value: [],
    activeProject: {
      id: 0,
      name: ''
    }
  }

  public async request() {
    try {
      const value = await this.$requestHandle('get', '/utils/wx-project')
      this.state.value = value.data.data
      // tslint:disable-next-line
    } catch (e) {}
    return this.state.value
  }
}

export const ProjectListStore = new ProjectList()

// 删除实验
class DeleteGraph extends Base {
  public async request(id: number) {
    try {
      const value = await this.$requestHandle(
        'deleted',
        `/training/graph/${id}`
      )
      this.$showMessage(value.data.message)
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const DeleteGraphStore = new DeleteGraph()

interface CopyGraphPayload {
  id: number
  execId: number
  name: string
  desc: string
}

// 复制实验
class CopyGraph extends Base {
  public async request(payload: CopyGraphPayload) {
    const { id, execId, name, desc } = payload
    try {
      const value = await this.$requestHandle(
        'post',
        `/training/graph/${id}/exec/${execId || 0}/copy`,
        {
          graphName: name,
          graphDesc: desc
        }
      )
      this.$showMessage(value.data.message)
      return {
        graphId: value.data.data.graphId,
        graphName: value.data.data.graphName
      }
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const CopyGraphStore = new CopyGraph()

// 创建实验
class CreateGraph extends Base {
  public async request(payload: GraphModalPayload) {
    try {
      const value = await this.$requestHandle('post', '/training/graph', {
        graphName: payload.name,
        graphDesc: payload.desc
      })
      this.$showMessage(value.data.message)
      return {
        id: value.data.data.graphId,
        name: value.data.data.graphName
      }
      // tslint:disable-next-line
    } catch (e) {}
    return null
  }
}

export const CreateGraphStore = new CreateGraph()
