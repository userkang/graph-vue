import Graph from '@/controller/graph'

export default class DragSvg {
  graph: Graph
  $svg: HTMLElement

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
    this.$svg.addEventListener('mousedown', this.mouseDown.bind(this))
    this.$svg.addEventListener('mousemove', this.mouseMove.bind(this))
    this.$svg.addEventListener('mouseup', this.mouseUp.bind(this))
  }

  mouseDown(e: MouseEvent) {
    this.originX = e.x
    this.originY = e.y
    this.isMouseDownSvg = true
  }

  mouseMove(e: MouseEvent) {
    const { x, y } = e

    if (this.isMouseDownSvg) {
      this.moveX = x - this.startX
      this.moveY = y - this.startY
      const viewController = this.graph.viewController

      viewController.transform.translateX +=
        this.moveX / viewController.transform.scale
      viewController.transform.translateY +=
        this.moveY / viewController.transform.scale

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

  mouseLeave(e: MouseEvent) {
    // 当鼠标离开画布时，手动触发画布 mouseup 事件
    this.mouseUp(e)
  }
}
