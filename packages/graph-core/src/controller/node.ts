import Graph from './graph'
import Node from '../item/node'
import { INode, INodeModel } from '../types'
import Slot from '../item/slot'

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
    return Object.keys(this._nodes).map(id => this._nodes[id])
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

  public refreshNode(id: string): INode | false {
    const node = this.findNode(id) || false
    if (node) {
      node.refresh()
    }
    return node
  }

  public updateNode(id: string, model: INodeModel): INode | false {
    const node = this.findNode(id)
    if (!node) {
      return false
    }
    node.update(model)
    return node
  }

  public deleteNode(id: string, stack = true): INode | false {
    const node = this.findNode(id)
    if (!node) {
      return false
    }
    // 先删除与节点相关的边
    node.edges.forEach(edge => this.graph.deleteEdge(edge.id, false))
    delete this._nodes[node.id]

    if (this.graph.get('isRender')) {
      const nodeGroup = this.graph.get('svg').get('nodeGroup')
      nodeGroup.remove(node.get('view'))
    }

    return node
  }

  public addNode(item: INodeModel, stack = true): INode | false {
    if (item.id in this._nodes) {
      return false
    }
    const { width, height } = this.graph.getNodeInfo()
    const node = new Node(item, {
      width,
      height,
      direction: this.graph.get('direction')
    })
    this._nodes[item.id] = node

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
}
