import { IEdgeModel, IEdge } from '../types'
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

    // 渲染
    if (this.graph.get('isRender')) {
      const edgeView = edge.render(this.graph)
      const edgeGroup = this.graph.get('svg').get('edgeGroup')
      edgeGroup.add(edgeView)
    }

    return edge
  }

  public deleteEdge(edge: IEdge) {
    const edges = this.graph.getEdges()
    const index = edges.findIndex(item => item.id === edge.id)
    if (index > -1) {
      edges.splice(index, 1)
    }

    if (this.graph.get('isRender')) {
      const edgeGroup = this.graph.get('svg').get('edgeGroup')
      edgeGroup.remove(edge.get('view'))
    }
  }
}
