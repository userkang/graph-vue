import Base from './base'
import { uniqueId } from '../util/utils'
import { IEdgeModel, INode, IPort } from '../types'
import edgeView from '../view/edge'
import Graph from '../controller/graph'
import { BaseCfg, IEdgeCfg, ManyToOneEvent } from '../types/type'

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
    this.$graph = cfg.graph

    if (model.id !== undefined && this.$graph.store.findEdge(model.id)) {
      throw new Error(`can't add edge, exist edge where id is ${model.id}`)
    }
    const { fromPortId, toPortId, fromNodeId, toNodeId } = model
    // 如果仅有 portId，自动补全 nodeId
    const fromNode =
      (fromNodeId !== undefined && this.$graph.store.findNode(fromNodeId)) ||
      (fromPortId !== undefined && this.$graph.store.findNodeByPort(fromPortId))
    const toNode =
      (toNodeId !== undefined && this.$graph.store.findNode(toNodeId)) ||
      (toPortId !== undefined && this.$graph.store.findNodeByPort(toPortId))

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
    this.$graph.store.fromPort_edges.on(
      'change',
      (e: ManyToOneEvent<Edge, IPort>) => {
        if (e.many !== this) {
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
    return this.$graph.store.findNode(this.fromNodeId) as INode
  }

  public get toNode(): INode {
    return this.$graph.store.findNode(this.toNodeId) as INode
  }

  public get fromPort() {
    // return this.$graph.store.fromPort_edges.find(this) as IPort
    return this._itemMap.fromPort
  }

  public get toPort() {
    // return this.$graph.store.toPort_edges.find(this) as IPort
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
    this.$graph.store.fromPort_edges.add(this, fromPort)

    const toPort = this.matchPort('in')
    toPort.setState('linked')
    this._itemMap.toPort = toPort
    this.$graph.store.toPort_edges.add(this, toPort)
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

  unMount() {
    const graph = this.$graph
    if (graph.isRender) {
      const group = graph.$svg?.get('edgeGroup')
      group.remove(this.view)
    }
  }
  /**
   *  关闭事件 => 删除关联Item => 移出store => 删除视图 => 抛出事件
   */
  remove() {
    this.off()
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

    this.$graph.store.remove(this.id, Edge)

    this.unMount()

    this.emit('removed', this)
  }
}
