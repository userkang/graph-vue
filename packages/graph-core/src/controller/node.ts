import Graph from './graph'
import Node from '../item/node'
import { INode, INodeModel } from '../types'

export default class NodeController {
  graph: Graph
  nodes: INode[] = []

  constructor(graph: Graph) {
    this.graph = graph
  }

  public findNode(id: string | number): INode | undefined {
    const _id = String(id)
    return this.nodes.find(item => item.id === _id)
  }

  public updateNode(id: string, model: INodeModel): INode | false {
    const node = this.findNode(id)
    if (!node) {
      return false
    }
    node.update(model)
    return node
  }

  public deleteNode(id: string): INode | false {
    const node = this.findNode(id)
    if (!node) {
      return false
    }
    const index = this.nodes.findIndex(item => item.id === node.id)
    if (index > -1) {
      // 先删除与节点相关的边
      const edgeIds = node.edges.map(edge => edge.id)
      edgeIds.forEach(item => {
        this.graph.deleteEdge(item, false)
      })
      this.nodes.splice(index, 1)
    }

    if (this.graph.get('isRender')) {
      const nodeGroup = this.graph.get('svg').get('nodeGroup')
      nodeGroup.remove(node.get('view'))
    }
    return node
  }

  public addNode(item: INodeModel): INode | false {
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
    this.nodes.push(node)

    // 渲染
    if (this.graph.get('isRender')) {
      const nodeView = node.render(this.graph)
      const nodeGroup = this.graph.get('svg').get('nodeGroup')
      nodeGroup.add(nodeView)
    }

    return node
  }

  public data(group: INodeModel[]) {
    this.nodes = []
    group.forEach(item => this.addNode(item))
  }
}
