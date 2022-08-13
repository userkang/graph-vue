import EventEmitter from '../util/event-emitter'
import LayoutController from './layout'
import ViewController from './view'
import EventController from './event'
import ItemController from './item'
import StackController from './stack'
import Svg from '../view/svg'
import Node from '../item/node'
import {
  ICfg,
  IEdge,
  INodeModel,
  IEdgeModel,
  IGraphConfig,
  NodeInfo,
  IDirection
} from '../types/index'
import detectDirectedCycle from '../util/acyclic'
import { IStack, Item } from '../types/type'
import Store from './store'

const getDefaultConfig = (): Pick<
  ICfg,
  'direction' | 'nodes' | 'edges' | 'action'
> => ({
  direction: 'TB',
  nodes: [],
  edges: [],
  action: []
})

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
  public cfg: ICfg

  readonly store: Store
  private readonly viewController: ViewController
  private readonly layoutController: LayoutController
  private readonly eventController: EventController
  private readonly itemController: ItemController
  private readonly stackController: StackController
  itemClassMap: Map<Item, string> = new Map()
  readonly $svg?: Svg
  readonly isRender: boolean
  readonly container: HTMLElement
  readonly direction: IDirection

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
    this.container = container

    this.direction = config.direction || 'TB'
    this.cfg = Object.assign(getDefaultConfig(), config, {
      brushing: false
    })

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

  get findNodeByState() {
    return this.itemController.findNodeByState.bind(this.itemController)
  }

  get findNodeByPort() {
    return this.itemController.findNodeByPort.bind(this.itemController)
  }

  get getNodes() {
    return this.itemController.getNodes.bind(this.itemController)
  }

  get findNode() {
    return this.itemController.findNode.bind(this.itemController)
  }

  get refreshNode() {
    return this.itemController.refreshNode.bind(this.itemController)
  }

  get updateNode() {
    return this.itemController.updateNode.bind(this.itemController)
  }

  get findPort() {
    return this.itemController.findPort.bind(this.itemController)
  }

  get findEdge() {
    return this.itemController.findEdge.bind(this.itemController)
  }

  get getEdges() {
    return this.itemController.getEdges.bind(this.itemController)
  }

  get getDataModel() {
    return this.itemController.getDataModel.bind(this.itemController)
  }

  get getTreeDataModel() {
    return this.itemController.getTreeDataModel.bind(this.itemController)
  }

  get findEdgeByState() {
    return this.itemController.findEdgeByState.bind(this.itemController)
  }

  get updateEdge() {
    return this.itemController.updateEdge.bind(this.itemController)
  }

  // 加载数据
  get data() {
    return this.itemController.data.bind(this.itemController)
  }

  get deleteNode() {
    return this.withStack(
      this.itemController.deleteNode.bind(this.itemController)
    )
  }

  get addNode() {
    return this.withStack(this.itemController.addNode.bind(this.itemController))
  }

  get deleteEdge() {
    return this.withStack(
      this.itemController.deleteEdge.bind(this.itemController)
    )
  }

  get addEdge() {
    return this.withStack(this.itemController.addEdge.bind(this.itemController))
  }

  get layout() {
    return this.withStack(
      this.layoutController.layout.bind(this.layoutController)
    )
  }

  get getPointByClient() {
    return this.viewController.getPointByClient.bind(this.viewController)
  }

  get getTranslate() {
    return this.viewController.getTranslate.bind(this.viewController)
  }

  get translate() {
    return this.viewController.translateBy.bind(this.viewController)
  }

  get getZoom() {
    return this.viewController.getZoom.bind(this.viewController)
  }

  get zoom() {
    return this.viewController.zoom.bind(this.viewController)
  }

  get resize() {
    return this.viewController.resize.bind(this.viewController)
  }

  get fitView() {
    return this.viewController.fitView.bind(this.viewController)
  }

  get fitCenter() {
    return this.viewController.translateToCenter.bind(this.viewController)
  }

  get fullScreen() {
    return this.viewController.fullScreen.bind(this.viewController)
  }

  get removeAction() {
    return this.eventController.removeBehavior.bind(this.eventController)
  }

  get getNodesBBox() {
    return this.viewController.getNodesBBox.bind(this.viewController)
  }

  get undo() {
    return this.stackController.undo.bind(this.stackController)
  }

  get redo() {
    return this.stackController.redo.bind(this.stackController)
  }

  get stackStart() {
    return this.stackController.start.bind(this.stackController)
  }

  get stackEnd() {
    return this.stackController.end.bind(this.stackController)
  }

  private withStack<T extends (payload: any) => any>(callback: T) {
    let shouldStack = true
    const func = (payload: Parameters<T>[0], stack = true) => {
      shouldStack = stack
      shouldStack && this.stackStart()
      const res: ReturnType<T> = callback(payload)
      shouldStack && this.stackEnd()
      return res
    }
    return func
  }

  private initController() {
    this.itemController.on('node:refresh', (data: Node) => {
      this.emit('node:refresh', data)
    })
    this.itemController.on('node:deleted', (data: INodeModel) => {
      this.emit('node:deleted', data)
    })
    this.itemController.on('node:change', (data: Node) => {
      this.emit('node:change', data)
    })
    this.itemController.on('node:added', (data: Node) => {
      this.emit('node:added', data)
    })
    this.itemController.on('edge:deleted', (data: IEdgeModel) => {
      this.emit('edge:deleted', data)
    })
    this.itemController.on('edge:change', (data: IEdge) => {
      this.emit('edge:change', data)
    })
    this.itemController.on('edge:added', (data: IEdge) => {
      this.emit('edge:added', data)
    })
    this.itemController.on('datachange', (data: { needLayout: boolean }) => {
      if (data.needLayout) {
        this.layout({}, false)
      }
      this.emit('datachange')
    })
    this.layoutController.on('layout', () => {
      this.emit('layout')
    })
  }

  public set<K extends keyof ICfg>(key: K, val: ICfg[K]) {
    this.cfg[key] = val
  }

  public get<T extends keyof ICfg>(key: T): ICfg[T] {
    return this.cfg[key]
  }

  public getContainer() {
    return this.container
  }

  public getSvgInfo() {
    return this.viewController.svgInfo
  }

  public getNodeInfo(): NodeInfo | undefined {
    return this.cfg.nodeInfo
  }

  public addAction(actions: string | string[]) {
    this.eventController.addBehavior(
      Array.isArray(actions) ? actions : [actions]
    )
  }

  public getUndoStack(): IStack[] {
    return this.stackController.undoStack
  }

  public getRedoStack(): IStack[] {
    return this.stackController.redoStack
  }

  public detectDirectedCycle() {
    return detectDirectedCycle(this.getDataModel())
  }

  /**
   * 销毁
   */
  public destroy() {
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
