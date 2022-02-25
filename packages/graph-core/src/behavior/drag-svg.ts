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
    if (!this.graph.get('brushing')) {
      this.isMoving = true
    }
  }

  mouseMove(e: MouseEvent) {
    const { x, y } = e

    if (this.isMoving) {
      this.moveX = x - this.startX
      this.moveY = y - this.startY

      const zoom = this.graph.getZoom()
      const dx = this.moveX / zoom
      const dy = this.moveY / zoom

      this.graph.translateBy(dx, dy)
    }

    this.startX = x
    this.startY = y
  }

  mouseUp() {
    this.isMoving = false
  }
}
