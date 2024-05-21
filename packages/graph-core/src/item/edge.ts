import Base from './base'
import { uniqueId } from '../util/utils'
import { IEdgeModel, INode, IPort } from '../types'
import { BaseCfg, IEdgeCfg } from '../types/type'
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
  fromNodeId = ''
  toNodeId = ''
  constructor(model: IEdgeModel, cfg: IEdgeCfg) {
    super(model)
    this.$store = cfg.store

    if (model.id !== undefined && this.$store.findEdge(model.id)) {
      throw new Error(`can't add edge, exist edge where id is ${model.id}`)
    }

    this.set('cfg', cfg)
    this.set('zIndex', model.zIndex || 0)

    if (!this.id) {
      const id = uniqueId('edge')
      this.set('id', id)
      this.model.id = this.id
    }

    const { source, target } = model
    this.set('source', source || { x: 0, y: 0 })
    this.set('target', target || { x: 0, y: 0 })

    this.setNode()
    this.setPoint()
  }

  public get cfg() {
    return this.get('cfg')
  }

  public get fromNode(): INode | undefined {
    return this.$store.findNode(this.fromNodeId)
  }

  public get toNode(): INode | undefined {
    return this.$store.findNode(this.toNodeId)
  }

  public get source() {
    return this.get('source')
  }

  public get target() {
    return this.get('target')
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

    if (!payload.node) {
      return
    }

    const port =
      payload.node.ports.find(
        item =>
          !item.type ||
          (item.type === type &&
            (!payload.node?.id ||
              (payload.portId && item.id === payload.portId)))
      ) || (payload.node.ports.find(item => item.type === type) as IPort)

    port.setState('linked', { emit: false })

    return port
  }

  private setNode() {
    const { fromPortId, toPortId, fromNodeId, toNodeId } = this.model
    // 如果仅有 portId，自动补全 nodeId
    const fromNode =
      (fromNodeId !== undefined && this.$store.findNode(fromNodeId)) ||
      (fromPortId !== undefined && this.$store.findNodeByPort(fromPortId))
    const toNode =
      (toNodeId !== undefined && this.$store.findNode(toNodeId)) ||
      (toPortId !== undefined && this.$store.findNodeByPort(toPortId))

    if (!fromNode || !toNode) {
      return
    }

    this.fromNodeId = fromNode.id
    this.toNodeId = toNode.id

    // 将边与其对应节点关联
    this.fromNode && this.fromNode.addEdge(this)
    this.toNode && this.toNode.addEdge(this)

    this.fromNode?.on('change', (e, type) => {
      type === 'position' && this.updatePoint()
    })
    this.toNode?.on('change', (e, type) => {
      type === 'position' && this.updatePoint()
    })
  }

  public updatePoint() {
    if (this.fromPort && this.fromNode) {
      this.source.x = this.fromPort.x
      this.source.y = this.fromPort.y
    }
    if (this.toPort && this.toNode) {
      this.target.x = this.toPort.x
      this.target.y = this.toPort.y
    }
  }

  private setPoint() {
    const fromPort = this.matchPort('out')
    if (fromPort && this.fromNode) {
      this._itemMap.fromPort = fromPort
      if (!this.source.x) {
        this.source.x = fromPort.x
      }
      if (!this.source.y) {
        this.source.y = fromPort.y
      }
    }

    const toPort = this.matchPort('in')
    if (toPort && this.toNode) {
      this._itemMap.toPort = toPort
      if (!this.target.x) {
        this.target.x = toPort.x
      }
      if (!this.target.y) {
        this.target.y = toPort.y
      }
    }
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
    this.emit('change', this, 'model')
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
    fromNode && fromNode.deleteEdge(this)
    toNode && toNode.deleteEdge(this)
    // 如果边两端的 port 没有其他边连接，就清除该 port 的 linked 状态
    if (
      fromNode &&
      !fromNode.getEdges().find(item => item.fromPort.id === fromPort.id)
    ) {
      fromPort.clearState('linked')
    }

    if (
      toNode &&
      !toNode.getEdges().find(item => item.toPort.id === toPort.id)
    ) {
      toPort.clearState('linked')
    }

    this.$store.remove(this.id, Edge)

    this.emit('removed', this)
    this.off()
  }
}
