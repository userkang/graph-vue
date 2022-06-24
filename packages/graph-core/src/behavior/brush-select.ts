import Graph from '../controller/graph'
import Node from '../item/node'
import Base from './base'
import { IGraphEvent } from '../types'

interface Range {
  startX: number
  startY: number
  endX: number
  endY: number
}
export default class BrushSelect extends Base {
  originX = 0
  originY = 0
  moving = false
  beforeSelectedNodes: Node[] = []
  afterSelectedNodes: Node[] = []

  constructor(graph: Graph) {
    super(graph)
    this.init()
  }

  init() {
    this.addEvent('blank:mousedown', this.onMouseDown)
    this.addEvent('mousemove', this.onMouseMove)
    this.addEvent('mouseup', this.onMouseUp)
  }

  onMouseDown({ e }: IGraphEvent) {
    this.originX = e.x
    this.originY = e.y
    if (this.graph.get('brushing')) {
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

  onMouseUp() {
    if (this.moving) {
      const before = this.beforeSelectedNodes.map(item => item.id).toString()
      const after = this.afterSelectedNodes.map(item => item.id).toString()
      if (String(before) !== String(after)) {
        this.graph.emit('node:change:selected', this.afterSelectedNodes)
      }
    }

    this.moving = false
    this.graph.emit('brushing', '')
  }

  checkSelected(startX: number, startY: number, endX: number, endY: number) {
    // 处理不同方向框选的情况
    // 将不同方向的框选框都格式化为从左上->右下
    if (startX > endX) {
      ;[startX, endX] = [endX, startX]
    }
    if (startY > endY) {
      ;[startY, endY] = [endY, startY]
    }
    const leftTop = this.graph.getPointByClient(startX, startY)
    const rightBottom = this.graph.getPointByClient(endX, endY)
    const range = {
      startX: leftTop.x,
      startY: leftTop.y,
      endX: rightBottom.x,
      endY: rightBottom.y
    }

    const nodes = this.graph.getNodes()

    this.afterSelectedNodes = nodes.filter(item => {
      return this.checkNodeRange(item, range)
    })
  }

  checkNodeRange(item: Node, range: Range) {
    const isSelect = !(
      item.y + item.height < range.startY ||
      item.y > range.endY ||
      item.x + item.width < range.startX ||
      item.x > range.endX
    )
    isSelect && !item.hasState('locked')
      ? item.setState('selected')
      : item.clearState('selected')
    return isSelect
  }
}
