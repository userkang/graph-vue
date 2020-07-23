import { generateDefaultGraph } from '@/mock/workflow'

const ML_CURRENT_GRAPH = 'ML_WORKFLOW_CURRENT_GRAPH'
const ML_GRAPH_LIST = 'ML_WORKFLOW_GRAPH_LIST'

interface HistoryListState {
  resize: boolean
  list: Workflow.GraphItemType[]
  current: Workflow.GraphItemType
}

class HistoryList {
  public state: HistoryListState = {
    resize: false,
    list: [],
    current: generateDefaultGraph()
  }

  public parseStorage() {
    const list = localStorage.getItem(ML_GRAPH_LIST)
    const current = localStorage.getItem(ML_CURRENT_GRAPH)
    if (list) {
      this.state.list = JSON.parse(list)
    }
    if (current) {
      this.state.current = JSON.parse(current)
    }
  }

  public setActive(value: Workflow.GraphItemType, isToStart = false) {
    if (value && value.workflowId) {
      this.state.current = value
      let list = [...this.state.list]
      const activeIndex = this.findGraph(list, value)
      list = this.cleanActive(list)
      if (activeIndex !== -1) {
        if (isToStart) {
          const item = list.splice(activeIndex, 1)
          list.unshift({ ...item[0], isActive: true })
        } else {
          list[activeIndex].isActive = true
          list[activeIndex].name = value.name
            ? value.name
            : list[activeIndex].name
        }
      } else {
        list.unshift({ ...value, isActive: true })
      }
      this.state.list = list
      // save graph list data to localStorage
      this.persistentStorage()
    }
  }

  public removeGraph(value: Workflow.GraphItemType): Workflow.GraphItemType {
    const list = [...this.state.list]
    const activeIndex = this.findGraph(list, value)

    // warning the list already modify before setActive,
    if (value.isActive) {
      if (list[activeIndex - 1]) {
        this.setActive(list[activeIndex - 1])
      } else if (list[activeIndex + 1]) {
        this.setActive(list[activeIndex + 1])
      } else {
        this.setActive(generateDefaultGraph())
      }
    }

    list.splice(activeIndex, 1)
    this.state.list = list
    this.persistentStorage()
    if (this.state.list.length === 0) {
      return generateDefaultGraph()
    } else {
      return this.state.current
    }
  }

  // if delete graph in graphList page, need to remove all graph with same graphId
  public removeCategoryGraph(workflowId: number) {
    this.state.list = this.state.list.filter(
      graph => graph.workflowId !== workflowId
    )
    this.persistentStorage()
  }

  public closeAllGraphs() {
    this.state.list = []
    this.state.current = generateDefaultGraph()
    this.persistentStorage()
  }

  public closeOtherGraphs() {
    this.state.list = [{ ...this.state.current, isActive: true }]
    this.persistentStorage()
    return this.state.current
  }

  private cleanActive(list: Workflow.GraphItemType[]) {
    list.forEach((_, index) => {
      list[index].isActive = false
    })
    return list
  }

  private findGraph(
    list: Workflow.GraphItemType[],
    value: Workflow.GraphItemType
  ) {
    let activeIndex = -1
    for (let i = 0; i < list.length; i++) {
      if (list[i].workflowId === value.workflowId) {
        activeIndex = i
        break
      }
    }
    return activeIndex
  }

  private persistentStorage() {
    localStorage.setItem(ML_GRAPH_LIST, JSON.stringify(this.state.list))
    localStorage.setItem(ML_CURRENT_GRAPH, JSON.stringify(this.state.current))
  }
}

export const HistoryListController = new HistoryList()
