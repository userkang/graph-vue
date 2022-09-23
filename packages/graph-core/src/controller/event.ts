import { addEventListener, getItemData, getItemType } from '../util/dom'
import behaviors from '../behavior'
import Graph, { useGraph } from './graph'

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
  private $graph: Graph
  $svg: SVGSVGElement
  readonly resizeObserver: ResizeObserver
  eventQueue: { [key: string]: any } = []
  preItemType = 'svg'
  currentItemType = 'svg'
  behaveInstance: { [key: string]: any } = {}

  // 移动前的坐标
  originX = 0
  originY = 0

  constructor() {
    this.$graph = useGraph()
    const svg = this.$graph.getContainer().querySelector('svg')
    if (svg) {
      this.$svg = svg
    } else {
      throw new ReferenceError(`找不到svg`)
    }
    this.resizeObserver = new ResizeObserver(
      this.$graph.resize.bind(this.$graph)
    )
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

    this.resizeObserver.observe(this.$graph.container)
  }

  addBehavior(action?: string[]) {
    const graph = this.$graph
    const actions = action || graph.cfg.action
    if (actions) {
      actions.forEach((item: string) => {
        const func = behaviors[item]
        if (func && !this.behaveInstance[item]) {
          const behave = new func(graph)
          if (behave) {
            this.behaveInstance[item] = behave
          }
        }
      })
      // 更新当前 action 配置
      graph.set('action', Object.keys(this.behaveInstance))
    }
  }

  removeBehavior(action?: string | string[]) {
    if (!action) {
      // 全部清楚
      Object.keys(this.behaveInstance).forEach(key => {
        this.behaveInstance[key].destory()
      })
      this.behaveInstance = {}
      this.$graph.set('action', [])
      return
    }

    const actions = !Array.isArray(action) ? [action] : action
    actions.forEach(item => {
      if (this.behaveInstance[item]) {
        this.behaveInstance[item].destory()
        delete this.behaveInstance[item]
      }
    })
    this.$graph.set('action', Object.keys(this.behaveInstance))
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
    const graph = this.$graph
    const { x, y } = graph.getPointByClient(e.x, e.y)

    if (e.target === this.$svg) {
      this.currentItemType = 'blank'
      graph.emit(`blank:${eventType}`, { e, x, y })
    }

    const type = getItemType(e)
    if (type) {
      this.currentItemType = type
      const data = getItemData(e)
      const target = this.findItem(type, data.id as string)
      // 具有 type 类型的元素，data 参数会带上其dom节点上的 graph-type 值。
      graph.emit(`${this.currentItemType}:${eventType}`, {
        e,
        x,
        y,
        data,
        target
      })
    }

    graph.emit(eventType, e)
  }

  findItem(type: string, id: string) {
    const graph = this.$graph
    if (type === 'node') {
      return graph.findNode(id)
    } else if (type === 'edge') {
      return graph.findEdge(id)
    } else if (type === 'port') {
      return graph.findPort(id)
    }
  }

  handleExtendEvents(e: MouseEvent) {
    this.$graph.emit(e.type, e)
  }

  handleMouseMove(e: MouseEvent) {
    if (this.preItemType !== this.currentItemType) {
      this.$graph.emit(`${this.preItemType}.mouseleave`)
      this.$graph.emit(`${this.currentItemType}.mouseenter`)
    }

    this.preItemType = this.currentItemType
  }

  /**
   *  在这里做一次拦截监听，触发需要默认 emit 的事件
   */
  defaultEmit() {
    // 有些事件默认触发datachange事件
    this.$graph.on(DATACHANGE, () => {
      this.$graph.emit('datachange')
    })
  }

  destroy() {
    this.eventQueue.forEach((item: any) => {
      item.remove()
    })
    this.eventQueue = []
    this.behaveInstance = []
    this.resizeObserver.unobserve(this.$graph.container)
    this.$graph.off()
  }
}
