import Graph from './graph'
import Node from '../item/node'
import { INodeModel } from '../types'

export default class NodeController {
  graph: Graph

  constructor(graph: Graph) {
    this.graph = graph
  }

  addNode(item: INodeModel) {
    const { width, height } = this.graph.getNodeInfo()
    const node = new Node(item, {
      width,
      height,
      drection: this.graph.get('drection')
    })
    this.graph.getNodes().push(node)
  }

  deleteNode(id: string) {
    const nodes = this.graph.getNodes()
    nodes.splice(
      nodes.findIndex(item => item.id === id),
      1
    )

    // 与节点相关的边也需要删除
  }
}
