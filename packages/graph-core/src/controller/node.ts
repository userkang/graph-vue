import Graph from './graph'
import Node from '../item/node'
import { IDataStack, IEdgeModel, INode, INodeModel } from '../types'

export default class NodeController {
  graph: Graph
  private _nodes: INode[] = []

  constructor(graph: Graph) {
    this.graph = graph
    this._nodes = graph.cfg.nodes
  }

  get nodes() {
    return this._nodes
  }

  public findNode(id: string | number): INode | undefined {
    const _id = String(id)
    return this.nodes.find(item => item.id === _id)
  }

  public refreshNode(id: string) {
    const node = this.findNode(id)
    if (node) {
      node.refresh()
      this.graph.emit('afternoderefresh', node.model)
    }
  }

  public updateNode(id: string, model: INodeModel): INode | false {
    const node = this.findNode(id)
    if (!node) {
      return false
    }
    node.update(model)
    this.graph.emit('afternodeupdate', node.model)
    return node
  }

  public deleteNode(id: string, stack = true): INode | false {
    const node = this.findNode(id)
    if (!node) {
      return false
    }
    if (stack) {
      const data: IDataStack = {}
      data.nodes = [node.model]
      data.edges = node.edges.map(item => {
        return item.model as IEdgeModel
      })
      console.log(data.edges)
      this.graph.pushStack('deleteNode', data)
    }
    const index = this.nodes.findIndex(item => item.id === node.id)
    if (index > -1) {
      // 先删除与节点相关的边
      const edgeIds = node.edges.map(edge => edge.id)
      edgeIds.forEach(item => {
        this.graph.deleteEdge(item, false)
      })
      this._nodes.splice(index, 1)
    }

    if (this.graph.get('isRender')) {
      const nodeGroup = this.graph.get('svg').get('nodeGroup')
      nodeGroup.remove(node.get('view'))
    }
    this.graph.emit('afterdeletenode', node.model)

    return node
  }

  public addNode(item: INodeModel, stack = true): INode | false {
    const exist = this.findNode(item.id)
    if (exist) {
      return false
    }
    const { width, height } = this.graph.getNodeInfo()
    const node = new Node(item, {
      width,
      height,
      direction: this.graph.get('direction')
    })
    this._nodes.push(node)
    if (stack) {
      const data = { nodes: [item] }
      this.graph.pushStack('addNode', data)
    }
    // 渲染
    if (this.graph.get('isRender')) {
      const nodeView = node.render(this.graph)
      const nodeGroup = this.graph.get('svg').get('nodeGroup')
      nodeGroup.add(nodeView)
    }
    this.graph.emit('afteraddnode', item)
    return node
  }

  public data(group: INodeModel[]) {
    this._nodes = []
    group.forEach(item => this.addNode(item))
  }
}
