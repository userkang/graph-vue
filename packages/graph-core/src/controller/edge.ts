import Graph from '../controller/graph'
import Edge from '../item/edge'

export default class EdgeController {
  graph: Graph

  constructor(graph: Graph) {
    this.graph = graph
  }

  public addEdge(item: IEdgeModel) {
    const fromNode = this.graph.findNode(item.fromNodeId)
    const toNode = this.graph.findNode(item.toNodeId)
    const edge = new Edge(item, fromNode, toNode)
    this.graph.getEdges().push(edge)
  }

  public deleteEdge(id: string) {
    const edges = this.graph.getEdges()
    edges.splice(
      edges.findIndex(item => item.edgeId === id),
      1
    )
  }
}
