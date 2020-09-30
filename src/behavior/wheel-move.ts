import Graph from '@/controller/graph'

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
    if (e.ctrlKey) {
      e.preventDefault()
      let ratio = this.graph.getZoom()

      if ((e as any).wheelDelta > 0) {
        ratio = ratio + ratio * 0.05
      } else {
        ratio = ratio - ratio * 0.05
      }
      this.graph.zoom(ratio)
    }
  }
}
