import Graph from '@/controller/graph'
import { addEventListener } from '@/assets/js/dom'

export default class DragSvg {
  graph: Graph
  $svg: HTMLElement
  event: { [key: string]: any } = []

  // 移动前的坐标
  originX = 0
  originY = 0

  isMouseDownSvg = false
  // 当前被选中节点
  selectedNode: INodeType[] = []

  // 移动时动态起始值
  startX = 0
  startY = 0
  // 移动时动态距离值
  moveX = 0
  moveY = 0

  constructor(graph: Graph) {
    this.graph = graph
    this.$svg = graph.config.container
    this.init()
  }

  init() {
    this.event.push(
      addEventListener(this.$svg, 'mousedown', this.mouseDown.bind(this))
    )
    this.event.push(
      addEventListener(this.$svg, 'mousemove', this.mouseMove.bind(this))
    )
    this.event.push(
      addEventListener(this.$svg, 'mouseup', this.mouseUp.bind(this))
    )
    this.event.push(
      addEventListener(this.$svg, 'mouseleave', this.mouseUp.bind(this))
    )
  }

  mouseDown(e: MouseEvent) {
    this.originX = e.x
    this.originY = e.y
    if (e.target === this.$svg) {
      this.isMouseDownSvg = true
    }
  }

  mouseMove(e: MouseEvent) {
    const { x, y } = e

    if (this.isMouseDownSvg) {
      this.moveX = x - this.startX
      this.moveY = y - this.startY

      const dx = this.moveX / this.graph.getZoom()
      const dy = this.moveY / this.graph.getZoom()

      this.graph.translate(dx, dy)

      this.startX = x
      this.startY = y
    }

    this.startX = x
    this.startY = y
  }

  mouseUp(e: MouseEvent) {
    if (!this.isMouseDownSvg) {
      return
    }

    const { x, y } = e
    // 鼠标是否发生位移
    const isMove = x - this.originX || y - this.originY

    // if (this.isMouseDownSvg) {
    this.isMouseDownSvg = false
    if (!isMove) {
      // this.activeEdgeId = 0
      this.selectedNode = []
    }
    // }
  }

  destroy() {
    this.event.forEach((item: any) => {
      item.remove()
    })
  }
}
