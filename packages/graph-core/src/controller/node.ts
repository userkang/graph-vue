import Graph from './graph'
import Node from '../item/node'
import { INode, INodeModel } from '../types'

const defaultCfg = {
  width: 190,
  height: 35
}
export default class NodeController {
  graph: Graph

  constructor(graph: Graph) {
    this.graph = graph
  }

  addNode(item: INodeModel) {
    const nodeCfg = this.graph.get('nodeConfig') || defaultCfg
    const direction = this.graph.get('direction')

    const node = new Node(item, nodeCfg, direction)
    this.graph.getNodes().push(node)

    // 渲染
    if (this.graph.get('isRender')) {
      const nodeView = node.render(this.graph)
      const nodeGroup = this.graph.get('svg').get('nodeGroup')
      nodeGroup.add(nodeView)
    }

    return node
  }

  deleteNode(node: INode) {
    const nodes = this.graph.getNodes()
    const index = nodes.findIndex(item => item.id === node.id)
    if (index > -1) {
      nodes.splice(index, 1)
    }

    if (this.graph.get('isRender')) {
      const nodeGroup = this.graph.get('svg').get('nodeGroup')
      nodeGroup.remove(node.get('view'))
    }
  }
}
