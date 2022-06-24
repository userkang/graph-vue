import { IEdge, INode } from '../types'
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
      class: 'graph-edge',
      'marker-end': 'url(#arrow)'
    })

    const edgeWrapperPath = this.createDom('path', {
      class: 'graph-edge-wrapper',
      'graph-type': 'edge',
      'graph-id': this.edge.id
    })

    const g = this.createDom('g')

    g.appendChild(edgeWrapperPath)
    g.appendChild(edgePath)

    this.set('g', g)
    this.set('edgePath', edgePath)
    this.set('edgeWrapperPath', edgeWrapperPath)
    this.set('el', g)

    this.setPath()
  }

  initHook() {
    this.addEvent('node:moving', this.updatePath)
    this.addEvent('node:moved', this.updatePath)
    this.addEvent('layout', this.setPath)
    this.addEvent('edge:change:selected', this.updateSelect)
  }

  updatePath(moveNodes: INode[]) {
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
    if (this.edge.hasState('selected')) {
      edgePath.classList.add('graph-edge-active')
      edgePath.setAttribute('marker-end', 'url(#arrow-active)')
    } else {
      edgePath.classList.remove('graph-edge-active')
      edgePath.setAttribute('marker-end', 'url(#arrow)')
    }
  }

  update() {
    this.setPath()
  }

  setPath() {
    const { edge } = this
    const pathFunction = edge.cfg?.path
    const edgePath = this.get('edgePath')
    const edgeWrapperPath = this.get('edgeWrapperPath')
    let path = ''

    if (pathFunction) {
      path = pathFunction(edge.fromSlot, edge.toSlot)
    } else {
      const direction = this.graph.get('direction')
      let x2 = edge.toSlot.x
      let y2 = edge.toSlot.y
      if (direction === 'LR') {
        x2 -= 4
      } else {
        y2 -= 4
      }

      path = calculateCurve({
        x1: edge.fromSlot.x,
        y1: edge.fromSlot.y,
        x2,
        y2
      })
    }

    edgePath.setAttribute('d', path)
    edgeWrapperPath.setAttribute('d', path)

    this.updateSelect()
  }
}
