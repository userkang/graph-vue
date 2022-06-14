import GraphConfigStore from './graph-config'
import { dagMock, treeMock, mindMapMock } from '@/mock/graph'

class Graph {
  public state = {
    graph: {}
  }

  public getDagData() {
    GraphConfigStore.state.data = dagMock()
  }

  public getTreeData() {
    GraphConfigStore.state.data = treeMock(50) as any
  }

  public getMindMapData() {
    GraphConfigStore.state.data = mindMapMock()
  }
}

export default new Graph()
