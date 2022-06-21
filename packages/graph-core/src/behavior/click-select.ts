import { IEdge, IGraphEvent, INode } from '../types'
import Graph from '../controller/graph'
import Base from './base'

export default class ClickSelect extends Base {
  constructor(graph: Graph) {
    super(graph)
    this.init()
  }

  init() {
    this.addEvent('node:click', this.clickNode)
    this.addEvent('edge:click', this.clickEdge)
    this.addEvent('blank:click', this.clickBlank)
  }

  clickNode({ target }: IGraphEvent) {
    const selectedNodes = this.graph.findNodeByState('selected')
    const hasSelected = selectedNodes.findIndex(item => item.id === target?.id)
    if (hasSelected > -1) {
      return
    }

    this.resetEdgeSelect()
    selectedNodes.forEach(item => item.clearState('selected'))
    if (target && !target.hasState('locked')) {
      target.setState('selected')
      this.graph.emit('node:change:selected', [target])
    }
  }

  clickEdge({ target }: IGraphEvent) {
    const selectedEdges = this.graph.findEdgeByState('selected')
    const exist = selectedEdges.findIndex(item => item.id === target?.id)
    if (exist > -1) {
      return
    }

    this.resetNodeSelect()
    selectedEdges.forEach(item => item.clearState('selected'))
    if (target) {
      target.setState('selected')
      this.graph.emit('edge:change:selected', [target])
    }
  }

  clickBlank(e: MouseEvent) {
    this.resetNodeSelect()
    this.resetEdgeSelect()
  }

  resetNodeSelect() {
    const nodes = this.graph.getNodes()
    const selectedNodes: INode[] = []

    nodes.forEach(node => {
      if (node.hasState('selected')) {
        selectedNodes.push(node)
        node.clearState('selected')
      }
    })

    if (selectedNodes.length) {
      this.graph.emit('node:change:selected', [])
    }
  }

  resetEdgeSelect() {
    const edges = this.graph.getEdges()
    const selectedEdges: IEdge[] = []

    edges.forEach(edge => {
      if (edge.hasState('selected')) {
        selectedEdges.push(edge)
        edge.clearState('selected')
      }
    })

    if (selectedEdges.length) {
      this.graph.emit('edge:change:selected', [])
    }
  }
}
