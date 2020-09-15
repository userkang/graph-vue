import Graph from '@/controller/graph'
import { addEventListener, isTarget, getItem } from '@/assets/js/dom'

export default class DragNode {
  graph: Graph
  $svg: HTMLElement
  event: { [key: string]: any } = []

  // 移动前的坐标
  originX = 0
  originY = 0

  isMouseDownNode = false
  // 当前拖动节点
  activeNode!: INodeType
  // 当前被选中节点
  selectedNode: INodeType[] = []
  // 移动的节点
  moveNode: INodeType[] = []

  // 移动时动态起始值
  startX = 0
  startY = 0
  // 移动时动态距离值
  moveX = 0
  moveY = 0

  constructor(graph: Graph) {
    this.graph = graph
    this.$svg = graph.config.container
    window.s = this
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
  }

  mouseDown(e: MouseEvent) {
    if (isTarget(e, 'node')) {
      this.isMouseDownNode = true
      this.startX = this.originX = e.x
      this.startY = this.originY = e.y
      this.activeNode = getItem(e)
      // this.graph.nodes.filter(item => {
      //   return getItem(e).nodeId === item.nodeId
      // })[0]

      console.log(this.activeNode)

      this.checkActiveNodeIsSelected()
    }
  }

  mouseMove(e: MouseEvent) {
    const { x, y } = e

    if (this.isMouseDownNode) {
      this.moveX = x - this.startX
      this.moveY = y - this.startY

      this.moveNode.forEach(item => {
        item.posX += this.moveX / this.graph.getZoom()
        item.posY += this.moveY / this.graph.getZoom()
      })
      console.log(this.moveNode)

      this.startX = x
      this.startY = y
    }

    this.startX = x
    this.startY = y
  }

  mouseUp(e: MouseEvent) {
    if (!this.isMouseDownNode) {
      return
    }

    this.isMouseDownNode = false
  }

  checkActiveNodeIsSelected() {
    this.moveNode = [this.activeNode]
    // 来确保移动节点独立于选中逻辑，判断当前正在移动节点是否被选中
    if (this.isNodeSelected(this.activeNode.nodeId)) {
      this.moveNode = this.selectedNode
    }
  }

  isNodeSelected(id: number) {
    for (const item of this.selectedNode) {
      if (item.nodeId === id) {
        return true
      }
    }

    return false
  }

  destroy() {
    this.event.forEach((item: any) => {
      item.remove()
    })
  }
}
