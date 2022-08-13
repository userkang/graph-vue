import Node from '../item/node'
import Edge from '../item/edge'
import {
  INode,
  INodeModel,
  IPort,
  IEdgeModel,
  IEdge,
  IDataModel
} from '../types'
import { INodeCfg, IEdgeCfg, Item, itemId, itemClass } from '../types/type'
import Graph, { useGraph } from './graph'
import Port from '../item/port'
import EventEmitter from '../util/event-emitter'
import Store from './store'
import { isIDataModel, preorder } from '../util/utils'

const NODE_DEFAULT_CFG = {
  width: 180,
  height: 40
} as const

export default class ItemController extends EventEmitter {
  private $graph: Graph
  private $store: Store
  constructor() {
    super()
    this.$graph = useGraph()
    this.$store = useGraph().store
    const graph = this.$graph
    if (graph.cfg.nodes) {
      this.loadNodes(graph.cfg.nodes)
    }
    if (graph.cfg.edges) {
      this.loadEdges(graph.cfg.edges)
    }
  }

  get nodeMap(): Record<string, Node> {
    return this.$store.getItemMap(Node)
  }

  get nodes() {
    return Object.values(this.nodeMap).sort(
      (a, b) => (a.zIndex || 0) - (b.zIndex || 0)
    )
  }

  get edgeMap() {
    return this.$store.getItemMap(Edge)
  }

  get edges() {
    return this.$store.getEdges()
  }

  get getEdges() {
    return this.$store.getEdges.bind(this.$store)
  }

  get portsMap() {
    return this.$store.getItemMap(Port)
  }

  get getDataModel() {
    return this.$store.getDataModel.bind(this.$store)
  }

  get getTreeDataModel() {
    return this.$store.getTreeDataModel.bind(this.$store)
  }

  get findBy() {
    return this.$store.findBy.bind(this.$store)
  }

  get where() {
    return this.$store.where.bind(this.$store)
  }

  get findItem() {
    return this.$store.find.bind(this.$store)
  }

  get findNode() {
    return this.$store.findNode.bind(this.$store)
  }

  get findPort() {
    return this.$store.findPort.bind(this.$store)
  }

  get findNodeByState() {
    return this.$store.findNodeByState.bind(this.$store)
  }

  get findNodeByPort() {
    return this.$store.findNodeByPort.bind(this.$store)
  }

  getNodes() {
    return Object.values(this.nodeMap).sort(
      (a, b) => (a.zIndex || 0) - (b.zIndex || 0)
    )
  }

  public refreshNode(id: string): void {
    const node = this.findNode(id)
    if (!node) {
      return console.warn(`can't refresh node where id is '${id}'`)
    }
    node.refresh()
    this.emit('node:refresh', node)
  }

  public updateNode(id: string, model: INodeModel): void {
    const node = this.findNode(id)
    if (!node) {
      return console.warn(`can't update node where id is '${id}'`)
    }
    node.update(model)
    this.emit('node:change', node)
  }

  public addNode(item: INodeModel): INode | undefined {
    if (item.id !== undefined && this.nodeMap[item.id]) {
      console.warn(`can't add node, exist node where id is '${item.id}'`)
      return
    }
    const graph = this.$graph

    const defaultNode = graph.get('defaultNode') || {}
    const model = Object.assign({}, defaultNode, item)
    const direction = graph.direction
    const nodeCfg: INodeCfg = {
      ...NODE_DEFAULT_CFG,
      ...graph.get('nodeInfo'),
      direction,
      graph: this.$graph
    }
    const node = new Node(model, nodeCfg)
    this.$store.insertItem(node)

    const onNodeChange = (node: INode, type: string) => {
      const eventType = 'node:change'
      this.$graph.emit(`${eventType}:${type}`, node)
      this.$graph.emit(eventType, node, type)
    }

    const onPortChange = (port: IPort, type: string) => {
      const eventType = 'port:change'
      this.$graph.emit(`${eventType}:${type}`, port)
      this.$graph.emit(eventType, port, type)
    }

    const onPortAdded = (ports: IPort[]) => {
      const eventType = 'port:added'
      this.$graph.emit(eventType, ports)
    }

    const onPortDeleted = (ids: string[]) =>
      this.$graph.emit('port:deleted', ids)

    node.on('change', onNodeChange)
    node.on('port:change', onPortChange)
    node.on('port:added', onPortAdded)
    node.on('port:deleted', onPortDeleted)

    // 渲染
    node.mount()
    this.emit('node:added', item)

    return node
  }

