import Graph from '../controller/graph'
import Element from './element'
import { calculateCurve } from './util/util'
export default class Arrow extends Element {
  constructor(graph: Graph) {
    super()
    this.set('graph', graph)
    this.draw()
    this.initHook()
  }

  draw() {
    const arrowPath = this.createDom('path', {
      class: 'graph-arrow',
      d: ''
    })

    this.set('arrowPath', arrowPath)
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
    const arrowPath = this.get('arrowPath')
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

      arrowPath.setAttribute('d', path.arrow)
    } else {
      arrowPath.setAttribute('d', '')
    }
  }
}
