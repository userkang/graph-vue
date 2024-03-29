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

  clickNode({ target, e }: IGraphEvent) {
    if (e.shiftKey) {
      this.resetEdgeSelect()
      if(!target || target.hasState('locked')) {
        return
      }
      target.hasState('selected')
      ? target.clearState('selected')
      : target.setState('selected')
    } else {
      const selectedNodes = this.graph.findNodeByState('selected')
      const hasSelected = selectedNodes.findIndex(
        item => item.id === target?.id
      )
      if (hasSelected > -1) {
        return
      }

      this.resetEdgeSelect()
      selectedNodes.forEach(item => item.clearState('selected'))
      if (target && !target.hasState('locked')) {
        target.setState('selected')
      }
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
    }
  }
}