  public findEdge(id: string | number): IEdge | undefined {
    return this.edgeMap[String(id)]
  }

  public findEdgeByState(state: string): IEdge[] {
    return this.getEdges().filter(item => item.hasState(state))
  }

  public updateEdge(id: string, model: IEdgeModel): void {
    const edge = this.findEdge(id)
    if (!edge) {
      return console.warn(`can't update edge where id is '${id}'`)
    }
    edge.update(model)
    this.emit('edge:change', edge)
  }

  deleteItem(id: itemId): Item | undefined
  deleteItem<T extends Item>(id: itemId, itemClass: itemClass<T>): T | undefined
  deleteItem<T extends Item>(
    id: itemId,
    itemClass?: itemClass<T>
  ): T | undefined {
    const item = this.$store.find(id, itemClass)
    if (!item) {
      console.warn(
        `can't delete ${itemClass?.name || 'item'} where id is '${id}'`
      )
      return
    }
    item.remove()

    return item
  }

  public deleteNode(id: itemId) {
    const item = this.deleteItem(id, Node)
    item && this.emit('node:deleted', item.model)
    return item
  }

  public deleteEdge(id: itemId) {
    const item = this.deleteItem(id, Edge)
    item && this.emit('edge:deleted', item.model)
    return item
  }

  public addEdge(item: IEdgeModel): Edge | undefined {
    try {
      const graph = this.$graph
      const edgeCfg: IEdgeCfg = {
        ...graph.get('edgeInfo'),
        graph: this.$graph
      }
      const edge = new Edge(item, edgeCfg)
      this.edgeMap[edge.id] = edge
      this.$store.insertItem(edge)

      edge.on('change', (edge: IEdge, type: string) => {
        this.$graph.emit(`edge:change:${type}`, edge)
        this.$graph.emit('edge:change', edge, type)
      })

      // 渲染
      if (graph.isRender) {
        const edgeView = edge.render(graph)
        const edgeGroup = graph.$svg?.get('edgeGroup')
        edgeGroup.add(edgeView)
      }
      this.emit('edge:added', item)
      return edge
    } catch (error) {
      console.warn(error)
    }
  }

  public loadNodes(models: INodeModel[]) {
    models
      .map(model => this.addNode(model))
      .forEach(node => {
        if (!node) {
          return
        }
        node.zIndex = 1
        const parent = this.findNode(node.model.parentId)
        if (!parent) {
          return
        }
        parent.addChild(node)
      })
  }

  public loadEdges(group: IEdgeModel[]) {
    for (const item of group) {
      this.addEdge(item)
    }
  }

  clearItem() {
    this.$store.getNodes().forEach(node => {
      node.remove()
    })
  }

  public data(data: IDataModel | INodeModel) {
    if (Object.keys(data).length === 0) {
      return
    }

    this.clearItem()

    const model: IDataModel = isIDataModel(data) ? data : preorder(data)
    const needLayout = model.nodes.every(
      node => !Number.isFinite(node.x) && !Number.isFinite(node.y)
    )

    this.loadNodes(model.nodes)
    this.loadEdges(model.edges)
    this.emit('datachange', { needLayout: needLayout })
  }

  public destroy() {
    this.clearItem()
  }
}
