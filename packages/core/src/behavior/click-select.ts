import Graph from '../controller/graph'

export default class ClickSelect {
  graph: Graph
  event: { [key: string]: any } = []

  constructor(graph: Graph) {
    this.graph = graph
    this.init()
  }

  init() {
    this.graph.on('node.click', this.clickNode.bind(this))
    this.graph.on('edge.click', this.clickEdge.bind(this))
    this.graph.on('svg.click', this.clickSvg.bind(this))
  }

  clickNode(e: MouseEvent, item: INodeType) {
    this.resetSelect()
    const selectNodes = [this.graph.findNode(item.nodeId)]
    this.graph.setNodeState('select', selectNodes)
    this.graph.emit('nodeselectchange', selectNodes)
  }

  clickEdge(e: MouseEvent, item: IEdgeType) {
    this.resetSelect()
    this.graph.setEdgeState('select', item)
    this.graph.emit('edgeselectchange', item)
  }

  clickSvg(e: MouseEvent) {
    this.resetSelect()
  }

  resetSelect() {
    this.graph.setNodeState('select', [])
    this.graph.setEdgeState('select', [])
    this.graph.emit('nodeselectchange', [])
    this.graph.emit('edgeselectchange', [])
  }
}
