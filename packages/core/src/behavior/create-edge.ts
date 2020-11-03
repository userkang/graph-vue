import Graph from '../controller/graph'

export default class CreateEdge {
  graph: Graph
  event: { [key: string]: any } = []
  fromNodeId = 0
  isMoveing = false
  createEdge = {
    source: {
      x: 0,
      y: 0
    },
    target: {
      x: 0,
      y: 0
    }
  }

  constructor(graph: Graph) {
    this.graph = graph
    this.init()
  }

  init() {
    this.graph.on('outslot.mousedown', this.slotMouseDown.bind(this))
    this.graph.on('mousemove', this.mouseMove.bind(this))
    this.graph.on('inslot.mouseup', this.slotMouseUp.bind(this))
    this.graph.on('mouseup', this.mouseUp.bind(this))
  }

  slotMouseDown(e: MouseEvent, node: INodeType) {
    // 初始化连线的起点和移动位置
    const { x, y } = node.outSlot
    this.setNewEdgeStart(x, y)
    this.setNewEdgeMove(x, y)
    this.fromNodeId = node.nodeId
    this.setEnableSlot(node)
  }

  mouseMove(e: MouseEvent) {
    if (!this.isMoveing) {
      return
    }
    const { x, y } = this.graph.getPointByClient(e.x, e.y)
    this.setNewEdgeMove(x, y)
    this.graph.emit('addingEdge', this.createEdge)
  }

  slotMouseUp(e: MouseEvent, node: INodeType) {
    e.stopPropagation()
    if (node.inSlot.status === 'enable') {
      this.graph.addEdge({
        fromNodeId: this.fromNodeId,
        toNodeId: node.nodeId,
        source: this.createEdge.source,
        target: {
          x: node.inSlot.x,
          y: node.inSlot.y
        }
      })
    }

    this.setLinkedSlot()
    this.setResetEdge()
    this.graph.emit('addingEdge', this.createEdge)
  }

  mouseUp() {
    if (this.isMoveing) {
      this.setResetEdge()
      this.graph.emit('addingEdge', this.createEdge)
    }
  }

  setEnableSlot(node: INodeType) {
    const nodes = this.graph.getNodes()
    nodes.forEach(item => {
      if (item.nodeId !== this.fromNodeId && !this.isDirectLinked(item)) {
        item.inSlot.status = 'enable'
      }
    })
  }

  setLinkedSlot() {
    const nodes = this.graph.getNodes()
    const edges = this.graph.getEdges()

    edges.forEach(edge => {
      nodes.forEach(node => {
        if (node.nodeId === edge.fromNodeId) {
          node.outSlot.status = 'linked'
        }
        if (node.nodeId === edge.toNodeId) {
          node.inSlot.status = 'linked'
        }
      })
    })
  }

  isDirectLinked(node: INodeType) {
    let linked = false
    for (const item of this.graph.getEdges()) {
      linked =
        item.fromNodeId === this.fromNodeId && item.toNodeId === node.nodeId
      if (linked) {
        break
      }
    }
    return linked
  }

  setNewEdgeStart(fromX: number, fromY: number) {
    this.isMoveing = true
    this.createEdge.source.x = fromX
    this.createEdge.source.y = fromY
  }

  setNewEdgeMove(toX: number, toY: number) {
    this.createEdge.target.x = toX
    this.createEdge.target.y = toY
  }

  setResetEdge() {
    this.isMoveing = false
    this.createEdge.source = { x: 0, y: 0 }
    this.createEdge.target = { x: 0, y: 0 }
    const nodes = this.graph.getNodes()
    nodes.forEach(item => {
      if (item.inSlot.status === 'enable') {
        item.inSlot.status = ''
      }
    })
  }
}
