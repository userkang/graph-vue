import { INodeModel } from '../types'
import Graph from '../controller/graph'
import Node from '../item/node'
import Base from './base'

const MOVE_DEVIATION = 2
export default class DragNode extends Base {
  isMoving = false

  // 当前拖动节点
  activeNode!: Node
  // 移动的节点
  moveNode: Node[] = []
  stackNode: INodeModel[] = []

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
    super(graph)
    this.init()
  }

  init() {
    this.addEvent('node.mousedown', this.mouseDown)
    this.addEvent('mousemove', this.mouseMove)
    this.addEvent('mouseup', this.mouseUp)
    this.addEvent('mouseleave', this.mouseUp)
  }

  mouseDown(e: MouseEvent, data: { id: string }) {
    const { id } = data
    this.isMoving = true
    this.originX = this.startX = e.x
    this.originY = this.startY = e.y

    this.activeNode = this.graph.findNode(id)

    this.checkActiveNodeIsSelected()

    // 整理存入栈的节点信息
    this.stackNode = this.moveNode.map(item => {
      return { ...item.model }
    })
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
      const moveNodeModel = this.moveNode.map(item => item.model)
      this.graph.emit('afterdragnode', moveNodeModel)
      this.graph.pushStack('updateNodePosition', { nodes: this.stackNode })
      this.stackNode = []
    }
    this.isMoving = false
  }

  checkActiveNodeIsSelected() {
    this.moveNode = [this.activeNode]
    // 来确保移动节点独立于选中逻辑，判断当前正在移动节点是否被选中
    if (this.activeNode.hasState('selected')) {
      const selectedNode = this.graph.findNodeByState('selected')
      this.moveNode = selectedNode
    }
  }
}
