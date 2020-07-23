import Base from '../../base'
import { ML_CURRENT_GRAPH, ML_GRAPH_LIST } from '../../../constant/index'
import { GraphItemType } from '@/types/graph'

interface HistoryListState {
  resize: boolean
  list: GraphItemType[]
  current: GraphItemType
}

const generateDefaultCurrentGraph = () => ({
  name: '',
  graphId: 0,
  execId: 0,
  dagId: 0,
  isActive: false
})

class HistoryList extends Base {
  public state: HistoryListState = {
    resize: false,
    list: [],
    current: generateDefaultCurrentGraph()
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

  public setActive(value: GraphItemType, isToStart = false) {
    if (value && value.graphId) {
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
        }
      } else {
        list.unshift({ ...value, isActive: true })
      }
      this.state.list = list
      // save graph list data to localStorage
      this.persistentStorage()
    }
  }

  public removeGraph(value: GraphItemType): GraphItemType {
    const list = [...this.state.list]
    const activeIndex = this.findGraph(list, value)

    // warning the list already modify before setActive,
    if (value.isActive) {
      if (list[activeIndex - 1]) {
        this.setActive(list[activeIndex - 1])
      } else if (list[activeIndex + 1]) {
        this.setActive(list[activeIndex + 1])
      } else {
        this.setActive(generateDefaultCurrentGraph())
      }
    }

    list.splice(activeIndex, 1)
    this.state.list = list
    this.persistentStorage()
    if (this.state.list.length === 0) {
      return generateDefaultCurrentGraph()
    } else {
      return this.state.current
    }
  }

  // if delete graph in graphList page, need to remove all graph with same graphId
  public removeCategoryGraph(graphId: number) {
    this.state.list = this.state.list.filter(graph => graph.graphId !== graphId)
    this.persistentStorage()
  }

  public closeAllGraphs() {
    this.state.list = []
    this.state.current = generateDefaultCurrentGraph()
    this.persistentStorage()
  }

  public closeOtherGraphs() {
    this.state.list = [{ ...this.state.current, isActive: true }]
    this.persistentStorage()
    return this.state.current
  }

  private cleanActive(list: GraphItemType[]) {
    list.forEach((_, index) => {
      list[index].isActive = false
    })
    return list
  }

  private findGraph(list: GraphItemType[], value: GraphItemType) {
    let activeIndex = -1
    for (let i = 0; i < list.length; i++) {
      if (
        list[i].graphId === value.graphId &&
        list[i].execId === value.execId
      ) {
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
