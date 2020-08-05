import Base from '../base'
import { DagStore } from './dag'
import { INodeType } from '@/types/dag'

let nodeId = 0
class Node extends Base {
  state = {
    value: ''
  }

  addNode(item: INodeType) {
    // 生成唯一nodeId
    item.nodeId = nodeId++
    DagStore.state.dag.nodes.push(item)
  }

  updateNodePosition(nodes: INodeType[]) {
    // 更新节点位置信息,目前直接修改对象实现参数修改，所以暂时没写接口层逻辑处理
  }

  deleteNode(id: number) {
    const nodes = DagStore.state.dag.nodes
    nodes.splice(
      nodes.findIndex(item => item.nodeId === id),
      1
    )

    // 与节点相关的边也需要删除
    const edges = DagStore.state.dag.edges

    for (let i = 0; i < edges.length; i++) {
      if (edges[i].fromNodeId === id || edges[i].toNodeId === id) {
        edges.splice(i, 1)
        i--
      }
    }
  }
}

export const NodeStore = new Node()
