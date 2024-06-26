import Base from './base'
import Port from './port'
import { uniqueId } from '../util/utils'
import {
  INodeModel,
  IPort,
  IEdge,
  IPortModel,
  INode,
  IDirection
} from '../types'
import { BaseCfg, INodeCfg, IRect, Item, itemId } from '../types/type'
import Store from '../controller/store'

export default class Node extends Base<
  INodeModel,
  Required<INodeCfg> & BaseCfg
> {
  $store: Store
  constructor(model: INodeModel, cfg: INodeCfg) {
    super(model)
    if (!this.id) {
      const id = uniqueId('node')
      this.set('id', id)
      this.model.id = this.id
    }

    this.set('cfg', cfg)
    this.$store = cfg.store

    this.set('direction', cfg.direction)
    this.set('width', model.width || cfg.width)
    this.set('height', model.height || cfg.height)
    this.set('zIndex', model.zIndex || 0)
    this.set('parentId', model.parentId && String(model.parentId))
    this.set('x', model.x || 0)
    this.set('y', model.y || 0)

    this.addPorts(this.model.ports || [{ type: 'in' }, { type: 'out' }])
  }

  public get cfg() {
    return this.get('cfg')
  }

  public get parentId(): string {
    return this.get('parentId')
  }

  public get x(): number {
    return this.get('x')
  }

  public get y(): number {
    return this.get('y')
  }

  public get width(): number {
    return this.get('width')
  }

  public get height(): number {
    return this.get('height')
  }

  public get bbox(): IRect {
    return {
      x: this.x,
      y: this.y,
      width: this.get('width'),
      height: this.get('height')
    }
  }

  public get ports(): IPort[] {
    return this.$store.node_ports.getMany(this) || []
  }

  public getEdges(): IEdge[] {
    return this.$store.node_edges.getMany(this) || []
  }

  public getInEdges(): IEdge[] {
    return this.getEdges().filter(edge => edge.toNode?.id === this.id)
  }

  public getOutEdges(): IEdge[] {
    return this.getEdges().filter(edge => edge.fromNode?.id === this.id)
  }

  public lock() {
    this.setState('locked')
  }

  public unlock() {
    this.clearState('locaked')
  }

  public show() {
    this.clearState('hide')
    this.getEdges().forEach(edge => {
      edge.clearState('hide')
    })
  }

  public hide() {
    this.setState('hide')
    this.getEdges().forEach(edge => {
      edge.setState('hide')
    })
  }

  public deleteChild(node: INode) {
    if (node) {
      this.$store.node_nodes.remove(node)
    }
  }

  public getChildren(): INode[] {
    return this.$store.node_nodes.getMany(this) || []
  }

  public addChild(node: INode) {
    this.$store.add(node)
    this.$store.node_nodes.add(node, this)
    node.set('parent', this)
  }

  public getParent(): INode {
    return this.get('parent')
  }

  public getSourceNodes(): INode[] {
    const nodes: INode[] = []
    this.getInEdges().forEach(edge => {
      edge.fromNode && nodes.push(edge.fromNode)
    })
    return nodes
  }

  public getTargetNodes() {
    const nodes: INode[] = []
    this.getOutEdges().forEach(edge => {
      edge.toNode && nodes.push(edge.toNode)
    })

    return nodes
  }

  public getAllSourceNodes() {
    const nodes: Record<string, boolean> = { [this.id]: true }
    const tempNodes: INode[] = this.getSourceNodes()

    let i = 0

    while (i < tempNodes.length) {
      const node = tempNodes[i]
      if (nodes[node.id]) {
        break
      }
      nodes[node.id] = true
      tempNodes.push(...tempNodes[i].getSourceNodes())
      i++
    }

    return tempNodes
  }

  public getAllTargetNodes() {
    const nodes: Record<string, boolean> = { [this.id]: true }
    const tempNodes: INode[] = this.getTargetNodes()

    let i = 0

    while (i < tempNodes.length) {
      const node = tempNodes[i]
      if (nodes[node.id]) {
        break
      }
      nodes[node.id] = true
      tempNodes.push(...tempNodes[i].getTargetNodes())
      i++
    }

    return tempNodes
  }

  public addEdge(edge: IEdge) {
    this.$store.add(edge)
    this.$store.node_edges.add(edge, this)
  }

  public deleteEdge(edge: IEdge) {
    this.$store.node_edges.remove(edge)
  }

  public updatePosition(
    x: number,
    y: number,
    options: { emit: boolean } = { emit: true }
  ) {
    // 节点位置更新
    this.set('x', x)
    this.set('y', y)

    if (this.model.x || this.model.y) {
      this.model.x = x
      this.model.y = y
    }

    options.emit && this.emit('change', this, 'position')
  }

  /**
   * 更新节点数据信息
   * @param model
   */
  public update(model: INodeModel) {
    if (model.x || model.y) {
      const x = model.x || this.x
      const y = model.y || this.y
      this.updatePosition(x, y)
    }

    if (model.width || model.height) {
      this.set('width', model.width || this.width)
      this.set('height', model.height || this.height)
      this.model.width = this.width
      this.model.height = this.height
      this.emit('change', this, 'size')
    }

    this.updatePorts()

    this.getEdges().forEach(edge => {
      edge.update()
    })

    this.emit('change', this, 'model')
  }

  /**
   * 刷新自渲染节点视图
   */
  public refresh() {
    const view = this.get('view')
    view.update(this)

    this.getEdges().forEach(edge => {
      edge.refresh()
    })
  }

  public addPorts(models: IPortModel[]) {
    const ports = models.map(model => {
      const port = new Port(model, {
        x: 0,
        y: 0,
        store: this.$store
      })
      this.$store.add(port)
      this.$store.node_ports.add(port, this)

      port.linkNode(this)
      port.on('change', this.onPortChange)
      return port
    })
    this.updatePorts()
    this.emit('port:added', ports)
  }

  public deletePorts(ids: string[]) {
    for (let i = 0; i < ids.length; i++) {
      const portId = ids[i]
      const port = this.$store.findPort(portId)
      if (!port || this.$store.node_ports.getOne(port) !== this) {
        continue
      }
      port.off('change', this.onPortChange)
      port.remove()
      this.$store.node_ports.remove(port)
    }
    this.emit('port:deleted', ids)
  }

  /**
   * 更新节点 port 位置信息
   */
  public updatePorts(dir?: IDirection) {
    if (dir) {
      this.set('direction', dir)
    }
    const posList = Port.computePositions(
      this.ports,
      this.bbox,
      this.get('direction')
    )
    this.ports.forEach((item, index) => {
      const pos = posList[index]
      item.update(pos.x, pos.y)
    })
  }

  private onPortChange = (port: IPort, type: string) => {
    this.emit('port:change', port, type)
  }

  /**
   *  删除关联Item => 移出store => 抛出事件 => 删除视图 => 卸载事件
   */
  remove() {
    const items: Item[] = this.getEdges()
    items.forEach(item => item.remove())

    this.$store.remove(this.id, Node)
    this.$store.node_ports.remove(this)
    this.$store.node_edges.remove(this)
    this.$store.node_nodes.remove(this)

    this.emit('removed', this)
    this.off()
  }
}
