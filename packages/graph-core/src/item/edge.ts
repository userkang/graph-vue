import Base from './base'
import { uniqueId } from '../util/utils'
import { IEdgeModel, INode, IPort } from '../types'
import edgeView from '../view/edge'
import Graph from '../controller/graph'
import { BaseCfg, IEdgeCfg } from '../types/type'
import { getGraph, store } from './store'

interface ItemMap {
  fromPort: IPort
  toPort: IPort
}

export default class Edge extends Base<
  IEdgeModel,
  Required<IEdgeCfg> & BaseCfg
> {
  private readonly _itemMap: ItemMap = {} as ItemMap
  fromNodeId: string
  toNodeId: string
  constructor(model: IEdgeModel, cfg: IEdgeCfg) {
    super(model)
    this.graphId = cfg.graphId

    if (model.id !== undefined && store[this.graphId].itemMap[model.id]) {
      throw new Error(`can't add edge, exist edge where id is ${model.id}`)
    }
    const { fromPortId, toPortId, fromNodeId, toNodeId } = model
    // 如果仅有 portId，自动补全 nodeId
    const fromNode =
      (fromNodeId !== undefined &&
        getGraph(this.graphId).findNode(fromNodeId)) ||
      (fromPortId !== undefined &&
        getGraph(this.graphId).findNodeByPort(fromPortId))
    const toNode =
      (toNodeId !== undefined && getGraph(this.graphId).findNode(toNodeId)) ||
      (toPortId !== undefined &&
        getGraph(this.graphId).findNodeByPort(toPortId))

    if (!fromNode || !toNode) {
      throw new Error(`please check the edge from ${fromNodeId} to ${toNodeId}`)
    }

    if (!this.id) {
      const id = uniqueId('edge')
      this.set('id', id)
      this.model.id = this.id
    }

    this.set('cfg', cfg)

    this.fromNodeId = fromNode.id
    this.toNodeId = toNode.id

    this.setPoint()

    // 将边与其对应节点关联
    this.fromNode.addEdge(this)
    this.toNode.addEdge(this)
  }

  public get cfg() {
    return this.get('cfg')
  }

  public get fromNode(): INode {
    return store[this.graphId].itemMap[this.fromNodeId] as INode
  }

  public get toNode(): INode {
    return store[this.graphId].itemMap[this.toNodeId] as INode
  }

  public get fromPort() {
    return this._itemMap.fromPort
  }

  public get toPort() {
    return this._itemMap.toPort
  }

  private matchPort(type: 'in' | 'out') {
    const payload =
      type === 'out'
        ? { portId: String(this.model.fromPortId), node: this.fromNode }
        : { portId: String(this.model.toPortId), node: this.toNode }

    const port =
      payload.node.ports.find(
        item =>
          !item.type ||
          (item.type === type &&
            (!payload.node.id ||
              (payload.portId && item.id === payload.portId)))
      ) || (payload.node.ports.find(item => item.type === type) as IPort)
    return port
  }

  public setPoint() {
    const fromPort = this.matchPort('out')
    fromPort.setState('linked')
    this._itemMap.fromPort = fromPort

    const toPort = this.matchPort('in')
    toPort.setState('linked')
    this._itemMap.toPort = toPort
  }

  public update(model?: IEdgeModel) {
    if (model) {
      // 不允许更新边的起始和目标节点
      delete model.fromNodeId
      delete model.toNodeId
      delete model.fromPortId
      delete model.toPortId
      Object.assign(this.model, model)
    }
    this.setPoint()
  }

  public refresh() {
    const view = this.get('view')
    view.update()
  }

  public render(graph: Graph) {
    const view = new edgeView(this, graph)
    this.set('view', view)
    return view
  }
}
