import Graph from '../controller/graph'

export default class WheelZoom {
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
        ratio += ratio * 0.05
      } else {
        ratio -= ratio * 0.05
      }

      // const point = this.graph.getPointByClient(e.x, e.y)
      // this.graph.translate(-point.x, -point.y)
      this.graph.zoom(ratio)
      // this.graph.translate(point.x, point.y)
    }
  }
}
