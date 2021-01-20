import Graph from '../controller/graph'
import Base from './base'

export default class ClickSelect extends Base {
  constructor(graph: Graph) {
    super(graph)
    this.init()
  }

  init() {
    this.addEvent('node.click', this.clickNode)
    this.addEvent('edge.click', this.clickEdge)
    this.addEvent('svg.click', this.clickSvg)
  }

  clickNode(e: MouseEvent, data: { id: string }) {
    const { id } = data
    const selectedNodes = this.graph.findNodeByState('selected')
    const exist = selectedNodes.findIndex(item => item.id === id)
    if (exist > -1) {
      return
    }

    this.resetEdgeSelect()
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

    this.resetNodeSelect()
    const edge = this.graph.findEdge(id)
    edge.setState('selected')
    this.graph.emit('edgeselectchange', [edge.model])
  }

  clickSvg(e: MouseEvent) {
    this.resetNodeSelect()
    this.resetEdgeSelect()
  }

  resetNodeSelect() {
    const nodes = this.graph.getNodes()
    const selectedNodes = []

    nodes.forEach(node => {
      if (node.hasState('selected')) {
        selectedNodes.push(node)
        node.clearState('selected')
      }
    })

    if (selectedNodes.length) {
      this.graph.emit('nodeselectchange', [])
    }
  }

  resetEdgeSelect() {
    const edges = this.graph.getEdges()
    const selectedEdges = []

    edges.forEach(edge => {
      if (edge.hasState('selected')) {
        selectedEdges.push(edge)
        edge.clearState('selected')
      }
    })

    if (selectedEdges.length) {
      this.graph.emit('edgeselectchange', [])
    }
  }
}
