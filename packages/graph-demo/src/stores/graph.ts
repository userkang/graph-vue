import GraphConfigStore from './graph-config'
import { dagMock, treeMock } from '@/mock/graph'

class Graph {
  public state = {
    graph: null
  }

  public getData() {
    GraphConfigStore.state.data = dagMock()
  }

  public getTreeData() {
    GraphConfigStore.state.data = treeMock()
  }
}

export default new Graph()
