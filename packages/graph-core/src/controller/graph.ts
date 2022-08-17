import EventEmitter from '../util/event-emitter'
import LayoutController from './layout'
import ViewController from './view'
import EventController from './event'
import ItemController from './item'
import StackController from './stack'
import Svg from '../view/svg'
import {
  ICfg,
  IEdge,
  INodeModel,
  IEdgeModel,
  IGraphConfig,
  NodeInfo,
  IPort,
  INode,
  IDataModel,
  ILayout
} from '../types/index'
import detectDirectedCycle from '../util/acyclic'
import { IRect, IStack, Item } from '../types/type'
import Store from './store'

let instantiatingGraph: Graph | null = null

export const useGraph = () => {
  if (!instantiatingGraph) {
    throw new ReferenceError(
      `useGraph only can be used when instantiate a Graph`
    )
  }
  return instantiatingGraph
}

export default class Graph extends EventEmitter {
  private readonly viewController: ViewController
  private readonly layoutController: LayoutController
  private readonly eventController: EventController
  private readonly itemController: ItemController
  private readonly stackController: StackController

  readonly store: Store
  readonly $svg?: Svg
  readonly isRender: boolean
  readonly cfg: ICfg

  constructor(config: IGraphConfig) {
    super()
    instantiatingGraph = this
    const container =
      config.container instanceof HTMLElement
        ? config.container
        : document.querySelector(config.container)
    if (!(container instanceof HTMLElement)) {
      throw new ReferenceError(`无效的container ${config.container}`)
    }

    this.cfg = {
      direction: 'TB',
      nodes: [],
      edges: [],
      action: [],
      brushing: false,
      ...config,
      container
    }
    this.set('direction', config.direction || 'TB')

    // 是否触发自带渲染
    const svg = container.querySelector('svg')
    this.isRender = !svg
    this.$svg = svg ? void 0 : new Svg(this)
    this.store = new Store()
    this.viewController = new ViewController()
    this.layoutController = new LayoutController()
    this.eventController = new EventController()
    this.itemController = new ItemController()
    this.stackController = new StackController()
    this.initController()
    ;(window as any).graph = this
    instantiatingGraph = null
  }

  get container() {
    return this.get('container')
  }

  get direction() {
    return this.get('direction')
  }

  private withStack<T extends (payload: any) => any, P = Parameters<T>[0]>(
    callback: T
  ): (payload: P, stack?: boolean) => ReturnType<T>
  private withStack<T extends (payload?: any) => any, P = Parameters<T>[0]>(
    callback: T,
    defaultPayload?: P
  ): (payload?: P, stack?: boolean) => ReturnType<T>
  private withStack<T extends (payload: any) => any, P = Parameters<T>[0]>(
    callback: T,
    defaultPayload?: P
  ) {
    const func = (payload: P | void = defaultPayload, stack = true) => {
      stack && this.stackStart()
      const res: ReturnType<T> = callback(payload)
      stack && this.stackEnd()
      return res
    }
    return func
  }

  private initController() {
    this.itemController.on('node:refresh', (data: INode) => {
      this.emit('node:refresh', data)
    })
    this.itemController.on('node:change', (data: INode, type?: string) => {
      this.emit('node:change', data, type)
      this.emit(`node:change:${type}`, data)
    })
    this.itemController.on('node:deleted', (data: INode) => {
      this.emit('node:deleted', data)
    })
    this.itemController.on('node:added', (data: INode) => {
      this.emit('node:added', data)
    })
    this.itemController.on('edge:deleted', (data: IEdge) => {
      this.emit('edge:deleted', data)
    })
    this.itemController.on('edge:change', (edge: IEdge, type?: string) => {
      this.emit('edge:change', edge, type)
      this.emit(`edge:change:${type}`, edge)
    })
    this.itemController.on('edge:added', (data: IEdge) => {
      this.emit('edge:added', data)
    })
    this.itemController.on('port:change', (port: IPort, type: string) => {
      this.emit('port:change', port, type)
      this.emit(`${'port:change'}:${type}`, port)
    })
    this.itemController.on('port:added', (ports: IPort[]) =>
      this.emit('port:added', ports)
    )
    this.itemController.on('port:deleted', (ids: string[]) =>
      this.emit('port:deleted', ids)
    )
    this.itemController.on('datachange', (data: { needLayout: boolean }) => {
      data.needLayout && this.layout({}, false)
      this.emit('datachange')
    })
    this.layoutController.on('layout', () => {
      this.emit('layout')
    })
    this.store.on('add', (item: Item, prev?: Item) => {
      this.viewController.onAdd(item, prev)
    })
    this.store.on('remove', (item: Item) => {
      this.viewController.onRemove(item)
    })
  }

