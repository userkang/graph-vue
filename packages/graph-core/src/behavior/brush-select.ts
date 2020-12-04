import Graph from '../controller/graph'
import Node from '../item/node'
import Base from './base'

export default class BrushSelect extends Base {
  originX = 0
  originY = 0
  moving = false
  beforeSelectedNodes = []
  afterSelectedNodes = []

  constructor(graph: Graph) {
    super(graph)
    this.init()
  }

  init() {
    this.addEvent('svg.mousedown', this.onMouseDown)
    this.addEvent('mousemove', this.onMouseMove)
    this.addEvent('mouseup', this.onMouseUp)
  }

  onMouseDown(e: MouseEvent) {
    this.originX = e.x
    this.originY = e.y
    if (this.graph.getBrushing()) {
      this.moving = true
      this.beforeSelectedNodes = this.graph.findNodeByState('selected')
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
    if (this.moving) {
      const before = this.beforeSelectedNodes.map(item => item.id)
      const after = this.afterSelectedNodes.map(item => item.id)
      if (String(before) !== String(after)) {
        const nodeModels = this.afterSelectedNodes.map(item => item.model)
        this.graph.emit('nodeselectchange', nodeModels)
      }
    }

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

    this.afterSelectedNodes = nodes.filter(item => {
      return this.checkNodeRange(item, range)
    })
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

    if (item.y + item.height < startY) {
      return false
    } else if (item.y > endY) {
      return false
    } else if (item.x + item.width < startX) {
      return false
    } else if (item.x > endX) {
      return false
    } else {
      item.setState('selected')
      return true
    }
  }
}
