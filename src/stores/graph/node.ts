import { DagStore } from './dag'

class Node {
  public state = {
    value: ''
  }

  public AddNode() {
    DagStore.state.value.nodes.push()
  }
}

export const NodeStore = new Node()
