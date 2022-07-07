import EventEmitter from '../util/event-emitter'
import LayoutController from './layout'
import ViewController from './view'
import EventController from './event'
import NodeController from './node'
import EdgeController from './edge'
import StackController from './stack'
import Svg from '../view/svg'
import {
  ICfg,
  INode,
  IEdge,
  IPort,
  IDataModel,
  INodeModel,
  IEdgeModel,
  IGraphConfig,
  IStack,
  IDataStack,
  ILayout,
  NodeInfo
} from '../types/index'
import detectDirectedCycle from '../util/acyclic'
import { isIDataModel, preorder } from '../util/utils'

const getDefaultConfig = () => ({
  direction: 'TB',
  nodes: [],
  edges: [],
  action: []
})

export default class Graph extends EventEmitter {
  public cfg: ICfg

  private viewController!: ViewController
  private layoutController!: LayoutController
  private eventController!: EventController
  private nodeController!: NodeController
  private edgeController!: EdgeController
  private stackController!: StackController

  constructor(config: IGraphConfig) {
    super()
    const container =
      config.container instanceof HTMLElement
        ? config.container
        : document.querySelector(config.container)
    if (!(container instanceof HTMLElement)) {
      throw new ReferenceError(`无效的container ${config.container}`)
    }

    this.cfg = Object.assign(getDefaultConfig(), config, { container })

    // 是否触发自带渲染
    const svg = container.querySelector('svg')
    this.set('isRender', !svg)
    if (!svg) {
      this.set('svg', new Svg(this))
    }
    this.initController()
    ;(window as any).graph = this
  }

  private initController() {
    this.viewController = new ViewController(this)
    this.layoutController = new LayoutController(this)
    this.eventController = new EventController(this)
    this.nodeController = new NodeController(this)
    this.edgeController = new EdgeController(this)
    this.stackController = new StackController(this)
  }

  public set<T = any>(key: string | object, val?: T) {
    if (Object.prototype.toString.call(key) === '[object Object]') {
      this.cfg = { ...this.cfg, ...(key as object) }
    } else {
      this.cfg[key as string] = val
    }
  }

  public get(key: string) {
    return this.cfg[key]
  }

  public getContainer() {
    return this.cfg.container
  }

  public getSvgInfo() {
    return this.viewController.svgInfo
  }

  public getNodeInfo(): NodeInfo | undefined {
    return this.cfg.nodeInfo
  }

  public getNodes(): INode[] {
    return this.nodeController.nodes
  }

  public findNode(id: string | number): INode | undefined {
    return this.nodeController.findNode(id)
  }

  public findNodeByState(state: string): INode[] {
    return this.getNodes().filter(item => {
      return item.hasState(state)
    })
  }

  public findNodeByPort(id: string): INode | undefined {
    return this.nodeController.findNodeByPort(id)
  }

  public refreshNode(id: string): void {
    const node = this.nodeController.findNode(id)
    if (!node) {
      return console.warn(`can't find node where id is '${id}'`)
    }
    this.nodeController.refreshNode(id)
    this.emit('node:refresh', node)
  }

  public updateNode(id: string, model: INodeModel): void {
    const node = this.nodeController.findNode(id)
    if (!node) {
      return console.warn(`can't find node where id is '${id}'`)
    }
    this.nodeController.updateNode(id, model)
    this.emit('node:change', node)
  }

  public realDeleteNode = (id: string): INode | undefined => {
    const node = this.findNode(id)
    if (!node) {
      console.warn(`can't delete node where id is '${id}'`)
      return
    }
    this.nodeController.deleteNode(id)
    this.emit('node:deleted', node.model)
    return node
  }
  public deleteNode(id: string, stack = true) {
    stack && this.stackStart()
    const res = this.realDeleteNode(id)
    stack && this.stackEnd()
    return res
  }

  public realAddNode = (item: INodeModel): INode | undefined => {
    const node = this.nodeController.addNode(item)
    if (!node) {
      return
    }
    this.emit('node:added', item)

    return node
  }

  public addNode(item: INodeModel, stack = true) {
    stack && this.stackStart()
    const res = this.realAddNode(item)
    stack && this.stackEnd()
    return res
  }

  public findPort(id: string | number): IPort | undefined {
    return this.nodeController.portsMap[String(id)]
  }

  public getEdges(): IEdge[] {
    return this.edgeController.edges
  }

  public findEdge(id: string | number): IEdge | undefined {
    return this.edgeController.findEdge(id)
  }

  public findEdgeByState(state: string): IEdge[] {
    return this.getEdges().filter(item => {
      return item.hasState(state)
    })
  }

  public updateEdge(id: string, model: IEdgeModel): void {
    const edge = this.edgeController.findEdge(id)
    if (!edge) {
      return console.warn(`can't find edge where id is '${id}'`)
    }
    this.edgeController.updateEdge(id, model)
    this.emit('edge:change', edge)
  }

  private realDeleteEdge = (id: string): IEdge | undefined => {
    const edge = this.edgeController.deleteEdge(id)
    if (!edge) {
      return
    }
    this.emit('edge:deleted', edge.model)
    return edge
  }
  public deleteEdge(id: string, stack = true) {
    stack && this.stackStart()
    const res = this.realDeleteEdge(id)
    stack && this.stackEnd()
    return res
  }

  public realAddEdge = (item: IEdgeModel): IEdge | undefined => {
    const edge = this.edgeController.addEdge(item)
    if (edge) {
      this.emit('edge:added', item)
    }
    return edge
  }

  public addEdge(item: IEdgeModel, stack = true) {
    stack && this.stackStart()
    const res = this.realAddEdge(item)
    stack && this.stackEnd()
    return res
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
    if (Object.keys(data).length === 0) {
      return
    }

    this.set('nodes', [])
    this.set('edges', [])
    this.clearItem()

    let model: IDataModel = { nodes: [], edges: [] }
    model = isIDataModel(data) ? (data as IDataModel) : preorder(data)
    const needLayout = model.nodes.every(
      node => !Number.isFinite(node.x) && !Number.isFinite(node.y)
    )

    this.nodeController.data(model.nodes)
    this.edgeController.data(model.edges)
    if (needLayout) {
      this.layout({}, false)
    }
    this.emit('datachange')
  }

  public fitCenter() {
    this.viewController.translateToCenter()
  }

  public fullScreen(el?: HTMLElement) {
    this.viewController.fullScreen(el)
  }

  private clearItem() {
    // 清除原有节点和边
    if (this.get('isRender')) {
      const nodeGroup = this.get('svg').get('nodeGroup')
      const edgeGroup = this.get('svg').get('edgeGroup')
      nodeGroup.remove()
      edgeGroup.remove()
    }
  }

  public layout(options: ILayout = {}, stack = true) {
    const layoutData = this.layoutController.layout(options, stack)
    this.emit('layout')
    return layoutData
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

  public pushStack(
    type: string,
    data: IDataStack,
    stackType = 'undo',
    stackData?: any
  ) {
    this.stackController.pushStack(type, data, stackType, stackData)
    this.emit('stackchange')
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
    this.stackController.clearStack()
    this.eventController.destroy()
    this.nodeController.destroy()
    this.edgeController.destroy()
    this.viewController.destroy()
    this.layoutController.destroy()
    ;(this.stackController as StackController | null) = null
    ;(this.eventController as EventController | null) = null
    ;(this.nodeController as NodeController | null) = null
    ;(this.edgeController as EdgeController | null) = null
    ;(this.viewController as ViewController | null) = null
    ;(this.layoutController as LayoutController | null) = null
  }
}
