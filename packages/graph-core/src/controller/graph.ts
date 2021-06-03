import EventEmitter from '../util/event-emitter'
import LayoutController from './layout'
import ViewController from './view'
import EventController from './event'
import NodeController from './node'
import EdgeController from './edge'
import StackController from './stack'
import Svg from '../view/svg'
import {
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
import { isIDataModel, preorder } from '../util/utils'

export default class Graph extends EventEmitter {
  public cfg: { [key: string]: any }

  public viewController: ViewController
  public layoutController: LayoutController
  public eventController: EventController
  public nodeController: NodeController
  public edgeController: EdgeController
  public stackController: StackController

  constructor(config: IGraphConfig) {
    super()
    this.cfg = Object.assign({}, this.getDefaultCfg(), config)

    // 是否触发自带渲染
    const isRender = !this.get('container').querySelector('svg')
    this.set('isRender', isRender)
    if (isRender) {
      this.render()
    }
    this.initController()
  }

  private render() {
    const svg = new Svg(this)
    this.set('svg', svg)
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

  private getDefaultCfg() {
    return {
      container: undefined,
      drection: 'TB',
      nodes: [],
      edges: [],
      action: []
    }
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

  public addNode(item: INodeModel, stack: boolean = true): INode {
    if (item.id && this.findNode(item.id)) {
      console.warn(
        `The node already exists. Make sure the ID %c${item.id}%c  is uniqued`
      )
      return
    }

    const node = this.nodeController.addNode(item)
    this.emit('afteraddnode', item)
    if (stack) {
      const data = { nodes: [item] }
      this.pushStack('addNode', data)
    }
    return node
  }

  public addEdge(item: IEdgeModel, stack: boolean = true): IEdge {
    const edge = this.edgeController.addEdge(item)
    this.emit('afteraddedge', item)
    if (stack) {
      const data = { edges: [item] }
      this.pushStack('addEdge', data)
    }

    return edge
  }

  public getSvgInfo() {
    return this.viewController.svgInfo
  }

  deleteNode(id: string, stack: boolean = true): INode {
    const node = this.findNode(id)
    if (!node) {
      return
    }

    if (stack) {
      const data: IDataStack = {}
      data.nodes = [node.model]
      data.edges = node.edges.map(item => {
        return item.model as IEdgeModel
      })
      this.pushStack('deleteNode', data)
    }

    // 先删除与节点相关的边
    const edgeIds = node.edges.map(edge => edge.id)
    edgeIds.forEach(item => {
      this.deleteEdge(item, false)
    })

    this.nodeController.deleteNode(node)
    this.emit('afterdeletenode', node.model)

    return node
  }

  updateNode(id: string, model: INodeModel): INode {
    const node = this.findNode(id)
    node.update(model)
    this.emit('afternodeupdate', node.model)

    return node
  }

  updateEdge(id: string, model: IEdgeModel): IEdge {
    const edge = this.findEdge(id)
    edge.update(model)
    this.emit('afteredgeupdate', edge.model)

    return edge
  }

  refreshNode(id: string) {
    const node = this.findNode(id)
    node.refresh()
    this.emit('afternoderefresh', node.model)
  }

  deleteEdge(id: string, stack: boolean = true): IEdge {
    const edge = this.findEdge(id)
    if (!edge) {
      return
    }

    // 先删除前后节点的相关边
    edge.fromNode.deleteEdge(id)
    edge.toNode.deleteEdge(id)

    // 如果边两端的 slot 没有其他边连接，就清除该 slot 的 linked 状态
    const hasFromSlotLinked = edge.fromNode.edges.find(
      item => item.fromSlot.id === edge.fromSlot.id
    )
    const hasToSlotLinked = edge.toNode.edges.find(
      item => item.toSlot.id === edge.toSlot.id
    )

    if (!hasFromSlotLinked) {
      edge.fromSlot.clearState('linked')
    }

    if (!hasToSlotLinked) {
      edge.toSlot.clearState('linked')
    }

    if (stack) {
      this.pushStack('deleteEdge', { edges: [edge.model as IEdgeModel] })
    }

    // 删除数据中的边
    this.edgeController.deleteEdge(edge)

    this.emit('afterdeleteedge', edge.model)

    return edge
  }

  public getZoom() {
    return this.viewController.transform.scale
  }

  public zoom(value: number) {
    const zoom = this.getZoom()
    if ((zoom < value && zoom < 2) || (zoom > value && zoom > 0.5)) {
      this.viewController.transform.scale = value

      this.viewController.caculateOffset()
      this.emit('afterzoom', value)
    }
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
    this.viewController.translate(x, y)
    this.emit(
      'aftertranslate',
      this.viewController.transform.translateX,
      this.viewController.transform.translateY
    )
  }

  public findNode(id: string | number): INode {
    const _id = String(id)
    return this.getNodes().find(item => {
      return _id === item.id
    })
  }

  public findEdge(id: string | number): IEdge {
    const _id = String(id)
    return this.getEdges().find(item => {
      return _id === item.id
    })
  }

  public findSlot(id: string | number): ISlot {
    const _id = String(id)
    const nodes = this.getNodes()
    for (const node of nodes) {
      const slot = node.slots.find(item => {
        return item.id === _id
      })
      if (slot) {
        return slot
      }
    }
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
  data(data: IDataModel | INodeModel) {
    this.set('nodes', [])
    this.set('edges', [])
    this.clearItem()

    let imodel: IDataModel = { nodes: [], edges: [] }
    imodel = isIDataModel(data) ? (data as IDataModel) : preorder(data)
    const needLayout = imodel.nodes.every(
      node => !Number.isFinite(node.x) && !Number.isFinite(node.y)
    )
    imodel.nodes.forEach(node =>
      Object.assign(node, {
        x: node.x || 1,
        y: node.y || 1
      })
    )
    // TODO 判断有没有坐标(对于纯展示的场景)，没有的话需要先格式化
    imodel.nodes.forEach((node: INodeModel) => {
      this.nodeController.addNode(node)
    })
    imodel.edges.forEach((edge: IEdgeModel) => {
      this.edgeController.addEdge(edge)
    })
    if (needLayout) {
      this.layout()
    }
    this.emit('datachange')
  }

  getNodeInfo() {
    return this.viewController.nodeInfo
  }

  getNodes(): INode[] {
    return this.get('nodes')
  }

  getEdges(): IEdge[] {
    return this.get('edges')
  }

  addAction(action: string | string[]) {
    const actions = !Array.isArray(action) ? [action] : action
    this.eventController.addBehavior(actions)
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
