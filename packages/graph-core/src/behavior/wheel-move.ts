import Graph from '../controller/graph'
import Base from './base'

export default class WheelMove extends Base {
  constructor(graph: Graph) {
    super(graph)
    this.init()
  }

  init() {
    this.addEvent('wheel', this.onWheel)
  }

  onWheel(e: WheelEvent) {
    if (!e.ctrlKey) {
      e.preventDefault()
      const ratio = this.graph.getZoom()
      this.graph.translateBy(-e.deltaX / ratio, -e.deltaY / ratio)
    }
  }
}
