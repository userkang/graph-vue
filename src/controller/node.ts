import Graph from './graph'

export default class NodeController {
  graph: Graph

  constructor(graph: Graph) {
    this.graph = graph
  }

  addNode(item: INodeType) {
    this.graph.nodes.push(item)
    this.graph.immutableController.addNode()
  }

  deleteNode(id: number) {
    const nodes = this.graph.nodes
    nodes.splice(
      nodes.findIndex(item => item.nodeId === id),
      1
    )

    // 与节点相关的边也需要删除
    const edges = this.graph.edges

    for (let i = 0; i < edges.length; i++) {
      if (edges[i].fromNodeId === id || edges[i].toNodeId === id) {
        edges.splice(i, 1)
        i--
      }
    }
  }
}
