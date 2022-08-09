import Graph from './graph'
import { addEventListener, getItemData, getItemType } from '../util/dom'
import behaviors from '../behavior'
import { getGraph } from '../item/store'

export const MOUSEEVENTS = [
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
  'dragenter',
  'dragleave',
  'drop',
  'wheel'
]

const MOVE_DEVIATION = 2

const EXTENDEVENTS = ['keyup', 'keydown']

const DATACHANGE = [
  'node:added',
  'edge:added',
  'node:deleted',
  'edge:deleted',
  'node:moved',
  'layout',
  'node:change',
  'edge:change',
  'port:change',
  'port:added',
  'port:deleted'
]

export default class EventController {
  $svg: SVGSVGElement
  eventQueue: { [key: string]: any } = []
  preItemType = 'svg'
  currentItemType = 'svg'
  behaveInstance: { [key: string]: any } = {}

  // 移动前的坐标
  originX = 0
  originY = 0

  constructor(readonly graphId: string) {
    const svg = getGraph(graphId).cfg.container.querySelector('svg')
    if (svg) {
      this.$svg = svg
    } else {
      throw new ReferenceError(`找不到svg`)
    }
    this.addBehavior()
    this.defaultEmit()
    this.initEvent()
  }

  initEvent() {
    MOUSEEVENTS.forEach(eventType => {
      this.eventQueue.push(
        addEventListener(this.$svg, eventType, this.handleMouseEvent.bind(this))
      )
    })

    EXTENDEVENTS.forEach(eventType => {
      this.eventQueue.push(
        addEventListener(window, eventType, this.handleExtendEvents.bind(this))
      )
    })

    this.eventQueue.push(
      addEventListener(
        window,
        'resize',
        getGraph(this.graphId).resize.bind(getGraph(this.graphId))
      )
    )
  }

  addBehavior(action?: string[]) {
    const actions = action || getGraph(this.graphId).cfg.action
    if (actions) {
      actions.forEach((item: string) => {
        const func = behaviors[item]
        if (func && !this.behaveInstance[item]) {
          const behave = new func(getGraph(this.graphId))
          if (behave) {
            this.behaveInstance[item] = behave
          }
        }
      })
      // 更新当前 action 配置
      getGraph(this.graphId).set('action', Object.keys(this.behaveInstance))
    }
  }

  removeBehavior(action?: string | string[]) {
    if (!action) {
      // 全部清楚
      Object.keys(this.behaveInstance).forEach(key => {
        this.behaveInstance[key].destory()
      })
      this.behaveInstance = {}
      getGraph(this.graphId).set('action', [])
      return
    }

    const actions = !Array.isArray(action) ? [action] : action
    actions.forEach(item => {
      if (this.behaveInstance[item]) {
        this.behaveInstance[item].destory()
        delete this.behaveInstance[item]
      }
    })
    getGraph(this.graphId).set('action', Object.keys(this.behaveInstance))
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
    const { x, y } = getGraph(this.graphId).getPointByClient(e.x, e.y)

    if (e.target === this.$svg) {
      this.currentItemType = 'blank'
      getGraph(this.graphId).emit(`blank:${eventType}`, { e, x, y })
    }

    const type = getItemType(e)
    if (type) {
      this.currentItemType = type
      const data = getItemData(e)
      const target = this.findItem(type, data.id as string)
      // 具有 type 类型的元素，data 参数会带上其dom节点上的 graph-type 值。
      getGraph(this.graphId).emit(`${this.currentItemType}:${eventType}`, {
        e,
        x,
        y,
        data,
        target
      })
    }

    getGraph(this.graphId).emit(eventType, e)
  }

  findItem(type: string, id: string) {
    if (type === 'node') {
      return getGraph(this.graphId).findNode(id)
    } else if (type === 'edge') {
      return getGraph(this.graphId).findEdge(id)
    } else if (type === 'port') {
      return getGraph(this.graphId).findPort(id)
    }
  }

  handleExtendEvents(e: MouseEvent) {
    getGraph(this.graphId).emit(e.type, e)
  }

  handleMouseMove(e: MouseEvent) {
    if (this.preItemType !== this.currentItemType) {
      getGraph(this.graphId).emit(`${this.preItemType}.mouseleave`)
      getGraph(this.graphId).emit(`${this.currentItemType}.mouseenter`)
    }

    this.preItemType = this.currentItemType
  }

  /**
   *  在这里做一次拦截监听，触发需要默认 emit 的事件
   */
  defaultEmit() {
    // 有些事件默认触发datachange事件
    getGraph(this.graphId).on(DATACHANGE, () => {
      getGraph(this.graphId).emit('datachange')
    })
  }

  destroy() {
    this.eventQueue.forEach((item: any) => {
      item.remove()
    })
    this.eventQueue = []
    this.behaveInstance = []

    getGraph(this.graphId).off()
  }
}
