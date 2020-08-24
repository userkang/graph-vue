import Graph from './graph'

export default class EventController {
  private graph: Graph

  isMouseDownNode = false
  isMouseDownSlot = false
  isMouseDownSvg = false
  // 框选状态
  isSelecting = false
  // 当前拖动节点
  activeNode!: INodeType
  // 当前被选中节点
  selectedNode: INodeType[] = []
  // 移动的节点
  moveNode: INodeType[] = []
  // 移动前的坐标
  originX = 0
  originY = 0
  // 移动时动态起始值
  startX = 0
  startY = 0
  // 移动时动态距离值
  moveX = 0
  moveY = 0
  // 连线起始节点
  fromNodeId = 0
  // 当前选中连线
  activeEdgeId = 0
  // 框选操作框路径
  selectBoxPath = ''
  showSelectingBox = false

  constructor(graph: Graph) {
    this.graph = graph
    this.initEvent()
  }

  initEvent() {
    window.addEventListener(
      'resize',
      this.graph.viewController.resize.bind(this.graph.viewController)
    )
    document.addEventListener('keydown', this.handleKeyUp.bind(this))
  }

  mouseDownNode(e: MouseEvent, node: INodeType) {
    this.isMouseDownNode = true

    this.activeNode = node
    this.activeEdgeId = 0
    this.startX = this.originX = e.x
    this.startY = this.originY = e.y

    // 判断当前正在移动节点是否被选中
    this.checkActiveNodeIsSelected()
  }

  mouseDownSlot(e: MouseEvent, node: INodeType) {
    this.isMouseDownSlot = true
    this.fromNodeId = node.nodeId
  }

  async mouseUpSlot(e: MouseEvent, node: INodeType) {
    this.isMouseDownSlot = false
    await this.graph.edgeController.addEdge({
      fromNodeId: this.fromNodeId,
      toNodeId: node.nodeId
    })
    this.graph.edgeController.setResetEdge()
  }

  edgeClick(edgeId: number) {
    this.activeEdgeId = edgeId
    this.selectedNode = []
  }

  async deleteLine() {
    await this.graph.edgeController.deleteEdge(this.activeEdgeId)
    this.activeEdgeId = 0
  }

  svgMouseDown(e: MouseEvent) {
    // console.log('svgMouseDown')
    this.originX = e.x
    this.originY = e.y

    if (this.isSelecting) {
      this.showSelectingBox = true
    } else {
      this.isMouseDownSvg = true
    }
  }

  async mouseMove(e: MouseEvent) {
    const { graph } = this
    const viewController = graph.viewController
    const { x, y } = e
    this.moveX = x - this.startX
    this.moveY = y - this.startY

    if (this.isMouseDownNode) {
      this.moveNode.forEach(item => {
        item.posX += this.moveX / viewController.transform.scale
        item.posY += this.moveY / viewController.transform.scale
      })
    } else if (this.isMouseDownSlot) {
      const posX = viewController.positionTransformX(x)
      const posY = viewController.positionTransformY(y)
      this.graph.edgeController.setNewEdgeMove(posX, posY)
    } else if (this.isSelecting && this.showSelectingBox) {
      const startX = this.originX - viewController.svgInfo.x
      const startY = this.originY - viewController.svgInfo.y
      const endX = x - viewController.svgInfo.x
      const endY = y - viewController.svgInfo.y

      this.selectBoxPath = `M${startX},${startY}H${endX}V${endY}H${startX}Z`
      this.checkSelected(this.originX, this.originY, x, y)
    } else if (this.isMouseDownSvg) {
      viewController.transform.translateX +=
        this.moveX / viewController.transform.scale
      viewController.transform.translateY +=
        this.moveY / viewController.transform.scale
    }

    this.startX = x
    this.startY = y
  }

