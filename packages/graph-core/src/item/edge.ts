import Base from './base'
import { uniqueId } from '../util/utils'
import { IEdgeModel, INode, IPort } from '../types'
import { BaseCfg, IEdgeCfg, ManyToOneEvent } from '../types/type'
import Store from '../controller/store'

interface ItemMap {
  fromPort: IPort
  toPort: IPort
}

export default class Edge extends Base<
  IEdgeModel,
  Required<IEdgeCfg> & BaseCfg
> {
  private readonly _itemMap: ItemMap = {} as ItemMap
  $store: Store
  fromNodeId: string
  toNodeId: string
  constructor(model: IEdgeModel, cfg: IEdgeCfg) {
    super(model)
    this.$store = cfg.store

    if (model.id !== undefined && this.$store.findEdge(model.id)) {
      throw new Error(`can't add edge, exist edge where id is ${model.id}`)
    }
    const { fromPortId, toPortId, fromNodeId, toNodeId } = model
    // 如果仅有 portId，自动补全 nodeId
    const fromNode =
      (fromNodeId !== undefined && this.$store.findNode(fromNodeId)) ||
      (fromPortId !== undefined && this.$store.findNodeByPort(fromPortId))
    const toNode =
      (toNodeId !== undefined && this.$store.findNode(toNodeId)) ||
      (toPortId !== undefined && this.$store.findNodeByPort(toPortId))

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
    this.$store.fromPort_edges.on(
      'change',
      (e: ManyToOneEvent<Edge, IPort>) => {
        if (e.member !== this) {
          return
        }
        this.emit('change', this)
      }
    )
  }

  public get cfg() {
    return this.get('cfg')
  }

  public get fromNode(): INode {
    return this.$store.findNode(this.fromNodeId) as INode
  }

  public get toNode(): INode {
    return this.$store.findNode(this.toNodeId) as INode
  }

  public get fromPort() {
    // return   this.$store.fromPort_edges.find(this) as IPort
    return this._itemMap.fromPort
  }

  public get toPort() {
    // return   this.$store.toPort_edges.find(this) as IPort
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
    this.$store.fromPort_edges.addMember(this, fromPort)

    const toPort = this.matchPort('in')
    toPort.setState('linked')
    this._itemMap.toPort = toPort
    this.$store.toPort_edges.addMember(this, toPort)
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

  /**
   *  删除关联Item => 移出store => 抛出事件 => 删除视图 => 卸载事件
   */
  remove() {
    const { fromNode, toNode, fromPort, toPort } = this
    fromNode.deleteEdge(this.id)
    toNode.deleteEdge(this.id)
    // 如果边两端的 port 没有其他边连接，就清除该 port 的 linked 状态
    if (!fromNode.getEdges().find(item => item.fromPort.id === fromPort.id)) {
      fromPort.clearState('linked')
    }

    if (!toNode.getEdges().find(item => item.toPort.id === toPort.id)) {
      toPort.clearState('linked')
    }

    this.$store.remove(this.id, Edge)

    this.emit('removed', this)
    this.off()
  }
}
