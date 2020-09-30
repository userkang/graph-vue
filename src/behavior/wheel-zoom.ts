import Graph from '@/controller/graph'

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
    if (!e.ctrlKey) {
      e.preventDefault()
      this.graph.translate(-e.deltaX, -e.deltaY)
    }
  }
}
