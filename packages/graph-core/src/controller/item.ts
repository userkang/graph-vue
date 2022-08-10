import Node from '../item/node'
import Edge from '../item/edge'
import { INode, INodeModel, IPort, IEdgeModel, IEdge } from '../types'
import {  store } from '../item/store'
import { INodeCfg, IEdgeCfg } from '../types/type'

const NODE_DEFAULT_CFG = {
  width: 180,
  height: 40
} as const

export default class ItemController {
  constructor(readonly graphId: string) {
    const graph = store.getters.graph(this.graphId)
    if (graph.cfg.nodes) {
      this.loadNodes(graph.cfg.nodes)
    }
    if (graph.cfg.edges) {
      this.loadEdges(graph.cfg.edges)
    }
  }

  get nodeMap(): Record<string, Node> {
    return store.getters.itemMap(this.graphId, Node)
  }

  get nodes() {
    return Object.values(this.nodeMap).sort(
      (a, b) => (a.zIndex || 0) - (b.zIndex || 0)
    )
  }

  get edgeMap() {
    return store.getters.itemMap(this.graphId, Edge)
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

  public deleteNode(id: string): INode | undefined {
    const node = this.findNode(id)
    if (!node) {
      console.warn(`can't delete node where id is '${id}'`)
      return
    }
    // 先删除与节点相关的边
    for (let i = node.getEdges().length - 1; i >= 0; i--) {
      store.getters.graph(this.graphId).deleteEdge(node.getEdges()[i]?.id, false)
    }
    this.nodeMap[node.id].off()
    store.mutations.removeItem(this.graphId, node.id)

    if (store.getters.graph(this.graphId).get('isRender')) {
      const nodeGroup = store.getters.graph(this.graphId).get('svg').get('nodeGroup')
      nodeGroup.remove(node.view)
    }

    return node
  }

  public addNode(item: INodeModel): INode | undefined {
    if (item.id !== undefined && this.nodeMap[item.id]) {
      console.warn(`can't add node, exist node where id is '${item.id}'`)
      return
    }

    const defaultNode = store.getters.graph(this.graphId).get('defaultNode') || {}
    const model = Object.assign({}, defaultNode, item)
    const direction = store.getters.graph(this.graphId).get('direction')
    const nodeCfg: INodeCfg = {
      ...NODE_DEFAULT_CFG,
      ...store.getters.graph(this.graphId).get('nodeInfo'),
      direction,
      graphId: this.graphId
    }
    const node = new Node(model, nodeCfg)
    this.nodeMap[node.id] = node 
    store.mutations.insertItem(this.graphId, node)

    this.watchNodeChange(node)

    // 渲染
    if (store.getters.graph(this.graphId).get('isRender')) {
      const nodeView = node.render(store.getters.graph(this.graphId))
      const nodeGroup = store.getters.graph(this.graphId).get('svg').get('nodeGroup')
      nodeGroup.add(nodeView)
    }

    return node
  }

  onNodeChange = (node: INode, type: string) => {
    const eventType = 'node:change'
    store.getters.graph(this.graphId).emit(`${eventType}:${type}`, node)
    store.getters.graph(this.graphId).emit(eventType, node, type)
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

  public deleteEdge(id: string): IEdge | undefined {
    const edge = this.findEdge(id)
    if (!edge) {
      console.warn(`can't delete edge where id is '${id}'`)
      return
    }
    // 先删除前后节点的相关边
    const { fromNode, toNode, fromPort, toPort } = edge
    edge.fromNode.deleteEdge(id)
    edge.toNode.deleteEdge(id)

    // 如果边两端的 port 没有其他边连接，就清除该 port 的 linked 状态
    if (!fromNode.getEdges().find(item => item.fromPort.id === fromPort.id)) {
      fromPort.clearState('linked')
    }

    if (!toNode.getEdges().find(item => item.toPort.id === toPort.id)) {
      toPort.clearState('linked')
    }
 
    store.mutations.removeItem(this.graphId, id)

    if (store.getters.graph(this.graphId).get('isRender')) {
      const edgeGroup = store.getters.graph(this.graphId).get('svg').get('edgeGroup')
      edgeGroup.remove(edge.view)
    }
    return edge
  }

  public addEdge(item: IEdgeModel): Edge | undefined {
    try {
      const edgeCfg: IEdgeCfg = {
        ...store.getters.graph(this.graphId).get('edgeInfo'),
        graphId: this.graphId
      }
      const edge = new Edge(item, edgeCfg)
      this.edgeMap[edge.id] = edge 
      store.mutations.insertItem(this.graphId, edge)

      this.watchEdgeChange(edge)

      // 渲染
      if (store.getters.graph(this.graphId).get('isRender')) {
        const edgeView = edge.render(store.getters.graph(this.graphId))
        const edgeGroup = store.getters.graph(this.graphId).get('svg').get('edgeGroup')
        edgeGroup.add(edgeView)
      }

      return edge
    } catch (error) {
      console.warn(error)
    }
  }

  watchEdgeChange(edge: IEdge) {
    edge.on('change', (edge: IEdge, type: string) => {
      store.getters.graph(this.graphId).emit(`edge:change:${type}`, edge)
      store.getters.graph(this.graphId).emit('edge:change', edge, type)
    })
  }

  onPortChange = (port: IPort, type: string) => {
    const eventType = 'port:change'
    store.getters.graph(this.graphId).emit(`${eventType}:${type}`, port)
    store.getters.graph(this.graphId).emit(eventType, port, type)
  }

  onPortAdded = (ports: IPort[]) => {
    const eventType = 'port:added'
    store.getters.graph(this.graphId).emit(eventType, ports)
  }

  onPortDeleted = (ids: string[]) => {
    const eventType = 'port:deleted'
    store.getters.graph(this.graphId).emit(eventType, ids)
  }

  public watchNodeChange(node: INode) {
    node.on('change', this.onNodeChange)
    node.on('port:change', this.onPortChange)
    node.on('port:added', this.onPortAdded)
    node.on('port:deleted', this.onPortDeleted)
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
