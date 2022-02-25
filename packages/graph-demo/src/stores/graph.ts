import GraphConfigStore from './graph-config'
import { dagMock, treeMock } from '@/mock/graph'

class Graph {
  public state = {
    graph: {}
  }

  public getData() {
    GraphConfigStore.state.data = dagMock()
  }

  public getTreeData() {
    GraphConfigStore.state.data = treeMock(50)
  }
}

export default new Graph()