  async svgMouseUp(e: MouseEvent) {
    e.stopPropagation()
    const { x, y } = e
    // 鼠标是否发生位移
    const isMove = x - this.originX || y - this.originY

    if (this.isMouseDownNode) {
      this.isMouseDownNode = false
      if (isMove) {
        const moveNode = [...this.selectedNode, this.activeNode]
        // await NodeStore.updateNodePosition(moveNode)
        // afterMoveNode()
      } else {
        // 否则就是单纯的点击操作
        this.selectedNode = [this.activeNode]
      }
    } else if (this.isMouseDownSlot) {
      this.isMouseDownSlot = false
      this.graph.edgeController.setResetEdge()
    } else if (this.isSelecting && this.showSelectingBox) {
      this.isSelecting = false
      this.showSelectingBox = false
      this.selectBoxPath = ''
    } else if (this.isMouseDownSvg) {
      this.isMouseDownSvg = false
      if (!isMove) {
        this.activeEdgeId = 0
        this.selectedNode = []
      }
    }
  }

  mouseLeave(e: MouseEvent) {
    // 当鼠标离开画布时，手动触发画布 mouseup 事件
    this.svgMouseUp(e)
  }

  mouseWheel(e: WheelEvent) {
    const viewController = this.graph.viewController
    e.preventDefault()
    if (e.deltaX) {
      viewController.transform.translateX -= e.deltaX
    }
    if (e.deltaY) {
      viewController.transform.translateY -= e.deltaY
    }
  }

  async handleKeyUp(e: KeyboardEvent) {
    e.stopPropagation()
    const tagName = (e.target as HTMLBodyElement).tagName
    if (tagName === 'BODY') {
      if (['Delete', 'Backspace'].includes(e.key)) {
        if (this.activeEdgeId) {
          await this.graph.edgeController.deleteEdge(this.activeEdgeId)
          this.activeEdgeId = 0
        }
        console.log(this)
        if (this.selectedNode.length === 1) {
          await this.graph.nodeController.deleteNode(
            this.selectedNode[0].nodeId
          )
          this.selectedNode = []
        }
      }
    }
  }

  checkActiveNodeIsSelected() {
    this.moveNode = [this.activeNode]
    // 来确保移动节点独立于选中逻辑，判断当前正在移动节点是否被选中
    if (this.isNodeSelected(this.activeNode.nodeId)) {
      this.moveNode = this.selectedNode
    }
  }

  isNodeSelected(id: number) {
    for (const item of this.selectedNode) {
      if (item.nodeId === id) {
        return true
      }
    }

    return false
  }

  checkSelected(startX: number, startY: number, endX: number, endY: number) {
    // 处理不同方向框选的情况
    // 从左上->右下，不要交换
    const range = {
      startX,
      startY,
      endX,
      endY
    }
    // 左下->右上
    if (endX > startX && endY < startY) {
      range.startY = endY
      range.endY = startY
    }
    // 右上->左下
    if (endX < startX && endY > startY) {
      range.startX = endX
      range.endX = startX
    }
    // 右下->左上
    if (endX < startX && endY < startY) {
      range.startX = endX
      range.startY = endY
      range.endX = startX
      range.endY = startY
    }

    this.selectedNode = this.graph.nodes.filter(item => {
      return this.checkNodeRange(item, range)
    })
  }

  checkNodeRange(
    item: INodeType,
    range: { startX: number; startY: number; endX: number; endY: number }
  ) {
    const { graph } = this
    const viewController = graph.viewController

    if (
      item.posY + viewController.rectInfo.height <
      viewController.positionTransformY(range.startY)
    ) {
      return false
    } else if (item.posY > viewController.positionTransformY(range.endY)) {
      return false
    } else if (
      item.posX + viewController.rectInfo.width <
      viewController.positionTransformX(range.startX)
    ) {
      return false
    } else if (item.posX > viewController.positionTransformX(range.endX)) {
      return false
    } else {
      return true
    }
  }

  handleToolBox(e: MouseEvent) {
    const { graph } = this
    const id = (e.target as HTMLElement).id
    switch (id) {
      case 'expand':
        graph.viewController.expand()
        break
      case 'shrink':
        graph.viewController.shrink()
        break
      case 'reset':
        graph.viewController.reset()
        break
      case 'select':
        graph.viewController.select()
        break
      case 'fullscreen':
        graph.viewController.fullscreen()
        break
      case 'layout':
        graph.layoutController.execute()
        break
      case 'fitView':
        graph.viewController.fitView()
        break
    }
  }

  destroy() {
    window.removeEventListener('resize', this.graph.viewController.resize)
    document.removeEventListener('keydown', this.handleKeyUp)
  }
}
