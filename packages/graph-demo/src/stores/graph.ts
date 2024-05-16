import GraphConfigStore from './graph-config'
import { Graph as GraphType } from '@datafe/graph-core'
import { dagMock, treeMock } from '@/mock/graph'

class Graph {
  public state = {
    graph: null as GraphType | null
  }

  public getDagData() {
    GraphConfigStore.state.data = dagMock()
  }

  public getTreeData() {
    GraphConfigStore.state.data = treeMock(600) as any
  }
}

export default new Graph()
