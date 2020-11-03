import Graph from '../controller/graph'

export default class BrushSelect {
  graph: Graph
  event: { [key: string]: any } = []
  originX = 0
  originY = 0
  moving = false

  constructor(graph: Graph) {
    this.graph = graph
    this.init()
  }

  init() {
    this.graph.on('svg.mousedown', this.onMouseDown.bind(this))
    this.graph.on('mousemove', this.onMouseMove.bind(this))
    this.graph.on('mouseup', this.onMouseUp.bind(this))
  }

  onMouseDown(e: MouseEvent) {
    this.originX = e.x
    this.originY = e.y
    if (this.graph.getBrushing()) {
      this.moving = true
    }
  }

  onMouseMove(e: MouseEvent) {
    if (!this.moving) {
      return
    }

    const viewController = this.graph.viewController
    const startX = this.originX - viewController.svgInfo.x
    const startY = this.originY - viewController.svgInfo.y
    const endX = e.x - viewController.svgInfo.x
    const endY = e.y - viewController.svgInfo.y

    const selectPath = `M${startX},${startY}H${endX}V${endY}H${startX}Z`
    this.graph.emit('brushing', selectPath)
    this.checkSelected(this.originX, this.originY, e.x, e.y)
  }

  onMouseUp(e: MouseEvent) {
    this.moving = false
    this.graph.emit('brushing', '')
  }

  checkSelected(startX: number, startY: number, endX: number, endY: number) {
    // 处理不同方向框选的情况
    // 将不同方向的框选框都格式化为从左上->右下
    const range = {
      startX: Math.min(startX, endX),
      startY: Math.min(startY, endY),
      endX: Math.max(startX, endX),
      endY: Math.max(startY, endY)
    }

    const selectedNode = this.graph.nodes.filter(item => {
      return this.checkNodeRange(item, range)
    })

    this.graph.setNodeState('select', selectedNode)
    this.graph.emit('nodeselectchange', selectedNode)
  }

  checkNodeRange(
    item: INodeType,
    range: { startX: number; startY: number; endX: number; endY: number }
  ) {
    const viewController = this.graph.viewController
    const { x: startX, y: startY } = this.graph.getPointByClient(
      range.startX,
      range.startY
    )
    const { x: endX, y: endY } = this.graph.getPointByClient(
      range.endX,
      range.endY
    )

    const nodeWidth = this.graph.getNodeWidth()
    const nodeHeight = this.graph.getNodeHeight()

    if (item.posY + nodeHeight < startY) {
      return false
    } else if (item.posY > endY) {
      return false
    } else if (item.posX + nodeWidth < startX) {
      return false
    } else if (item.posX > endX) {
      return false
    } else {
      return true
    }
  }
}
