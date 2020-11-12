import EventEmitter from '../util/event-emitter'
import LayoutController from './layout'
import ViewController from './view'
import EventController from './event'
import NodeController from './node'
import EdgeController from './edge'
import StackController from './stack'

export default class Graph extends EventEmitter {
  public cfg: { [key: string]: any }

  public viewController: ViewController
  public layoutController: LayoutController
  public eventController: EventController
  public nodeController: NodeController & { [key: string]: any }
  public edgeController: EdgeController & { [key: string]: any }
  public stackController: StackController

  constructor(config: any) {
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

  public addNode(item: INodeModel) {
    this.nodeController.addNode(item)
    this.emit('afteraddnode', item)
  }

  public addEdge(item: IEdgeModel) {
    this.edgeController.addEdge(item)
    this.emit('afteraddedge', item)
  }

  public getSvgInfo() {
    return this.viewController.svgInfo
  }

  deleteNode(id: string) {
    const node = this.findNode(id)
    // node.set('edges', [])
    this.nodeController.deleteNode(id)
    this.emit('afterremovenode', node)
  }

  deleteEdge(id: string) {
    const edge = this.findEdge(id)
    edge.fromSlot.clearState('linked')
    edge.toSlot.clearState('linked')

    edge.fromNode.deleteEdge(id)
    edge.toNode.deleteEdge(id)

    this.edgeController.deleteEdge(id)

    this.emit('afterremoveedge', edge)
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

  public findNode(id: string) {
    return this.getNodes().find(item => {
      return id === item.id
    })
  }

  public findEdge(id: string) {
    return this.getEdges().find(item => {
      return id === item.id
    })
  }

  public findSlot(id: string) {
    const nodes = this.getNodes()
    for (let i = 0; i < nodes.length; i++) {
      const slot = nodes[i].slots.find(slot => {
        return slot.id === id
      })
      if (slot) {
        return slot
      }
    }
  }

  // 加载数据
  data(data: IDataModel) {
    // TODO 判断有没有坐标，没有的话需要先格式化

    data.nodes.forEach(node => {
      this.nodeController.addNode(node)
    })
    data.edges.forEach(edge => {
      this.edgeController.addEdge(edge)
    })

    this.emit('refreshgraph')
  }

  getNodeInfo() {
    return this.viewController.nodeInfo
  }

  getNodes() {
    return this.get('nodes')
  }

  getEdges() {
    return this.get('edges')
  }

  getBrushing() {
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
