import Graph from '../controller/graph'
import Element from './element'
import { calculateCurve } from './util/util'
export default class NewEdge extends Element {
  constructor(graph: Graph) {
    super()
    this.set('graph', graph)
    this.draw()
    this.initHook()
  }

  draw() {
    const newEdgePath = this.createDom('path', {
      class: 'graph-new-edge',
      d: ''
    })

    this.set('newEdgePath', newEdgePath)
    this.set('el', newEdgePath)
  }

  initHook() {
    this.addEvent('addingedge', this.update)
  }

  update(createEdge: {
    fromPoint: {
      x: 0
      y: 0
    }
    toPoint: {
      x: 0
      y: 0
    }
  }) {
    const newEdgePath = this.get('newEdgePath')
    if (createEdge) {
      const path = calculateCurve(
        {
          x1: createEdge.fromPoint.x,
          y1: createEdge.fromPoint.y,
          x2: createEdge.toPoint.x,
          y2: createEdge.toPoint.y
        },
        this.graph.get('direction')
      )

      newEdgePath.setAttribute('d', path.line)
    } else {
      newEdgePath.setAttribute('d', '')
    }
  }
}
