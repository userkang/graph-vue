import Graph from '@/controller/graph'
import { addEventListener, isTarget, getItem } from '@/assets/js/dom'

export default class DragNode {
  graph: Graph
  event: { [key: string]: any } = []
  isMoving = false

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
    this.init()
  }

  init() {
    this.graph.on('node.mousedown', this.mouseDown.bind(this))
    this.graph.on('mousemove', this.mouseMove.bind(this))
    this.graph.on('mouseup', this.mouseUp.bind(this))
    this.graph.on('mouseleave', this.mouseUp.bind(this))
  }

  mouseDown(e: MouseEvent, item: INodeType) {
    this.isMoving = true

    this.activeNode = this.graph.findNode(item.nodeId)

    this.checkActiveNodeIsSelected()
  }

  mouseMove(e: MouseEvent) {
    const { x, y } = e

    if (this.isMoving) {
      this.moveX = x - this.startX
      this.moveY = y - this.startY

      this.moveNode.forEach(item => {
        item.posX += this.moveX / this.graph.getZoom()
        item.posY += this.moveY / this.graph.getZoom()
      })
    }

    this.startX = x
    this.startY = y
  }

  mouseUp(e: MouseEvent) {
    this.isMoving = false
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
}
