import Graph from '../controller/graph'

export default class WheelMove {
  graph: Graph

  constructor(graph: Graph) {
    this.graph = graph
    this.init()
  }

  init() {
    this.graph.on('wheel', this.onWheel.bind(this))
  }

  onWheel(e: WheelEvent) {
    if (!e.ctrlKey) {
      e.preventDefault()
      const ratio = this.graph.getZoom()
      this.graph.translate(-e.deltaX / ratio, -e.deltaY / ratio)
    }
  }
}
