import { IEdgeModel, IEdge } from '../types'
import Graph from '../controller/graph'
import Edge from '../item/edge'
export default class EdgeController {
  graph: Graph

  constructor(graph: Graph) {
    this.graph = graph
  }

  public addEdge(item: IEdgeModel) {
    let fromNodeId = item.fromNodeId
    let toNodeId = item.toNodeId
    // 如果仅有 slotId，自动补全 nodeId
    if (item.fromSlotId && !fromNodeId) {
      fromNodeId = this.graph.findSlot(item.fromSlotId).nodeId
    }
    if (item.toSlotId && !toNodeId) {
      toNodeId = this.graph.findSlot(item.toSlotId).nodeId
    }

    const fromNode = this.graph.findNode(fromNodeId)
    const toNode = this.graph.findNode(toNodeId)
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
