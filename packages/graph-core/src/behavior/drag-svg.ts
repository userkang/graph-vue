import Graph from '../controller/graph'

export default class DragSvg {
  graph: Graph

  isMoving = false
  // 移动时动态起始值
  startX = 0
  startY = 0
  // 移动时动态距离值
  moveX = 0
  moveY = 0

  constructor(graph: Graph) {
    this.graph = graph
    this.init()
  }

  init() {
    this.graph.on('svg.mousedown', this.mouseDown.bind(this))
    this.graph.on('mousemove', this.mouseMove.bind(this))
    this.graph.on('mouseup', this.mouseUp.bind(this))
    this.graph.on('mouseleave', this.mouseUp.bind(this))
  }

  mouseDown(e: MouseEvent) {
    if (!this.graph.getBrushing()) {
      this.isMoving = true
    }
  }

  mouseMove(e: MouseEvent) {
    const { x, y } = e

    if (this.isMoving) {
      this.moveX = x - this.startX
      this.moveY = y - this.startY

      const dx = this.moveX / this.graph.getZoom()
      const dy = this.moveY / this.graph.getZoom()

      this.graph.translate(dx, dy)
    }

    this.startX = x
    this.startY = y
  }

  mouseUp() {
    this.isMoving = false
  }
}
