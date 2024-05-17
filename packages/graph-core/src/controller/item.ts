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
import {
  INodeCfg,
  IEdgeCfg,
  Item,
  itemId,
  itemClass,
  valuesType
} from '../types/type'
import Graph, { useGraph } from './graph'
import EventEmitter from '../util/event-emitter'
import Store from './store'
import { isIDataModel, preorder } from '../util/utils'

const NODE_DEFAULT_CFG = {
  width: 180,
  height: 40
} as const

const EVENT_TYPES = [
  'node:refresh',
  'node:change',
  'node:deleted',
  'node:added',
  'edge:deleted',
  'edge:change',
  'edge:added',
  'port:change',
  'port:added',
  'port:deleted',
  'datachange'
] as const

export default class ItemController extends EventEmitter<
  valuesType<typeof EVENT_TYPES>,
  false
> {
  private readonly $graph: Graph
  private readonly $store: Store
  dataing = false
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

  get getEdges() {
    return this.$store.getEdges
  }

  get getDataModel() {
    return this.$store.getDataModel
  }

  get getTreeDataModel() {
    return this.$store.getTreeDataModel
  }

  get findEdge() {
    return this.$store.findEdge
  }

  get findNode() {
    return this.$store.findNode
  }

  get findPort() {
    return this.$store.findPort
  }

  get findEdgeByState() {
    return this.$store.findEdgeByState
  }

  get findNodeByPort() {
    return this.$store.findNodeByPort
  }

  private remove(id: itemId): Item | undefined
  private remove<T extends Item>(
    id: itemId,
    itemClass: itemClass<T>
  ): T | undefined
  private remove<T extends Item>(
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

  private initNodesZIndex() {
    const parents = this.getNodes().filter(node => !node.model.parentId)

    while (parents.length) {
      const parent = parents[0]
      const children = parent.getChildren()
      if (children?.length) {
        children.forEach(child => child.setZIndex(parent.zIndex + 1))
        parents.push(...children)
      }
      parents.splice(0, 1)
    }
  }

  private loadNodes(models: INodeModel[]) {
    models.map(model => this.addNode(model))
    const nodes = this.getNodes()
    nodes.forEach(node => {
      const parent = this.findNode(node.model.parentId)
      if (parent) {
        parent.addChild(node)
      }
    })
    this.initNodesZIndex()
  }

  private loadEdges(group: IEdgeModel[]) {
    group.forEach(model => this.addEdge(model))
  }

  private clear() {
    this.$store.reset()
  }

  getNodes() {
    return this.$store.getNodes()
  }

  refreshNode(id: string): void {
    const node = this.findNode(id)
    if (!node) {
      return console.warn(`can't refresh node where id is '${id}'`)
    }
    node.refresh()
    this.emit('node:refresh', node)
  }

  updateNode(id: string, model: INodeModel): void {
    const node = this.findNode(id)
    if (!node) {
      return console.warn(`can't update node where id is '${id}'`)
    }
    node.update(model)
  }

  addNode = (item: INodeModel): INode | undefined => {
    if (item.id !== undefined && this.$store.findNode(item.id)) {
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
      store: this.$store
    }
    const node = new Node(model, nodeCfg)
    this.$store.add(node)

    // 判断是否有 parentId
    if (model.parentId) {
      const parentNode = graph.findNode(model.parentId)
      parentNode && parentNode.addChild(node)
    }

    node.on('change', (node: INode, type: string) =>
      this.emit('node:change', node, type)
    )
    node.on('port:change', (port: IPort, type: string) => {
      this.emit('port:change', port, type)
    })
    node.on('port:added', (ports: IPort[]) => this.emit('port:added', ports))
    node.on('port:deleted', (ids: string[]) => this.emit('port:deleted', ids))

    !this.dataing && this.emit('node:added', node)

    return node
  }

  findNodeByState(state: string) {
    return this.getNodes().filter(item => item.hasState(state))
  }

  updateEdge(id: string, model: IEdgeModel): void {
    const edge = this.findEdge(id)
    if (!edge) {
      return console.warn(`can't update edge where id is '${id}'`)
    }
    edge.update(model)
  }

  deleteNode = (id: itemId) => {
    const item = this.remove(id, Node)
    item && this.emit('node:deleted', item)
    return item
  }

  deleteEdge = (id: itemId) => {
    const item = this.remove(id, Edge)
    item && this.emit('edge:deleted', item)
    return item
  }

  addEdge = (item: IEdgeModel): Edge | undefined => {
    try {
      const graph = this.$graph
      const edgeCfg: IEdgeCfg = {
        ...graph.get('edgeInfo'),
        store: this.$store
      }
      const edge = new Edge(item, edgeCfg)
      this.$store.add(edge)

      edge.on('change', (edge: IEdge, type: string) => {
        this.emit('edge:change', edge, type)
      })
      !this.dataing && this.emit('edge:added', edge)
      return edge
    } catch (error) {
      console.warn(error)
    }
  }

  data(data: IDataModel | INodeModel) {
    this.dataing = true
    if (Object.keys(data).length === 0) {
      return
    }

    this.clear()

    const model: IDataModel = isIDataModel(data) ? data : preorder(data)
    const needLayout = model.nodes.every(
      node => !Number.isFinite(node.x) && !Number.isFinite(node.y)
    )

    this.loadNodes(model.nodes)
    this.loadEdges(model.edges)

    this.emit('datachange', { needLayout: needLayout })

    this.dataing = false
  }

  destroy() {
    this.clear()
  }
}
