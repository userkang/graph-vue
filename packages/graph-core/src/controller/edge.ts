import { IEdgeModel, IEdge } from '../types'
import Graph from '../controller/graph'
import Edge from '../item/edge'
export default class EdgeController {
  graph: Graph
  edges: Edge[] = []

  constructor(graph: Graph) {
    this.graph = graph
    this.edges = graph.cfg.edges
  }

  public data(group: IEdgeModel[]) {
    this.edges = []
    for (const item of group) {
      this.addEdge(item)
    }
  }

  public findEdge(id: string | number): IEdge | null {
    const _id = String(id)
    return this.edges.find(item => item.id === _id)
  }

  public updateEdge(id: string, model: IEdgeModel): Edge | false {
    const edge = this.findEdge(id)
    if (!edge) {
      return false
    } else {
      edge.update(model)
      return edge
    }
  }

  public deleteEdge(id: string): Edge | false {
    const edge = this.findEdge(id)
    if (!edge) {
      return false
    }
    const edges = this.edges
    const index = edges.findIndex(item => item.id === edge.id)
    if (index === -1) {
      return false
    }
    // 先删除前后节点的相关边
    edge.fromNode.deleteEdge(id)
    edge.toNode.deleteEdge(id)

    // 如果边两端的 slot 没有其他边连接，就清除该 slot 的 linked 状态
    const hasFromSlotLinked = edge.fromNode.edges.find(
      item => item.fromSlot.id === edge.fromSlot.id
    )
    const hasToSlotLinked = edge.toNode.edges.find(
      item => item.toSlot.id === edge.toSlot.id
    )

    if (!hasFromSlotLinked) {
      edge.fromSlot.clearState('linked')
    }

    if (!hasToSlotLinked) {
      edge.toSlot.clearState('linked')
    }

    edges.splice(index, 1)

    if (this.graph.get('isRender')) {
      const edgeGroup = this.graph.get('svg').get('edgeGroup')
      edgeGroup.remove(edge.get('view'))
    }
    return edge
  }

  public addEdge(item: IEdgeModel): Edge | false {
    if (this.findEdge(item.id)) {
      return false
    }
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

    if (!fromNode || !toNode) {
      console.warn(`please check the edge from ${fromNodeId} to ${toNodeId}`)
      return
    }

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
}
