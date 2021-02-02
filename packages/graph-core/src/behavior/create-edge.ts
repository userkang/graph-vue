import Graph from '../controller/graph'
import Slot from '../item/slot'
import Base from './base'

export default class CreateEdge extends Base {
  fromSlot = null
  fromNode = null
  isMoveing = false
  createEdge = {
    fromPoint: {
      x: 0,
      y: 0
    },
    toPoint: {
      x: 0,
      y: 0
    }
  }

  constructor(graph: Graph) {
    super(graph)
    this.init()
  }

  init() {
    this.addEvent('slot.mousedown', this.slotMouseDown)
    this.addEvent('mousemove', this.mouseMove)
    this.addEvent('slot.mouseup', this.slotMouseUp)
    this.addEvent('mouseup', this.mouseUp)
  }

  slotMouseDown(e: MouseEvent, data: { id: string }) {
    const { id } = data
    // 初始化连线的起点和移动位置
    const slot = this.graph.findSlot(id)
    if (slot.type === 'in') {
      return
    }

    const { x, y } = slot
    this.setNewEdgeStart(x, y)
    this.setNewEdgeMove(x, y)
    this.fromSlot = slot
    this.fromNode = this.graph.findNode(slot.nodeId)
    this.setEnableSlot()
    this.graph.emit('beforeaddedge')
  }

  mouseMove(e: MouseEvent) {
    if (!this.isMoveing) {
      return
    }
    const { x, y } = this.graph.getPointByClient(e.x, e.y)
    this.setNewEdgeMove(x, y)
    this.graph.emit('addingedge', this.createEdge)
  }

  slotMouseUp(e: MouseEvent, data: { id: string }) {
    e.stopPropagation()
    const { id } = data
    const slot = this.graph.findSlot(id)

    if (slot.hasState('enable')) {
      // 这里要传 model 下的 id，保证用户数据类型正确
      // 当 model 下无 id 时，再取自生成 id
      const node = this.graph.findNode(slot.nodeId)

      const edgeInfo = {
        fromNodeId: this.fromNode.model.id || this.fromNode.id,
        toNodeId: node.model.id
      }

      if (this.fromNode.model.slots) {
        Object.assign(edgeInfo, {
          fromSlotId: this.fromSlot.model.id || this.fromSlot.id
        })
      }

      if (node.model.slots) {
        Object.assign(edgeInfo, {
          toSlotId: slot.model.id
        })
      }

      this.graph.addEdge(edgeInfo)
    }

    this.setResetEdge()
    this.graph.emit('addingedge', null)
  }

  mouseUp() {
    if (this.isMoveing) {
      this.setResetEdge()
      this.graph.emit('addingedge', null)
    }
  }

  setEnableSlot() {
    const nodes = this.graph.getNodes()

    nodes.forEach(node => {
      node.slots.forEach(slot => {
        if (
          slot.type === 'in' &&
          node.id !== this.fromNode.id &&
          !this.isDirectLinked(slot)
        ) {
          slot.setState('enable')
        }
      })
    })
  }

  isDirectLinked(slot: Slot) {
    let linked = false

    for (const item of this.fromNode.edges) {
      linked =
        item.fromSlot.id === this.fromSlot.id && item.toSlot.id === slot.id
      if (linked) {
        break
      }
    }
    return linked
  }

  setNewEdgeStart(fromX: number, fromY: number) {
    this.isMoveing = true
    this.createEdge.fromPoint.x = fromX
    this.createEdge.fromPoint.y = fromY
  }

  setNewEdgeMove(toX: number, toY: number) {
    this.createEdge.toPoint.x = toX
    this.createEdge.toPoint.y = toY
  }

  setResetEdge() {
    this.isMoveing = false
    this.createEdge.fromPoint = { x: 0, y: 0 }
    this.createEdge.toPoint = { x: 0, y: 0 }
    const nodes = this.graph.getNodes()
    nodes.forEach(item => {
      item.slots.forEach(slot => {
        if (slot.hasState('enable')) {
          slot.clearState('enable')
        }
      })
    })
  }
}
