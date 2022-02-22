import Graph from '../controller/graph'
import Base from './base'

export default class WheelZoom extends Base {
  constructor(graph: Graph) {
    super(graph)
    this.init()
  }

  init() {
    this.addEvent('wheel', this.onWheel)
  }

  onWheel(e: WheelEvent) {
    if (e.ctrlKey) {
      e.preventDefault()
      let ratio = this.graph.getZoom()

      if ((e as any).wheelDelta > 0) {
        ratio += ratio * 0.05
      } else {
        ratio -= ratio * 0.05
      }

      this.graph.zoom(ratio, e)
    }
  }
}
