import Graph from '../controller/graph'
import Base from './base'

export default class DragSvg extends Base {
  isMoving = false
  // 移动时动态起始值
  startX = 0
  startY = 0
  // 移动时动态距离值
  moveX = 0
  moveY = 0

  constructor(graph: Graph) {
    super(graph)
    this.init()
  }

  init() {
    this.addEvent('svg.mousedown', this.mouseDown)
    this.addEvent('mousemove', this.mouseMove)
    this.addEvent('mouseup', this.mouseUp)
    this.addEvent('mouseleave', this.mouseUp)
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
