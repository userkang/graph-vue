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

  clickNode(e: MouseEvent, id: string) {
    this.resetSelect()
    const node = this.graph.findNode(id)
    node.setState('selected')
    const selectNodes = [this.graph.findNode(id)]
    this.graph.emit('nodeselectchange', selectNodes)
  }

  clickEdge(e: MouseEvent, id: string) {
    this.resetSelect()
    const edges = this.graph.findEdge(id)
    edges.setState('selected')
    this.graph.emit('edgeselectchange', edges)
  }

  clickSvg(e: MouseEvent) {
    this.resetSelect()
  }

  resetSelect() {
    const nodes = this.graph.getNodes()
    const edges = this.graph.getEdges()
    nodes.forEach(node => {
      node.clearState('selected')
    })
    edges.forEach(edge => {
      edge.clearState('selected')
    })
    this.graph.emit('nodeselectchange', [])
    this.graph.emit('edgeselectchange', [])
  }
}
