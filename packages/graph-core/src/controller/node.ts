import Graph from './graph'
import Node from '../item/node'
import { INode, INodeModel, IPort } from '../types'
import { getGraph, store } from '../item/store'

const defaultCfg = {
  width: 180,
  height: 40
} as const
export default class NodeController {
  private readonly _nodes: { [id: string]: INode } = {}

  constructor(readonly graphId: string) {
    if (getGraph(this.graphId).cfg.nodes) {
      this.data(getGraph(this.graphId).cfg.nodes)
    }
  }

  get nodes() {
    return this.sortByZIndex()
  }

  get portsMap() {
    const res: { [id: string]: IPort } = {}
    this.nodes.forEach(node => {
      node.ports.forEach(port => (res[port.id] = port))
    })
    return res
  }

  public findNode(id: string | number): INode | undefined {
    return this._nodes[String(id)]
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
      getGraph(this.graphId).deleteEdge(node.getEdges()[i]?.id, false)
    }
    this._nodes[node.id].off()
    delete this._nodes[node.id]

    if (getGraph(this.graphId).get('isRender')) {
      const nodeGroup = getGraph(this.graphId).get('svg').get('nodeGroup')
      nodeGroup.remove(node.view)
    }

    return node
  }

  public addNode(item: INodeModel): INode | undefined {
    if (item.id !== undefined && this._nodes[item.id]) {
      console.warn(`can't add node, exist node where id is '${item.id}'`)
      return
    }

    const defaultNode = getGraph(this.graphId).get('defaultNode') || {}
    const model = Object.assign({}, defaultNode, item)
    const nodeCfg = Object.assign(
      defaultCfg,
      getGraph(this.graphId).get('nodeInfo') || {}
    )
    const direction = getGraph(this.graphId).get('direction')
    const node = new Node(model, nodeCfg, direction)
    this._nodes[node.id] = node

    this.watchNodeChange(node)

    // 渲染
    if (getGraph(this.graphId).get('isRender')) {
      const nodeView = node.render(getGraph(this.graphId))
      const nodeGroup = getGraph(this.graphId).get('svg').get('nodeGroup')
      nodeGroup.add(nodeView)
    }

    return node
  }

  onNodeChange = (node: INode, type: string) => {
    const eventType = 'node:change'
    getGraph(this.graphId).emit(`${eventType}:${type}`, node)
    getGraph(this.graphId).emit(eventType, node, type)
  }

  onPortChange = (port: IPort, type: string) => {
    const eventType = 'port:change'
    getGraph(this.graphId).emit(`${eventType}:${type}`, port)
    getGraph(this.graphId).emit(eventType, port, type)
  }

  onPortAdded = (ports: IPort[]) => {
    const eventType = 'port:added'
    getGraph(this.graphId).emit(eventType, ports)
  }

  onPortDeleted = (ids: string[]) => {
    const eventType = 'port:deleted'
    getGraph(this.graphId).emit(eventType, ids)
  }

  public watchNodeChange(node: INode) {
    node.on('change', this.onNodeChange)
    node.on('port:change', this.onPortChange)
    node.on('port:added', this.onPortAdded)
    node.on('port:deleted', this.onPortDeleted)
  }

  public sortByZIndex() {
    const nodes = Object.values(this._nodes)
    const zIndexMap: Record<number, INode[]> = {}
    nodes.forEach(node => {
      const zIndex = node.zIndex
      zIndexMap[zIndex] = zIndexMap[zIndex] || []
      zIndexMap[zIndex].push(node)
    })

    const nodeList: INode[] = []
    Object.values(zIndexMap).forEach((items: INode[]) => {
      nodeList.push(...items)
    })

    return nodeList
  }

  public data(nodes: INodeModel[]) {
    const childNodes: INode[] = []

    Object.keys(this._nodes).forEach(id => this.deleteNode(id))
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

  public destroy() {
    Object.keys(this._nodes).forEach(id => this.deleteNode(id))
  }
}
