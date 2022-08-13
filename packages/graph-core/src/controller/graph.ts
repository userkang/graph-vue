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
  INode,
  IEdge,
  IPort,
  IDataModel,
  INodeModel,
  IEdgeModel,
  IGraphConfig,
  ILayout,
  NodeInfo,
  IDirection
} from '../types/index'
import detectDirectedCycle from '../util/acyclic'
import { isIDataModel, isKeyof, preorder, uniqueId } from '../util/utils'
import { IStack, Item } from '../types/type'
import Store from './store'
import Edge from '../item/edge'

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
  readonly graphId = uniqueId('graph')
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
    return this.itemController.findNodeByState
  }

  get findNodeByPort() {
    return this.itemController.findNodeByPort
  }

  initController() {
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

  public getNodes(): INode[] {
    return this.itemController.nodes
  }

  public findNode(id: string | number): INode | undefined {
    return this.itemController.findNode(String(id))
  }

  public refreshNode(id: string): void {
    return this.itemController.refreshNode(id)
  }

  public updateNode(id: string, model: INodeModel): void {
    this.itemController.updateNode(id, model)
  }

  public deleteNode(id: string, stack = true): INode | undefined {
    stack && this.stackStart()
    const node = this.itemController.deleteNode(id)
    stack && this.stackEnd()
    return node
  }

  public addNode(item: INodeModel, stack = true): INode | undefined {
    stack && this.stackStart()
    const node = this.itemController.addNode(item)
    stack && this.stackEnd()
    return node
  }

  public findPort(id: string | number): IPort | undefined {
    return this.itemController.portsMap[String(id)]
  }

  public getEdges(): IEdge[] {
    return this.itemController.edges
  }

  public findEdge(id: string | number): IEdge | undefined {
    return this.itemController.findEdge(id)
  }

  public findEdgeByState(state: string): IEdge[] {
    return this.getEdges().filter(item => item.hasState(state))
  }

  public updateEdge(id: string, model: IEdgeModel): void {
    this.itemController.updateEdge(id, model)
  }

  public deleteEdge(id: string, stack = true): IEdge | undefined {
    stack && this.stackStart()
    const edge = this.itemController.deleteEdge(id)
    stack && this.stackEnd()
    return edge
  }

  public addEdge(item: IEdgeModel, stack = true): IEdge | undefined {
    stack && this.stackStart()
    const edge = this.itemController.addEdge(item)
    stack && this.stackEnd()
    return edge
  }

  public getDataModel(): IDataModel {
    const nodes = this.getNodes().map(node => node.model)
    const edges = this.getEdges().map(edge => edge.model)
    return { nodes, edges }
  }

  public getTreeDataModel() {
    const nodes = this.getNodes().map(node => node.model)
    return nodes[0]
  }

  public getPointByClient(
    originX: number,
    originY: number
  ): { x: number; y: number } {
    return this.viewController.getPointByClient(originX, originY)
  }

  public getTranslate() {
    return {
      x: this.viewController.transform.translateX,
      y: this.viewController.transform.translateY
    }
  }

  public translate(x: number, y: number) {
    return this.viewController.translateBy(x, y)
  }

  public translateBy(x: number, y: number) {
    return this.viewController.translateBy(x, y)
  }

  public getZoom() {
    return this.viewController.getZoom()
  }

  public zoom(value: number, e?: WheelEvent) {
    return this.viewController.zoom(value, e)
  }

  public resize() {
    this.viewController.resize()
  }

  public fitView() {
    this.viewController.fitView()
  }
  // 加载数据
  public data(data: IDataModel | INodeModel) {
    this.itemController.data(data)
  }

  public fitCenter() {
    this.viewController.translateToCenter()
  }

  public fullScreen(el?: HTMLElement) {
    this.viewController.fullScreen(el)
  }

  public layout(options: ILayout = {}, stack = true) {
    return this.layoutController.layout(options, stack)
  }

  public removeAction(action?: string | string[]) {
    this.eventController.removeBehavior(action)
  }

  public addAction(actions: string | string[]) {
    this.eventController.addBehavior(
      Array.isArray(actions) ? actions : [actions]
    )
  }

  public getNodesBBox(nodes: INode[]) {
    return this.viewController.getNodesBBox(nodes)
  }

  public undo() {
    this.stackController.undo()
  }

  public redo() {
    this.stackController.redo()
  }

  public stackStart() {
    return this.stackController.start()
  }

  public stackEnd() {
    return this.stackController.end()
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
    ]
    controllerKeys.forEach(key => {
      if (isKeyof(key, this)) {
        ;(this[key] as any).destroy()
        delete this[key]
      }
    })
  }
}
