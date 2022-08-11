import Node from '../item/node'
import Edge from '../item/edge'
import { INode, INodeModel, IPort, IEdgeModel, IEdge } from '../types'
import { store } from '../item/store'
import { INodeCfg, IEdgeCfg, Item, itemId } from '../types/type'
import Graph, { useGraph } from './graph'

const NODE_DEFAULT_CFG = {
  width: 180,
  height: 40
} as const

export default class ItemController {
  private $graph: Graph
  constructor() {
    this.$graph = useGraph()
    const graph = this.$graph
    if (graph.cfg.nodes) {
      this.loadNodes(graph.cfg.nodes)
    }
    if (graph.cfg.edges) {
      this.loadEdges(graph.cfg.edges)
    }
  }

  get nodeMap(): Record<string, Node> {
    return store.getters.itemMap(this.$graph.graphId, Node)
  }

  get nodes() {
    return Object.values(this.nodeMap).sort(
      (a, b) => (a.zIndex || 0) - (b.zIndex || 0)
    )
  }

  get edgeMap() {
    return store.getters.itemMap(this.$graph.graphId, Edge)
  }

  get edges() {
    return Object.values(this.edgeMap)
  }

  get portsMap() {
    const res: { [id: string]: IPort } = {}
    this.nodes.forEach(node => {
      node.ports.forEach(port => (res[port.id] = port))
    })
    return res
  }

  findItem(id: itemId): Item | undefined {
    return store.getters.itemMap(this.$graph.graphId)[id]
  }

  public findNode(id: string | number): INode | undefined {
    return this.nodeMap[String(id)]
  }

  public findNodeByPort(portId: string): INode | undefined {
    return this.nodes.find(node => node.ports.find(port => port.id === portId))
  }

  public refreshNode(id: string): void {
    const node = this.findNode(id)
    if (!node) {
      return console.warn(`can't refresh node where id is '${id}'`)
    }
    node.refresh()
  }

  public updateNode(id: string, model: INodeModel): void {
    const node = this.findNode(id)
    if (!node) {
      return console.warn(`can't update node where id is '${id}'`)
    }
    node.update(model)
  }

  public addNode(item: INodeModel): INode | undefined {
    if (item.id !== undefined && this.nodeMap[item.id]) {
      console.warn(`can't add node, exist node where id is '${item.id}'`)
      return
    }
    const graph = this.$graph

    const defaultNode = graph.get('defaultNode') || {}
    const model = Object.assign({}, defaultNode, item)
    const direction = graph.get('direction')
    const nodeCfg: INodeCfg = {
      ...NODE_DEFAULT_CFG,
      ...graph.get('nodeInfo'),
      direction,
      graphId: this.$graph.graphId
    }
    const node = new Node(model, nodeCfg)
    this.nodeMap[node.id] = node
    store.mutations.insertItem(this.$graph.graphId, node)

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

    const onPortDeleted = (ids: string[]) => {
      const eventType = 'port:deleted'
      this.$graph.emit(eventType, ids)
    }

    node.on('change', onNodeChange)
    node.on('port:change', onPortChange)
    node.on('port:added', onPortAdded)
    node.on('port:deleted', onPortDeleted)

    // 渲染
    if (graph.get('isRender')) {
      const nodeView = node.render(graph)
      const nodeGroup = graph.get('svg').get('nodeGroup')
      nodeGroup.add(nodeView)
    }

    return node
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

  deleteItem(id: itemId): Item | undefined {
    const item = this.findItem(id)
    if (!item) {
      console.warn(`can't delete item where id is '${id}'`)
      return
    }
    item.remove()
    return item
  }

  public deleteNode(id: string): INode | undefined {
    return this.deleteItem(id) as INode | undefined
  }

  public deleteEdge(id: string): IEdge | undefined {
    return this.deleteItem(id) as IEdge | undefined
  }

  public addEdge(item: IEdgeModel): Edge | undefined {
    try {
      const graph = this.$graph
      const edgeCfg: IEdgeCfg = {
        ...graph.get('edgeInfo'),
        graphId: this.$graph.graphId
      }
      const edge = new Edge(item, edgeCfg)
      this.edgeMap[edge.id] = edge
      store.mutations.insertItem(this.$graph.graphId, edge)

      edge.on('change', (edge: IEdge, type: string) => {
        this.$graph.emit(`edge:change:${type}`, edge)
        this.$graph.emit('edge:change', edge, type)
      })

      // 渲染
      if (graph.get('isRender')) {
        const edgeView = edge.render(graph)
        const edgeGroup = graph.get('svg').get('edgeGroup')
        edgeGroup.add(edgeView)
      }

      return edge
    } catch (error) {
      console.warn(error)
    }
  }

  public loadNodes(nodes: INodeModel[]) {
    const childNodes: INode[] = []

    Object.keys(this.nodeMap).forEach(id => this.deleteNode(id))
    nodes.forEach(item => {
      const node = this.addNode(item)
      if (item.parentId && node) {
        childNodes.push(node)
      }
    })

    childNodes.forEach(childNode => {
      const parentNode = this.findNode(childNode.parentId)
      if (parentNode) {
        parentNode.addChild(childNode)
        childNode.zIndex = 1
        childNode.setParent(parentNode)
      } else {
        console.warn(
          `node id '${childNode.id}' can't find parentNode where id is '${childNode.parentId}'`
        )
      }
    })
  }

  public loadEdges(group: IEdgeModel[]) {
    for (const item of group) {
      this.addEdge(item)
    }
  }

  public destroy() {
    Object.keys(this.nodeMap).forEach(id => this.deleteNode(id))
  }
}
