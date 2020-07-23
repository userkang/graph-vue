import { GraphRequestStore } from '@/stores/workflow/graphVisual/GraphContent'
import { HistoryListController } from '@/stores/workflow/graphVisual/HistoryList'
import router from '../../../router'
import { generateDefaultGraph } from '@/mock/workflow'

export interface SwitchGraphState {
  activeGraphExec: Workflow.GraphItemType
  activeProject: string
  isLeftNavFold: boolean
  isRightTableShow: boolean
  isCurrentGraphCanBeEdit: boolean
}

class SwitchGraph {
  public state: SwitchGraphState = {
    activeGraphExec: generateDefaultGraph(),
    activeProject: '',
    isLeftNavFold: true,
    isRightTableShow: true,
    isCurrentGraphCanBeEdit: true
  }

  setActiveGraph(data: Workflow.GraphItemType) {
    this.state.activeGraphExec = data
  }

  changeCurrentGraphEdit(value: boolean) {
    this.state.isCurrentGraphCanBeEdit = value
  }

  cleanActiveGraph() {
    this.state.activeGraphExec = generateDefaultGraph()
  }

  showRightTableFold() {
    this.state.isRightTableShow = true
  }

  changeRightTableFold() {
    this.state.isRightTableShow = !this.state.isRightTableShow
  }

  public async set(value: Workflow.GraphItemType, isToStart = false) {
    const { workflowId, name } = value
    if (workflowId) {
      // fetch data of active graph
      const id = await GraphRequestStore.request(workflowId, true)
      // if (id) {
      const data = {
        name,
        workflowId
      }
      // set global brief graph info
      this.setActiveGraph(data)
      await HistoryListController.setActive(data, isToStart)
      // }
    }

    router.push({
      name: 'workflowDetail',
      params: {
        id: String(workflowId)
      },
      query: {
        name
      }
    })
  }
}

export const SwitchGraphController = new SwitchGraph()
