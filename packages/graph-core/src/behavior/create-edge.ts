import Graph from '../controller/graph'
import Slot from '../item/slot'

export default class CreateEdge {
  graph: Graph
  fromSlot = null
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
    this.graph = graph
    this.init()
  }

  init() {
    this.graph.on('slot.mousedown', this.slotMouseDown.bind(this))
    this.graph.on('mousemove', this.mouseMove.bind(this))
    this.graph.on('slot.mouseup', this.slotMouseUp.bind(this))
    this.graph.on('mouseup', this.mouseUp.bind(this))
  }

  slotMouseDown(e: MouseEvent, id: string) {
    // 初始化连线的起点和移动位置
    const slot = this.graph.findSlot(id)
    if (slot.type === 'in') {
      return
    }

    const { x, y } = slot
    this.setNewEdgeStart(x, y)
    this.setNewEdgeMove(x, y)
    this.fromSlot = slot
    this.setEnableSlot()
  }

  mouseMove(e: MouseEvent) {
    if (!this.isMoveing) {
      return
    }
    const { x, y } = this.graph.getPointByClient(e.x, e.y)
    this.setNewEdgeMove(x, y)
    this.graph.emit('addingedge', this.createEdge)
  }

  slotMouseUp(e: MouseEvent, id: string) {
    e.stopPropagation()

    const slot = this.graph.findSlot(id)

    if (slot.hasState('enable')) {
      this.graph.addEdge({
        fromNodeId: this.fromSlot.node.id,
        toNodeId: slot.node.id,
        fromSlotId: this.fromSlot.id,
        toSlotId: slot.id
      })
    }

    this.setLinkedSlot()
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
          node.id !== this.fromSlot.node.id &&
          !this.isDirectLinked(slot)
        ) {
          slot.setState('enable')
        }
      })
    })
  }

  setLinkedSlot() {
    const nodes = this.graph.getNodes()
    const edges = this.graph.getEdges()

    edges.forEach(edge => {
      nodes.forEach(node => {
        node.slots.forEach(slot => {
          if (
            slot.id === edge.model.fromSlotId ||
            slot.id === edge.model.toSlotId
          ) {
            slot.setState('linked')
          }
        })
      })
    })
  }

  isDirectLinked(slot: Slot) {
    let linked = false

    // console.log(this.fromSlot.node.edges)
    for (const item of this.fromSlot.node.edges) {
      linked =
        item.model.fromSlotId === this.fromSlot.id &&
        item.model.toSlotId === slot.id
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
