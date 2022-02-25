import { IEdgeModel, IEdge } from '../types'
import Graph from '../controller/graph'
import Edge from '../item/edge'
export default class EdgeController {
  graph: Graph
  private _edges: { [id: string]: IEdge } = {}

  constructor(graph: Graph) {
    this.graph = graph
    if (graph.cfg.edges) {
      this.data(graph.cfg.edges)
    }
  }

  get edges() {
    return Object.values(this._edges)
  }

  public findEdge(id: string | number): IEdge | undefined {
    return this._edges[String(id)]
  }

  public updateEdge(id: string, model: IEdgeModel): void {
    const edge = this.findEdge(id)
    if (!edge) {
      return console.warn(`can't update edge where id is '${id}'`)
    }
    edge.update(model)
  }

  public deleteEdge(id: string): IEdge | undefined {
    const edge = this.findEdge(id)
    if (!edge) {
      console.warn(`can't delete edge where id is '${id}'`)
      return
    }
    // 先删除前后节点的相关边
    const { fromNode, toNode, fromSlot, toSlot } = edge
    edge.fromNode.deleteEdge(id)
    edge.toNode.deleteEdge(id)

    // 如果边两端的 slot 没有其他边连接，就清除该 slot 的 linked 状态
    if (!fromNode.getEdges().find(item => item.fromSlot.id === fromSlot.id)) {
      fromSlot.clearState('linked')
    }

    if (!toNode.getEdges().find(item => item.toSlot.id === toSlot.id)) {
      toSlot.clearState('linked')
    }

    delete this._edges[id]
    if (this.graph.get('isRender')) {
      const edgeGroup = this.graph.get('svg').get('edgeGroup')
      edgeGroup.remove(edge.get('view'))
    }
    return edge
  }

  public addEdge(item: IEdgeModel): Edge | undefined {
    if (item.id && this._edges[item.id]) {
      console.warn(`can't add edge, exist edge where id is ${item.id}`)
      return
    }
    const { fromSlotId, toSlotId, fromNodeId, toNodeId } = item
    // 如果仅有 slotId，自动补全 nodeId
    const fromNode =
      (fromNodeId && this.graph.findNode(fromNodeId)) ||
      (fromSlotId && this.graph.findNodeBySlot(fromSlotId))
    const toNode =
      (toNodeId && this.graph.findNode(toNodeId)) ||
      (toSlotId && this.graph.findNodeBySlot(toSlotId))

    if (!fromNode || !toNode) {
      console.warn(`please check the edge from ${fromNodeId} to ${toNodeId}`)
      return
    }

    const edgeCfg = this.graph.get('edgeInfo')
    const edge = new Edge(item, edgeCfg, fromNode, toNode)
    this._edges[edge.id] = edge

    // 渲染
    if (this.graph.get('isRender')) {
      const edgeView = edge.render(this.graph)
      const edgeGroup = this.graph.get('svg').get('edgeGroup')
      edgeGroup.add(edgeView)
    }

    return edge
  }

  public data(group: IEdgeModel[]) {
    this._edges = {}
    for (const item of group) {
      this.addEdge(item)
    }
  }

  public destroy() {
    ;(this.graph as null | Graph) = null
    this._edges = {}
  }
}
