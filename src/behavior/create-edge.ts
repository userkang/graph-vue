import Graph from '@/controller/graph'

export default class CreateEdge {
  graph: Graph
  event: { [key: string]: any } = []
  fromNodeId = 0
  createEdge = {
    show: false,
    fromX: 0,
    fromY: 0,
    toX: 0,
    toY: 0
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

  slotMouseDown(e: MouseEvent, item: any) {
    if (item.isInOrOut === 'out') {
      // 初始化连线的起点和移动位置
      this.setNewEdgeStart(item.posX, item.posY)
      this.setNewEdgeMove(item.posX, item.posY)
      this.fromNodeId = item.node.nodeId
      this.graph.emit('fromNodeIdChange', this.fromNodeId)
    }
  }

  mouseMove(e: MouseEvent) {
    if (!this.createEdge.show) {
      return
    }
    const { x, y } = this.graph.getPointByClient(e.x, e.y)
    this.setNewEdgeMove(x, y)
    this.graph.emit('addingEdge', this.createEdge)
  }

  slotMouseUp(e: MouseEvent, item: any) {
    if (item.enableLink) {
      this.graph.addEdge({
        fromNodeId: this.fromNodeId,
        toNodeId: item.node.nodeId
      })
    }
    this.setResetEdge()
    this.graph.emit('addingEdge', this.createEdge)
  }

  mouseUp() {
    if (this.createEdge.show) {
      this.setResetEdge()
      this.graph.emit('addingEdge', this.createEdge)
    }
  }

  setNewEdgeStart(fromX: number, fromY: number) {
    this.createEdge = {
      ...this.createEdge,
      fromX,
      fromY,
      show: true
    }
  }

  setNewEdgeMove(toX: number, toY: number) {
    this.createEdge = {
      ...this.createEdge,
      toX,
      toY
    }
  }

  setResetEdge() {
    this.createEdge = {
      show: false,
      fromX: 0,
      fromY: 0,
      toX: 0,
      toY: 0
    }
  }
}
