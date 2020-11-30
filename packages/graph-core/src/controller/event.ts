import Graph from './graph'
import { addEventListener, isTarget, getItemData } from '../util/dom'
import behaviors from '../behavior'

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

const DATACHANGE = [
  'afteraddnode',
  'afteraddedge',
  'nodeselectchange',
  'edgeselectchange',
  'afterdeletenode',
  'afterdeleteedge',
  'afterdragnode',
  'afterlayout'
]

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
    this.$svg = graph.cfg.container
    this.initBehavior()
    this.defaultEmit()
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
    const action = this.graph.cfg.action
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
        const data = getItemData(e)
        this.graph.emit(`${this.currentItemType}.${eventType}`, e, data)
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

  /**
   *  在这里做一次拦截监听，触发需要默认 emit 的事件
   */
  defaultEmit() {
    // 有些事件默认触发datachange事件
    this.graph.on(DATACHANGE, () => {
      this.graph.emit('datachange')
    })
  }

  destroy() {
    this.eventQueue.forEach((item: any) => {
      item.remove()
    })

    this.graph.off()
  }
}
