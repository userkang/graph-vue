import { IEdge, INodeModel } from '../types'
import Element from './element'
import Graph from '../controller/graph'
import { calculateCurve } from './util/util'
export default class Node extends Element {
  edge!: IEdge

  constructor(edge: IEdge, graph: Graph) {
    super()
    this.edge = edge
    this.set('graph', graph)
    this.draw()
    this.initHook()
  }

  draw() {
    const edgePath = this.createDom('path', {
      class: 'graph-edge'
    })

    const edgeWrapperPath = this.createDom('path', {
      class: 'graph-edge-wrapper',
      'graph-type': 'edge',
      'graph-id': this.edge.id
    })

    const arrowPath = this.createDom('path', {
      class: 'graph-arrow'
    })

    const g = this.createDom('g')

    g.appendChild(edgeWrapperPath)
    g.appendChild(edgePath)
    g.appendChild(arrowPath)

    this.set('edgePath', edgePath)
    this.set('edgeWrapperPath', edgeWrapperPath)
    this.set('arrowPath', arrowPath)

    this.setPath()
  }

  initHook() {
    this.addEvent('dragingnode', this.updatePath)
    this.addEvent('afterdragnode', this.updatePath)
    this.addEvent('afterlayout', this.setPath)
    this.addEvent('edgeselectchange', this.updateSelect)
  }

  updatePath(moveNodes: INodeModel[]) {
    const node = moveNodes.find(
      item =>
        String(item.id) === this.edge.fromNode.id ||
        String(item.id) === this.edge.toNode.id
    )
    if (node) {
      this.setPath()
    }
  }

  updateSelect() {
    const edgePath = this.get('edgePath')
    const arrowPath = this.get('arrowPath')
    if (this.edge.hasState('selected')) {
      edgePath.classList.add('graph-edge-active')
      arrowPath.classList.add('graph-arrow-active')
    } else {
      edgePath.classList.remove('graph-edge-active')
      arrowPath.classList.remove('graph-arrow-active')
    }
  }

  update() {
    this.setPath()
  }

  setPath() {
    const edgePath = this.get('edgePath')
    const edgeWrapperPath = this.get('edgeWrapperPath')
    const arrowPath = this.get('arrowPath')
    const path = calculateCurve(
      {
        x1: this.edge.fromSlot.x,
        y1: this.edge.fromSlot.y,
        x2: this.edge.toSlot.x,
        y2: this.edge.toSlot.y
      },
      this.graph.get('direction')
    )
    edgePath.setAttribute('d', path.line)
    edgeWrapperPath.setAttribute('d', path.line)
    arrowPath.setAttribute('d', path.arrow)
  }
}
