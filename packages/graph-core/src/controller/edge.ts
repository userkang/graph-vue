import Graph from '../controller/graph'

export default class EdgeController {
  graph: Graph

  // 当前被选中的边
  select: IEdgeType[] = []

  constructor(graph: Graph) {
    this.graph = graph
  }

  public addEdge(item: IEdgeType) {
    // 生成唯一edgeId
    item.edgeId = JSON.stringify(item.fromNodeId + '' + item.toNodeId)
    this.graph.edges.push(item)
  }

  public deleteEdge(id: number) {
    const edges = this.graph.edges
    edges.splice(
      edges.findIndex(item => item.edgeId === id),
      1
    )
  }
}
