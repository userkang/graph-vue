import { dagMock } from '@/mock/graph'

class Graph {
  public getData() {
    return dagMock
  }
}

export default new Graph()
