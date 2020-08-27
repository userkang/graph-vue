import Graph from './graph'

export default class EdgeController {
  graph: Graph

  constructor(graph: Graph) {
    this.graph = graph
  }

  public createEdge = {
    show: false,
    fromX: 0,
    fromY: 0,
    toX: 0,
    toY: 0
  }

  public addEdge(item: IEdgeType) {
    // 生成唯一edgeId
    item.edgeId = JSON.stringify(item.fromNodeId + '' + item.toNodeId)
    this.graph.edges.push(item)
    this.graph.immutableController.addEdge()
  }

  public setNewEdgeStart(fromX: number, fromY: number) {
    this.createEdge = {
      ...this.createEdge,
      fromX,
      fromY,
      show: true
    }
  }

  public setNewEdgeMove(toX: number, toY: number) {
    this.createEdge = {
      ...this.createEdge,
      toX,
      toY
    }
  }

  public setResetEdge() {
    this.createEdge = {
      show: false,
      fromX: 0,
      fromY: 0,
      toX: 0,
      toY: 0
    }
  }

  public deleteEdge(id: number) {
    const edges = this.graph.edges
    edges.splice(
      edges.findIndex(item => item.edgeId === id),
      1
    )
  }
}
