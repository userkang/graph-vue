import { dagMock } from '@/mock/graph'

interface IDagState {
  graph: IDagType
}

class Graph {
  public state: IDagState = {
    graph: {
      graphId: 0,
      nodes: [],
      edges: []
    }
  }

  public getData() {
    this.state.graph = dagMock
  }
}

export default new Graph()
