import Graph from './graph'
import Node from '../item/node'
import { INode, INodeModel } from '../types'
import Slot from '../item/slot'

const defaultCfg = {
  width: 190,
  height: 35
}
export default class NodeController {
  graph: Graph
  private _nodes: { [id: string]: INode } = {}

  constructor(graph: Graph) {
    this.graph = graph
    if (graph.cfg.nodes) {
      this.data(graph.cfg.nodes)
    }
  }

  get nodes() {
    return Object.values(this._nodes)
  }

  get slotsMap() {
    const res: { [id: string]: Slot } = {}
    this.nodes.forEach(node => {
      node.slots.forEach(slot => (res[slot.id] = slot))
    })
    return res
  }

  public findNode(id: string | number): INode | undefined {
    return this._nodes[String(id)]
  }

  public findNodeBySlot(slotId: string): INode | undefined {
    return this.nodes.find(node => node.slots.find(slot => slot.id === slotId))
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
      this.graph.deleteEdge(node.getEdges()[i]?.id, false)
    }

    delete this._nodes[node.id]

    if (this.graph.get('isRender')) {
      const nodeGroup = this.graph.get('svg').get('nodeGroup')
      nodeGroup.remove(node.get('view'))
    }

    return node
  }

  public addNode(item: INodeModel): INode | undefined {
    if (item.id && item.id in this._nodes) {
      console.warn(`can't add node, exist node where id is '${item.id}'`)
      return
    }

    const nodeCfg = this.graph.get('nodeInfo') || defaultCfg
    const direction = this.graph.get('direction')

    const node = new Node(item, nodeCfg, direction)
    this._nodes[node.id] = node

    // 渲染
    if (this.graph.get('isRender')) {
      const nodeView = node.render(this.graph)
      const nodeGroup = this.graph.get('svg').get('nodeGroup')
      nodeGroup.add(nodeView)
    }

    return node
  }

  public data(group: INodeModel[]) {
    this._nodes = {}
    group.forEach(item => this.addNode(item))
  }

  public destroy() {
    ;(this.graph as null | Graph) = null
    this._nodes = {}
  }
}
