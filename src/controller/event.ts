import Graph from './graph'
import { addEventListener, isTarget, getItem } from '@/assets/js/dom'
import DragSvg from '@/behavior/drag-svg'
import DragNode from '@/behavior/drag-node'

const EVENTS = [
  'mousedown',
  'mouseup',
  'dblclick',
  'contextmenu',
  'mouseenter',
  'mouseout',
  'mouseover',
  'mousemove',
  'mouseleave',
  'drag',
  'dragover',
  'dragout',
  'drop'
]

const EXTENDEVENTS = ['keyup', 'keydown', 'wheel']

export default class EventController {
  private graph: Graph

  $svg: HTMLElement
  eventQueue: { [key: string]: any } = []
  preItemType = 'svg'
  currentItemType = 'svg'

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
    this.$svg = graph.config.container
    this.initBehavior()
    this.initEvent()
  }

  initEvent() {
    EVENTS.forEach(eventType => {
      this.eventQueue.push(
        addEventListener(this.$svg, eventType, this.handleMouseEvent.bind(this))
      )
    })

    EXTENDEVENTS.forEach(eventType => {
      this.eventQueue.push(
        addEventListener(
          window as any,
          eventType,
          this.handleExtendEvents.bind(this)
        )
      )
    })
  }

  initBehavior() {
    const dragSvg = new DragSvg(this.graph)
    const dragNode = new DragNode(this.graph)
  }

  handleMouseEvent(e: MouseEvent) {
    const eventType = e.type

    if (eventType === 'mousedown') {
      this.originX = e.x
      this.originY = e.y
    }

    if (eventType === 'mousemove') {
      this.handleMouseMove(e)
    }

    if (eventType === 'mouseup') {
      const isMove = e.x - this.originX || e.y - this.originY
      if (!isMove) {
        this.emitMouseEvent(e, 'click')
      }
    }

    this.emitMouseEvent(e, eventType)
  }

  emitMouseEvent(e: MouseEvent, eventType: string) {
    this.graph.emit(eventType, e)

    if (e.target === this.$svg) {
      this.currentItemType = 'svg'
      this.graph.emit(`svg.${eventType}`, e)
    }

    if (isTarget(e, 'node')) {
      this.currentItemType = 'node'
      const item = getItem(e)
      this.graph.emit(`${this.currentItemType}.${eventType}`, e, item)
    }
  }

  handleExtendEvents(e: MouseEvent) {
    this.graph.emit(e.type, e)
  }

  handleMouseMove(e: MouseEvent) {
    if (this.preItemType !== this.currentItemType) {
      this.graph.emit(`${this.preItemType}.mouseleave`)
      this.graph.emit(`${this.currentItemType}.mouseenter`)
    }

    this.preItemType = this.currentItemType
  }

  // svgMouseDown(e: MouseEvent) {
  //   this.originX = e.x
  //   this.originY = e.y

  //   if (this.isSelecting) {
  //     this.showSelectingBox = true
  //   } else {
  //     this.isMouseDownSvg = true
  //   }
  // }

  // mouseDownNode(e: MouseEvent, node: INodeType) {
  //   this.isMouseDownNode = true

  //   this.activeNode = node
  //   this.activeEdgeId = 0
  //   this.startX = this.originX = e.x
  //   this.startY = this.originY = e.y

  //   // 判断当前正在移动节点是否被选中
  //   this.checkActiveNodeIsSelected()
  // }

  // mouseDownSlot(e: MouseEvent, node: INodeType) {
  //   this.isMouseDownSlot = true
  //   this.fromNodeId = node.nodeId
  // }

  // async mouseUpSlot(e: MouseEvent, node: INodeType) {
  //   this.isMouseDownSlot = false
  //   await this.graph.edgeController.addEdge({
  //     fromNodeId: this.fromNodeId,
  //     toNodeId: node.nodeId
  //   })
  //   this.graph.edgeController.setResetEdge()
  // }

  // edgeClick(edgeId: number) {
  //   this.activeEdgeId = edgeId
  //   this.selectedNode = []
  // }

  // async deleteLine() {
  //   await this.graph.edgeController.deleteEdge(this.activeEdgeId)
  //   this.activeEdgeId = 0
  // }

  // async mouseMove(e: MouseEvent) {
  //   const { graph } = this
  //   const viewController = graph.viewController
  //   const { x, y } = e
  //   this.moveX = x - this.startX
  //   this.moveY = y - this.startY

  //   if (this.isMouseDownNode) {
  //     this.moveNode.forEach(item => {
  //       item.posX += this.moveX / viewController.transform.scale
  //       item.posY += this.moveY / viewController.transform.scale
  //     })
  //   } else if (this.isMouseDownSlot) {
  //     const posX = viewController.positionTransformX(x)
  //     const posY = viewController.positionTransformY(y)
  //     this.graph.edgeController.setNewEdgeMove(posX, posY)
  //   } else if (this.isSelecting && this.showSelectingBox) {
  //     const startX = this.originX - viewController.svgInfo.x
  //     const startY = this.originY - viewController.svgInfo.y
  //     const endX = x - viewController.svgInfo.x
  //     const endY = y - viewController.svgInfo.y

  //     this.selectBoxPath = `M${startX},${startY}H${endX}V${endY}H${startX}Z`
  //     this.checkSelected(this.originX, this.originY, x, y)
  //   } else if (this.isMouseDownSvg) {
  //     viewController.transform.translateX +=
  //       this.moveX / viewController.transform.scale
  //     viewController.transform.translateY +=
  //       this.moveY / viewController.transform.scale
  //   }

  //   this.startX = x
  //   this.startY = y
  // }

  // async svgMouseUp(e: MouseEvent) {
  //   e.stopPropagation()
  //   const { x, y } = e
  //   // 鼠标是否发生位移
  //   const isMove = x - this.originX || y - this.originY

  //   if (this.isMouseDownNode) {
  //     this.isMouseDownNode = false
  //     if (isMove) {
  //       const moveNode = [...this.selectedNode, this.activeNode]
  //       // await NodeStore.updateNodePosition(moveNode)
  //       // afterMoveNode()
  //     } else {
  //       // 否则就是单纯的点击操作
  //       this.selectedNode = [this.activeNode]
  //     }
  //   } else if (this.isMouseDownSlot) {
  //     this.isMouseDownSlot = false
  //     this.graph.edgeController.setResetEdge()
  //   } else if (this.isSelecting && this.showSelectingBox) {
  //     this.isSelecting = false
  //     this.showSelectingBox = false
  //     this.selectBoxPath = ''
  //   } else if (this.isMouseDownSvg) {
  //     this.isMouseDownSvg = false
  //     if (!isMove) {
  //       this.activeEdgeId = 0
  //       this.selectedNode = []
  //     }
  //   }
  // }

  // mouseLeave(e: MouseEvent) {
  //   // 当鼠标离开画布时，手动触发画布 mouseup 事件
  //   this.svgMouseUp(e)
  // }

  mouseWheel(e: WheelEvent) {
    const viewController = this.graph.viewController
    e.preventDefault()

    viewController.translate(-e.deltaX, -e.deltaY)

    // if (e.deltaX) {
    //   viewController.transform.translateX -= e.deltaX
    // }
    // if (e.deltaY) {
    //   viewController.transform.translateY -= e.deltaY
    // }
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
    // 将不同方向的框选框都格式化为从左上->右下
    const range = {
      startX: Math.min(startX, endX),
      startY: Math.min(startY, endY),
      endX: Math.max(startX, endX),
      endY: Math.max(startY, endY)
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

  destroy() {
    this.eventQueue.forEach((item: any) => {
      item.remove()
    })

    this.graph.off()
  }
}