  set<K extends keyof ICfg>(key: K, val: ICfg[K]) {
    this.cfg[key] = val
  }

  get<T extends keyof ICfg>(key: T): ICfg[T] {
    return this.cfg[key]
  }

  getContainer(): HTMLElement {
    return this.container
  }

  getSvgInfo(): IRect {
    return this.viewController.svgInfo
  }

  getNodeInfo(): NodeInfo | undefined {
    return this.cfg.nodeInfo
  }
  getNodes(): INode[] {
    return this.itemController.getNodes()
  }

  findNode(id: string | number): INode | undefined {
    return this.itemController.findNode(String(id))
  }

  findNodeByState(state: string): INode[] {
    return this.itemController.findNodeByState(state)
  }

  findNodeByPort(id: string): INode | undefined {
    return this.itemController.findNodeByPort(id)
  }

  refreshNode(id: string): void {
    return this.itemController.refreshNode(id)
  }

  updateNode(id: string, model: INodeModel): void {
    return this.itemController.updateNode(id, model)
  }

  deleteNode(id: string, stack = true): INode | undefined {
    const func = this.itemController.deleteNode.bind(this.itemController)
    return this.withStack(func)(id, stack)
  }

  addNode(item: INodeModel, stack = true): INode | undefined {
    const func = this.itemController.addNode.bind(this.itemController)
    return this.withStack(func)(item, stack)
  }

  findPort(id: string | number): IPort | undefined {
    return this.itemController.findPort(String(id))
  }

  getEdges(): IEdge[] {
    return this.itemController.getEdges()
  }

  findEdge(id: string | number): IEdge | undefined {
    return this.itemController.findEdge(String(id))
  }

  findEdgeByState(state: string): IEdge[] {
    return this.itemController.findEdgeByState(state)
  }

  updateEdge(id: string, model: IEdgeModel): void {
    return this.itemController.updateEdge(id, model)
  }

  deleteEdge(id: string, stack = true): IEdge | undefined {
    const func = this.itemController.deleteEdge.bind(this.itemController)
    return this.withStack(func)(id, stack)
  }

  addEdge(item: IEdgeModel, stack = true): IEdge | undefined {
    const func = this.itemController.addEdge.bind(this.itemController)
    return this.withStack(func)(item, stack)
  }

  getDataModel(): IDataModel {
    return this.itemController.getDataModel()
  }

  getTreeDataModel() {
    return this.itemController.getTreeDataModel()
  }

  getPointByClient(originX: number, originY: number): { x: number; y: number } {
    return this.viewController.getPointByClient(originX, originY)
  }

  getTranslate() {
    return this.viewController.getTranslate()
  }

  translate(x: number, y: number) {
    return this.viewController.translateBy(x, y)
  }

  getZoom() {
    return this.viewController.getZoom()
  }

  zoom(value: number, e?: WheelEvent) {
    return this.viewController.zoom(value, e)
  }

  resize() {
    return this.viewController.resize()
  }

  fitView() {
    return this.viewController.fitView()
  }
  /**
   * 加载数据
   */
  data(data: IDataModel | INodeModel) {
    return this.itemController.data(data)
  }

  fitCenter() {
    return this.viewController.translateToCenter()
  }

  fullScreen(el?: HTMLElement) {
    return this.viewController.fullScreen(el)
  }

  layout(options: ILayout = {}, stack = true) {
    const func = this.layoutController.layout.bind(this.layoutController)
    return this.withStack(func, {})(options, stack)
  }

  removeAction(action?: string | string[]) {
    return this.eventController.removeBehavior(action)
  }

  addAction(actions: string | string[]) {
    this.eventController.addBehavior(
      Array.isArray(actions) ? actions : [actions]
    )
  }

  getNodesBBox(nodes: INode[]) {
    return this.viewController.getNodesBBox(nodes)
  }

  undo() {
    return this.stackController.undo()
  }

  redo() {
    return this.stackController.redo()
  }

  stackStart() {
    return this.stackController.start()
  }

  stackEnd() {
    return this.stackController.end()
  }
  getUndoStack(): IStack[] {
    return this.stackController.undoStack
  }

  getRedoStack(): IStack[] {
    return this.stackController.redoStack
  }

  detectDirectedCycle() {
    return detectDirectedCycle(this.getDataModel())
  }

  /**
   * 销毁
   */
  destroy() {
    const controllerKeys = [
      'stackController',
      'eventController',
      'itemController',
      'viewController',
      'layoutController'
    ] as const
    controllerKeys.forEach(key => {
      this[key].destroy()
      delete this[key]
    })
  }
}
