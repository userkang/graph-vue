import Graph from '../controller/graph'
import Node from '../item/node'

const MOVE_DEVIATION = 2
export default class DragNode {
  graph: Graph
  isMoving = false

  // 当前拖动节点
  activeNode!: Node
  // 当前被选中节点
  selectedNode: Node[] = []
  // 移动的节点
  moveNode: Node[] = []

  // 移动前初始值
  originX = 0
  originY = 0
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

  mouseDown(e: MouseEvent, id: string) {
    this.isMoving = true
    this.originX = this.startX = e.x
    this.originY = this.startY = e.y

    this.activeNode = this.graph.findNode(id)

    this.checkActiveNodeIsSelected()
  }

  mouseMove(e: MouseEvent) {
    const { x, y } = e

    if (this.isMoving) {
      this.moveX = x - this.startX
      this.moveY = y - this.startY

      this.moveNode.forEach(item => {
        const posX = item.x + this.moveX / this.graph.getZoom()
        const posY = item.y + this.moveY / this.graph.getZoom()
        item.updatePosition(posX, posY)
        this.graph.emit('dragingnode')
      })
    }

    this.startX = x
    this.startY = y
  }

  mouseUp(e: MouseEvent) {
    const moveX = e.x - this.originX
    const moveY = e.y - this.originY

    const hasMove = !(
      Math.abs(moveX) < MOVE_DEVIATION &&
      Math.abs(moveY) < MOVE_DEVIATION &&
      e.button === 0
    )

    // 没有移动的情况下，不触发 afterdragnode 事件
    if (this.isMoving && hasMove) {
      this.graph.emit('afterdragnode', this.moveNode)
    }
    this.isMoving = false
  }

  checkActiveNodeIsSelected() {
    this.moveNode = [this.activeNode]
    const nodes = this.graph.getNodes()
    this.selectedNode = nodes.filter(node => {
      return node.hasState('selected')
    })
    // 来确保移动节点独立于选中逻辑，判断当前正在移动节点是否被选中
    if (this.activeNode.hasState('selected')) {
      this.moveNode = this.selectedNode
    }
  }
}
