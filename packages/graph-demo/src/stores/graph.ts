import GraphConfigStore from './graph-config'
import { Graph as GraphType } from 'graph-logic'
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
}

export default new Graph()
