import Graph from '../controller/graph'
import Node from '../item/node'

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

    const { x, y } = this.graph.getSvgInfo()
    const startX = this.originX - x
    const startY = this.originY - y
    const endX = e.x - x
    const endY = e.y - y

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

    const nodes = this.graph.getNodes()

    const selectedNode = nodes.filter(item => {
      return this.checkNodeRange(item, range)
    })

    this.graph.emit('nodeselectchange', selectedNode)
  }

  checkNodeRange(
    item: Node,
    range: { startX: number; startY: number; endX: number; endY: number }
  ) {
    const { x: startX, y: startY } = this.graph.getPointByClient(
      range.startX,
      range.startY
    )
    const { x: endX, y: endY } = this.graph.getPointByClient(
      range.endX,
      range.endY
    )

    const { width, height } = this.graph.getNodeInfo()

    if (item.y + height < startY) {
      return false
    } else if (item.y > endY) {
      return false
    } else if (item.x + width < startX) {
      return false
    } else if (item.x > endX) {
      return false
    } else {
      item.setState('selected')
      return true
    }
  }
}
