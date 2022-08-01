import Base from './base'
import { uniqueId } from '../util/utils'
import { IEdgeModel, INode, IPort } from '../types'
import edgeView from '../view/edge'
import Graph from '../controller/graph'
import { BaseCfg, IEdgeCfg } from '../types/type'

interface ItemMap {
  fromNode: INode
  toNode: INode
  fromPort: IPort
  toPort: IPort
}

export default class Edge extends Base<
  IEdgeModel,
  Required<IEdgeCfg> & BaseCfg
> {
  private readonly _itemMap: ItemMap = {} as ItemMap
  constructor(
    model: IEdgeModel,
    cfg: IEdgeCfg | undefined,
    fromNode: INode,
    toNode: INode
  ) {
    super(model)
    if (!this.id) {
      const id = uniqueId('edge')
      this.set('id', id)
      this.model.id = this.id
    }

    this.set('cfg', cfg)

    this._itemMap.fromNode = fromNode
    this._itemMap.toNode = toNode

    this.setPoint()

    // 将边与其对应节点关联
    this.fromNode.addEdge(this)
    this.toNode.addEdge(this)
  }

  public get cfg() {
    return this.get('cfg')
  }

  public get fromNode(): INode {
    return this._itemMap.fromNode
  }

  public get toNode(): INode {
    return this._itemMap.toNode
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
