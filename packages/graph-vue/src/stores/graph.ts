import { dagMock, treeMock } from '@/mock/graph'
import { GraphConfigStore } from './graph-config'

class Graph {
  public state = {
    graph: {}
  }

  public getData() {
    GraphConfigStore.state.data = treeMock // dagMock
  }
}

export default new Graph()
