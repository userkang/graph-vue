import { DagStore } from './dag'
import { INodeType } from '@/types/dag'

class Node {
  public state = {
    value: ''
  }

  public addNode(item: INodeType) {
    DagStore.state.dag.nodes.push(item)
  }
}

export const NodeStore = new Node()
