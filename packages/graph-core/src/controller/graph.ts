import EventEmitter from '../util/event-emitter'
import LayoutController from './layout'
import ViewController from './view'
import EventController from './event'
import NodeController from './node'
import EdgeController from './edge'
import StackController from './stack'
import {
  INode,
  IEdge,
  ISlot,
  IDataModel,
  INodeModel,
  IEdgeModel,
  IGraphConfig,
  IStack,
  IEdgeStack,
  IDataStack
} from '../types/index'

export default class Graph extends EventEmitter {
  public cfg: { [key: string]: any }

  public viewController = null
  public layoutController: LayoutController
  public eventController: EventController
  public nodeController: NodeController
  public edgeController: EdgeController
  public stackController: StackController

  constructor(config: IGraphConfig) {
    super()
    this.cfg = Object.assign({}, this.getDefaultCfg(), config)
    this.initController()
  }

  private initController() {
    this.viewController = new ViewController(this)
    this.layoutController = new LayoutController(this)
    this.eventController = new EventController(this)
    this.nodeController = new NodeController(this)
    this.edgeController = new EdgeController(this)
    this.stackController = new StackController(this)
  }

  public getDefaultCfg() {
    return {
      container: undefined,
      drection: 'TB',
      nodes: [],
      edges: [],
      action: []
    }
  }

  public getPointByClient(originX: number, originY: number) {
    return this.viewController.getPointByClient(originX, originY)
  }

  public set<T = any>(key: string | object, val?: T): Graph {
    if (Object.prototype.toString.call(key) === '[object Object]') {
      this.cfg = { ...this.cfg, ...(key as object) }
    } else {
      this.cfg[key as string] = val
    }
    return this
  }

  public get(key: string) {
    return this.cfg[key]
  }

  public addNode(item: INodeModel, stack: boolean = true) {
    const node = this.nodeController.addNode(item)
    this.emit('afteraddnode', item)
    if (stack) {
      const data = { nodes: [{ id: node.id, model: { ...item } }] }
      this.pushStack('addNode', data)
    }
    return node
  }

  public addEdge(item: IEdgeModel, stack: boolean = true) {
    const edge = this.edgeController.addEdge(item)
    this.emit('afteraddedge', item)
    if (stack) {
      // this.pushStack('addEdge', [{ id: edge.id, model: { ...item } }])
    }
    return edge
  }

  public getSvgInfo() {
    return this.viewController.svgInfo
  }

  deleteNode(id: string, stack: boolean = true) {
    const node = this.findNode(id)
    if (!node) {
      return
    }

    if (stack) {
      const data: IDataStack = {}
      data.nodes = [{ id: node.id, model: { ...node.model } }]
      data.edges = node.edges.map(item => {
        return {
          id: item.id,
          model: { ...item.model }
        } as IEdgeStack
      })
      this.pushStack('deleteNode', data)
    }

    // 先删除与节点相关的边
    const edgeIds = node.edges.map(edge => edge.id)
    edgeIds.forEach(item => {
      this.deleteEdge(item)
    })

    this.nodeController.deleteNode(id)
    this.emit('afterdeletenode', node.model)

    return node
  }

  deleteEdge(id: string, stack: boolean = true) {
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

    // 删除数据中的边
    this.edgeController.deleteEdge(id)

    this.emit('afterdeleteedge', edge.model)

    if (stack) {
      // this.pushStack('deleteNode', [{ id: edge.id, model: { ...edge.model } }])
    }

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

  public layout() {
    this.layoutController.layout()
    this.emit('afterlayout')
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

  public findNodeByState(state): INode[] {
    return this.getNodes().filter(item => {
      return item.hasState(state)
    })
  }

  public findEdgeByState(state): IEdge[] {
    return this.getEdges().filter(item => {
      return item.hasState(state)
    })
  }

  // 加载数据
  data(data: IDataModel) {
    this.set('nodes', [])
    this.set('edges', [])

    // TODO 判断有没有坐标(对于纯展示的场景)，没有的话需要先格式化
    data.nodes.forEach((node: INodeModel) => {
      this.nodeController.addNode(node)
    })
    data.edges.forEach((edge: IEdgeModel) => {
      this.edgeController.addEdge(edge)
    })

    const edges = this.getEdges()
    edges.forEach(item => {
      item.fromSlot.setState('linked')
      item.toSlot.setState('linked')
    })

    this.emit('afterdatachange')
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

  getBrushing(): boolean {
    return this.get('brushing')
  }

  setBrushing(value: boolean) {
    this.set('brushing', value)
  }

  undo() {
    this.stackController.undo()
  }

  redo() {
    this.stackController.redo()
  }

  pushStack(type: string, data: IDataStack, stackType = 'undo') {
    this.stackController.pushStack(type, data, stackType)
    this.emit('afterstackchange')
  }

  getUndoStack(): IStack[] {
    return this.stackController.undoStack
  }

  getRndoStack(): IStack[] {
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
