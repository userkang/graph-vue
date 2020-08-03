import Base from '../base'
import { DagStore } from './dag'
import { IEdgeType } from '@/types/dag'

let edgeId = 0
class Edge extends Base {
  public state = {
    isSlotActive: 0
  }

  public addEdge(item: IEdgeType) {
    // 生成唯一edgeId
    item.edgeId = edgeId++
    DagStore.state.dag.edges.push(item)
  }
}

export const EdgeStore = new Edge()
