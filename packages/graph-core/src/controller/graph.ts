import EventEmitter from '../util/event-emitter'
import LayoutController from './layout'
import ViewController from './view'
import EventController from './event'
import NodeController from './node'
import EdgeController from './edge'
import StackController from './stack'
import Svg from '../view/svg'
import {
  CFG,
  INode,
  IEdge,
  ISlot,
  IDataModel,
  INodeModel,
  IEdgeModel,
  IGraphConfig,
  IStack,
  IDataStack,
  ILayout
} from '../types/index'
import detectDirectedCycle from '../util/acyclic'

const getDefaultConfig = () => ({
  direction: 'TB',
  nodes: [],
  edges: [],
  action: []
})

export default class Graph extends EventEmitter {
  public cfg: CFG

  public viewController: ViewController
  public layoutController: LayoutController
  public eventController: EventController
  public nodeController: NodeController
  public edgeController: EdgeController
  public stackController: StackController

  constructor(config: IGraphConfig) {
    const container =
      config.container instanceof HTMLElement
        ? config.container
        : document.querySelector(config.container)
    if (!(container instanceof HTMLElement)) {
      throw new ReferenceError(`无效的container ${config.container}`)
    }
    super()
    this.cfg = Object.assign(getDefaultConfig(), config, { container })

    // 是否触发自带渲染
    const svg = container.querySelector('svg')
    this.set('isRender', !svg)
    if (!svg) {
      this.set('svg', new Svg(this))
    }
    this.initController()
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

  private initController() {
    this.viewController = new ViewController(this)
    this.layoutController = new LayoutController(this)
    this.eventController = new EventController(this)
    this.nodeController = new NodeController(this)
    this.edgeController = new EdgeController(this)
    this.stackController = new StackController(this)
  }

  public getPointByClient(
    originX: number,
    originY: number
  ): { x: number; y: number } {
    return this.viewController.getPointByClient(originX, originY)
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

  public getSvgInfo() {
    return this.viewController.svgInfo
  }

  getNodes(): INode[] {
    return this.nodeController.nodes
  }

  public findNode(id: string | number): INode {
    return this.nodeController.findNode(id)
  }

  refreshNode(id: string) {
    const node = this.nodeController.refreshNode(id)
    if (node) {
      this.emit('afternoderefresh', node.model)
    }
    return node
  }

  deleteNode(id: string, stack = true) {
    const node = this.nodeController.deleteNode(id, stack)
    if (node) {
      this.emit('afterdeletenode', node.model)
      if (stack) {
        this.pushStack('deleteNode', {
          nodes: [node.model],
          edges: node.edges.map(edge => edge.model as IEdgeModel)
        })
      }
    }
    return node
  }

  updateNode(id: string, model: INodeModel) {
    const node = this.nodeController.updateNode(id, model)
    if (node) {
      this.emit('afternodeupdate', node.model)
    }
    return node
  }

  public addNode(item: INodeModel, stack = true): INode | false {
    const node = this.nodeController.addNode(item, stack)
    if (node) {
      this.emit('afteraddnode', item)
      if (stack) {
        const data = { nodes: [item] }
        this.pushStack('addNode', data)
      }
    }
    return node
  }

  getEdges(): IEdge[] {
    return this.edgeController.edges
  }

  updateEdge(id: string, model: IEdgeModel) {
    const edge = this.edgeController.updateEdge(id, model)
    if (edge) {
      this.emit('afteredgeupdate', edge.model)
    }
    return edge
  }

  deleteEdge(id: string, stack: boolean = true) {
    const edge = this.edgeController.deleteEdge(id, stack)
    if (edge) {
      this.emit('afterdeleteedge', edge.model)
      if (stack) {
        this.pushStack('deleteEdge', { edges: [edge.model as IEdgeModel] })
      }
    }

    return edge
  }

  public addEdge(item: IEdgeModel, stack: boolean = true) {
    const edge = this.edgeController.addEdge(item, stack)
    if (edge) {
      this.emit('afteraddedge', item)
      if (stack) {
        this.pushStack('addEdge', { edges: [item] })
      }
    }
    return edge
  }

  public getZoom() {
    return this.viewController.getZoom()
  }

  public zoom(value: number) {
    return this.viewController.zoom(value)
  }

  public layout(options: ILayout = {}) {
    this.layoutController.layout(options)
    this.emit('afterlayout')
  }

  public getTranslate() {
    return {
      x: this.viewController.transform.translateX,
      y: this.viewController.transform.translateY
    }
  }

  public translate(x: number, y: number) {
    return this.viewController.translate(x, y)
  }

  public findEdge(id: string | number) {
    return this.edgeController.findEdge(id)
  }

  public findSlot(id: string | number): ISlot | undefined {
    return this.nodeController.slotsMap[String(id)]
  }

  public findNodeBySlot(id: string) {
    return this.nodeController.findNodeBySlot(id)
  }

  public findNodeByState(state: string): INode[] {
    return this.getNodes().filter(item => {
      return item.hasState(state)
    })
  }

  public findEdgeByState(state: string): IEdge[] {
    return this.getEdges().filter(item => {
      return item.hasState(state)
    })
  }

  // 加载数据
  data(data: IDataModel) {
    this.clearItem()
    // TODO 判断有没有坐标(对于纯展示的场景)，没有的话需要先格式化
    this.nodeController.data(data.nodes)
    this.edgeController.data(data.edges)

    this.emit('datachange')
  }

  getNodeInfo() {
    return this.cfg.nodeInfo
  }

  getData(): IDataModel {
    const nodes = this.getNodes().map(node => node.model)
    const edges = this.getEdges().map(edge => edge.model) as IEdgeModel[]
    return { nodes, edges }
  }

  addAction(actions: string | string[]) {
    this.eventController.addBehavior(
      Array.isArray(actions) ? actions : [actions]
    )
  }

  removeAction(action?: string | string[]) {
    this.eventController.removeBehavior(action)
  }

  undo() {
    this.stackController.undo()
  }

  redo() {
    this.stackController.redo()
  }

  pushStack(type: string, data: IDataStack, stackType = 'undo') {
    this.stackController.pushStack(type, data, stackType)
    this.emit('stackchange')
  }

  getUndoStack(): IStack[] {
    return this.stackController.undoStack
  }

  getRedoStack(): IStack[] {
    return this.stackController.redoStack
  }

  resize() {
    this.viewController.resize()
  }

  fitView() {
    this.viewController.fitView()
  }

  fitCenter() {
    this.viewController.translateToCenter()
  }

  fullScreen(el?: HTMLElement) {
    this.viewController.fullScreen(el)
  }

  detectDirectedCycle() {
    console.log(this.getData())
    return detectDirectedCycle(this.getData())
  }

  /**
   * 销毁
   */
  public destroy() {
    this.eventController.destroy()

    delete this.eventController
    delete this.viewController
    delete this.layoutController
    delete this.nodeController
    delete this.edgeController
    delete this.stackController
  }
}
