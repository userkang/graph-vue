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
import nodeView from '../view/node'
import Graph from '../controller/graph'
import { BaseCfg, INodeCfg, IRect, Item, itemId } from '../types/type'

export default class Node extends Base<
  INodeModel,
  Required<INodeCfg> & BaseCfg
> {
  readonly nodeIdSet = new Set<itemId>()
  readonly edgeIdSet = new Set<itemId>()
  readonly portIdSet = new Set<itemId>()
  constructor(model: INodeModel, cfg: INodeCfg) {
    super(model)
    if (!this.id) {
      const id = uniqueId('node')
      this.set('id', id)
      this.model.id = this.id
    }

    this.set('cfg', cfg)
    this.$graph = cfg.graph

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
    const portMap = this.$graph.store.getPortMap()
    return Array.from(this.portIdSet).map(itemId => portMap[itemId])
  }

  public getEdges(): IEdge[] {
    const edgeMap = this.$graph.store.getEdgeMap()
    return Array.from(this.edgeIdSet).map(itemId => edgeMap[itemId])
  }

  public getInEdges(): IEdge[] {
    return this.getEdges().filter(edge => edge.toNode.id === this.id)
  }

  public getOutEdges(): IEdge[] {
    return this.getEdges().filter(edge => edge.fromNode.id === this.id)
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

  public deleteChild(id: string) {
    const childNodes = this.getChildren()
    const index = childNodes.findIndex(item => item.id === id)
    if (index > -1) {
      this.getChildren().splice(index, 1)
    }
  }

  public getChildren(): INode[] {
    const nodeMap = this.$graph.store.getNodeMap()
    return Array.from(this.nodeIdSet).map(itemId => nodeMap[itemId])
  }

  public addChild(node: INode) {
    this.$graph.store.insertItem(node)
    this.nodeIdSet.add(node.id)
    node.set('parent', this)
  }

  public getParent(): INode {
    return this.get('parent')
  }

  public getSourceNodes(): INode[] {
    const nodes: INode[] = []
    this.getInEdges().forEach(edge => {
      nodes.push(edge.fromNode)
    })
    return nodes
  }

  public getTargetNodes() {
    const nodes: INode[] = []
    this.getOutEdges().forEach(edge => {
      nodes.push(edge.toNode)
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
    this.$graph.store.insertItem(edge)
    this.edgeIdSet.add(edge.id)
  }

  public deleteEdge(id: string) {
    this.edgeIdSet.delete(id)
  }

  public updatePosition(x: number, y: number) {
    // 记录移动距离
    const moveX = x - this.x
    const moveY = y - this.y
    // 节点位置更新
    this.set('x', x)
    this.set('y', y)

    if (this.model.x || this.model.y) {
      this.model.x = x
      this.model.y = y
    }

    this.emit('change', this, 'position', { moveX, moveY })
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

    Object.assign(this.model, model)

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
        graph: this.$graph
      })
      this.portIdSet.add(port.id)
      this.$graph.store.insertItem(port)

      port.setupNode(this)
      port.on('change', this.onPortChange)
      return port
    })
    this.updatePorts()
    this.emit('port:added', ports)
  }

  public deletePorts(ids: string[]) {
    for (let i = 0; i < ids.length; i++) {
      const portId = ids[i]
      if (!this.portIdSet.has(portId)) {
        continue
      }
      const port = this.$graph.store.findPort(portId)
      port?.off('change', this.onPortChange)
      port?.remove()
      this.portIdSet.delete(portId)
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
   * 节点自渲染
   * @param graph
   */
  public render(graph: Graph) {
    const view = new nodeView(this, graph)
    this.set('view', view)
    return view
  }

  mount() {
    const graph = this.$graph
    if (graph?.isRender) {
      const nodeView = this.render(graph)
      const nodeGroup = graph.$svg?.get('nodeGroup')
      nodeGroup.add(nodeView)
    }
  }

  unMount() {
    const graph = this.$graph
    if (graph?.isRender) {
      const group = graph.$svg?.get('nodeGroup')
      group.remove(this.view)
    }
  }
  /**
   *  关闭事件 => 删除关联Item => 移出store => 删除视图 => 抛出事件
   */
  remove() {
    this.off()
    const items: Item[] = this.getEdges()
    items.forEach(item => item.remove())

    this.$graph.store.deleteItem(this.id, Node)

    this.unMount()

    this.emit('removed', this)
  }
}
