import { IEdgeModel, IEdge } from '../types'
import Edge from '../item/edge'
import { getGraph, store } from '../item/store'
import { IEdgeCfg } from '../types/type'

export default class EdgeController {
  constructor(readonly graphId: string) {
    if (getGraph(this.graphId).cfg.edges) {
      this.data(getGraph(this.graphId).cfg.edges)
    }
  }

  get edgeMap() {
    return store[this.graphId].edges
  }

  get edges() {
    return Object.values(this.edgeMap)
  }

  public findEdge(id: string | number): IEdge | undefined {
    return this.edgeMap[String(id)]
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
    const { fromNode, toNode, fromPort, toPort } = edge
    edge.fromNode.deleteEdge(id)
    edge.toNode.deleteEdge(id)

    // 如果边两端的 port 没有其他边连接，就清除该 port 的 linked 状态
    if (!fromNode.getEdges().find(item => item.fromPort.id === fromPort.id)) {
      fromPort.clearState('linked')
    }

    if (!toNode.getEdges().find(item => item.toPort.id === toPort.id)) {
      toPort.clearState('linked')
    }

    delete this.edgeMap[id]

    if (getGraph(this.graphId).get('isRender')) {
      const edgeGroup = getGraph(this.graphId).get('svg').get('edgeGroup')
      edgeGroup.remove(edge.view)
    }
    return edge
  }

  public addEdge(item: IEdgeModel): Edge | undefined {
    try {
      const edgeCfg: IEdgeCfg = {
        ...getGraph(this.graphId).get('edgeInfo'),
        graphId: this.graphId
      }
      const edge = new Edge(item, edgeCfg)
      this.edgeMap[edge.id] = edge

      this.watchEdgeChange(edge)

      // 渲染
      if (getGraph(this.graphId).get('isRender')) {
        const edgeView = edge.render(getGraph(this.graphId))
        const edgeGroup = getGraph(this.graphId).get('svg').get('edgeGroup')
        edgeGroup.add(edgeView)
      }

      return edge
    } catch (error) {
      console.warn(error)
    }
  }

  watchEdgeChange(edge: IEdge) {
    edge.on('change', (edge: IEdge, type: string) => {
      getGraph(this.graphId).emit(`edge:change:${type}`, edge)
      getGraph(this.graphId).emit('edge:change', edge, type)
    })
  }

  public data(group: IEdgeModel[]) {
    for (const item of group) {
      this.addEdge(item)
    }
  }

  public destroy() {}
}
