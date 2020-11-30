import Graph from '../controller/graph'

export default class ClickSelect {
  graph: Graph

  constructor(graph: Graph) {
    this.graph = graph
    this.init()
  }

  init() {
    this.graph.on('node.click', this.clickNode.bind(this))
    this.graph.on('edge.click', this.clickEdge.bind(this))
    this.graph.on('svg.click', this.clickSvg.bind(this))
  }

  clickNode(e: MouseEvent, data: { id: string }) {
    const { id } = data
    const selectedNodes = this.graph.findNodeByState('selected')
    const exist = selectedNodes.findIndex(item => item.id === id)
    if (exist > -1) {
      return
    }

    this.resetSelect()
    const node = this.graph.findNode(id)
    node.setState('selected')
    this.graph.emit('nodeselectchange', [node.model])
  }

  clickEdge(e: MouseEvent, data: { id: string }) {
    const { id } = data
    const selectedEdges = this.graph.findEdgeByState('selected')
    const exist = selectedEdges.findIndex(item => item.id === id)
    if (exist > -1) {
      return
    }

    this.resetSelect()
    const edge = this.graph.findEdge(id)
    edge.setState('selected')
    this.graph.emit('edgeselectchange', [edge.model])
  }

  clickSvg(e: MouseEvent) {
    this.resetSelect(true)
  }

  resetSelect(triggerEmit = false) {
    const nodes = this.graph.getNodes()
    const edges = this.graph.getEdges()
    const selectedNodes = []
    const selectedEdges = []
    nodes.forEach(node => {
      if (node.hasState('selected')) {
        selectedNodes.push(node)
        node.clearState('selected')
      }
    })
    edges.forEach(edge => {
      if (edge.hasState('selected')) {
        selectedEdges.push(edge)
        edge.clearState('selected')
      }
    })

    if (selectedNodes.length && triggerEmit) {
      this.graph.emit('nodeselectchange', [])
    }

    if (selectedEdges.length && triggerEmit) {
      this.graph.emit('edgeselectchange', [])
    }
  }
}
