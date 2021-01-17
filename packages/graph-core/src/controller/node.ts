import Graph from './graph'
import Node from '../item/node'
import { INodeModel } from '../types'

export default class NodeController {
  graph: Graph

  constructor(graph: Graph) {
    this.graph = graph
  }

  addNode(item: INodeModel) {
    const { width, height } = this.graph.getNodeInfo()
    const node = new Node(item, {
      width,
      height,
      drection: this.graph.get('drection')
    })
    this.graph.getNodes().push(node)

    // 渲染
    if (this.graph.get('isRender')) {
      const nodeView = node.render(this.graph)
      const nodeGroup = this.graph.get('svg').get('nodeGroup')
      nodeGroup.add(nodeView)
    }

    return node
  }

  deleteNode(id: string) {
    const nodes = this.graph.getNodes()
    const index = nodes.findIndex(item => item.id === id)
    if (index > -1) {
      nodes.splice(index, 1)
    }
  }
}
