import Graph from './graph'

export default class NodeController {
  graph: Graph

  // 当前被选中节点
  select: INodeType[] = []

  constructor(graph: Graph) {
    this.graph = graph
  }

  addNode(item: INodeType) {
    this.graph.setSlotPoint(item)
    this.graph.nodes.push(JSON.parse(JSON.stringify(item)))
  }

  deleteNode(id: number) {
    const nodes = this.graph.getNodes()
    nodes.splice(
      nodes.findIndex(item => item.nodeId === id),
      1
    )

    // 与节点相关的边也需要删除
    const edges = this.graph.getEdges()

    for (let i = edges.length - 1; i >= 0; i--) {
      if (edges[i].fromNodeId === id || edges[i].toNodeId === id) {
        this.graph.deleteEdge(edges[i].edgeId as number)
      }
    }
  }
}
