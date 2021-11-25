import {
  generateDefaultDemo,
  generateTreeDemo,
  generateTestDemo
} from '@/mock/graph'
import { GraphConfigStore } from './graph-config'

class Graph {
  public state = {
    graph: {}
  }

  public getData() {
    // GraphConfigStore.state.data = generateDefaultDemo() // dagMock
    GraphConfigStore.state.data = generateTestDemo() // dagMock
  }

  public getTreeData() {
    GraphConfigStore.state.data = generateDefaultDemo() // treeNock
  }
}

export default new Graph()
