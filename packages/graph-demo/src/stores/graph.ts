import GraphConfigStore from './graph-config'
import { Graph as GraphType } from '@datafe/graph-core'
import { dagMock, treeMock, mindMapMock } from '@/mock/graph'

class Graph {
  public state = {
    graph: null as GraphType | null
  }

  public getDagData() {
    GraphConfigStore.state.data = dagMock()
  }

  public getTreeData() {
    GraphConfigStore.state.data = treeMock(5) as any
  }

  public getMindMapData() {
    GraphConfigStore.state.data = mindMapMock()
  }
}

export default new Graph()
