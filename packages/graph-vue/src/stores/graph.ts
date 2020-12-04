import { dagMock } from '@/mock/graph'
import { GraphConfigStore } from './graph-config'

class Graph {
  public getData() {
    GraphConfigStore.state.data = dagMock
  }
}

export default new Graph()
