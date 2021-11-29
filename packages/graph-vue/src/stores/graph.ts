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
    GraphConfigStore.state.data = generateDefaultDemo() // dagMock
  }

  public getTreeData() {
    GraphConfigStore.state.data = generateTreeDemo() // treeNock
  }
}

export default new Graph()
