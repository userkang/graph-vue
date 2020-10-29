import Graph from './graph'
import { addEventListener, isTarget, getItem } from '@/assets/js/dom'
import behaviors from '@/behavior'

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

const MOVE_DEVIATION = 2

const EXTENDEVENTS = ['keyup', 'keydown', 'wheel']

export default class EventController {
  private graph: Graph

  $svg: HTMLElement
  eventQueue: { [key: string]: any } = []
  preItemType = 'svg'
  currentItemType = 'svg'
  behaveInstance: any = {}

  // 移动前的坐标
  originX = 0
  originY = 0

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

    this.eventQueue.push(
      addEventListener(
        window as any,
        'resize',
        this.graph.resize.bind(this.graph)
      )
    )
  }

  initBehavior() {
    const action = this.graph.config.action
    if (action) {
      action.forEach((item: string) => {
        const func = behaviors[item]
        if (func && !this.behaveInstance[item]) {
          const behave = new func(this.graph)
          if (behave) {
            this.behaveInstance[item] = behave
          }
        }
      })
    }
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
      const moveX = e.x - this.originX
      const moveY = e.y - this.originY
      // 没有移动，并且是左键点击
      if (
        Math.abs(moveX) < MOVE_DEVIATION &&
        Math.abs(moveY) < MOVE_DEVIATION &&
        e.button === 0
      ) {
        this.emitMouseEvent(e, 'click')
      }
    }

    this.emitMouseEvent(e, eventType)
  }

  emitMouseEvent(e: MouseEvent, eventType: string) {
    if (e.target === this.$svg) {
      this.currentItemType = 'svg'
      this.graph.emit(`svg.${eventType}`, e)
    }

    const targetTypes = this.$svg.querySelectorAll('[data-type]')
    const typeSet: Set<string> = new Set()
    Array.from(targetTypes).forEach(item => {
      typeSet.add((item as HTMLElement).dataset.type as string)
    })

    typeSet.forEach(type => {
      if (isTarget(e, type)) {
        this.currentItemType = type
        const item = getItem(e)
        this.graph.emit(`${this.currentItemType}.${eventType}`, e, item)
      }
    })

    this.graph.emit(eventType, e)
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

  // handleKeyUp(e: KeyboardEvent) {
  //   e.stopPropagation()
  //   const tagName = (e.target as HTMLBodyElement).tagName
  //   if (tagName === 'BODY') {
  //     if (['Delete', 'Backspace'].includes(e.key)) {
  //       if (this.activeEdgeId) {
  //         this.graph.edgeController.deleteEdge(this.activeEdgeId)
  //         this.activeEdgeId = 0
  //       }
  //       if (this.selectedNode.length === 1) {
  //         this.graph.nodeController.deleteNode(this.selectedNode[0].nodeId)
  //         this.selectedNode = []
  //       }
  //     }
  //   }
  // }

  destroy() {
    this.eventQueue.forEach((item: any) => {
      item.remove()
    })

    this.graph.off()
  }
}
