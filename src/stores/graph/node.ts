import Base from '../base'
import { DagStore } from './dag'
import { INodeType } from '@/types/dag'

let nodeId = 0
class Node extends Base {
  public state = {
    value: ''
  }

  public addNode(item: INodeType) {
    // 生成唯一nodeId
    item.nodeId = nodeId++
    DagStore.state.dag.nodes.push(item)
  }

  public updateNodePosition(nodes: INodeType[]) {
    // 更新节点位置信息
  }
}

export const NodeStore = new Node()
