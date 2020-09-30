import EventEmitter from '@/assets/js/event-emitter'
import LayoutController from './layout'
import ViewController from './view'
import EventController from './event'
import MenuController from './menu'
import NodeController from './node'
import EdgeController from './edge'
import StackController from './stack'

export default class Graph extends EventEmitter {
  public config: { [key: string]: any }

  public viewController!: ViewController
  public layoutController!: LayoutController
  public eventController!: EventController
  public menuController!: MenuController
  public nodeController!: NodeController & { [key: string]: any }
  public edgeController!: EdgeController & { [key: string]: any }
  public stackController!: StackController

  public nodes: INodeType[] = []
  public edges: IEdgeType[] = []

  constructor(config: any) {
    super()
    this.config = config
    this.initController()
  }

  private initController() {
    this.viewController = new ViewController(this)
    this.layoutController = new LayoutController(this)
    this.eventController = new EventController(this)
    this.nodeController = new NodeController(this)
    this.edgeController = new EdgeController(this)
    this.menuController = new MenuController(this)
    this.stackController = new StackController(this)
  }

  public addNode(item: INodeType) {
    item.posX = this.viewController.positionTransformX(item.posX)
    item.posY = this.viewController.positionTransformY(item.posY)
    this.nodeController.addNode(item)
    this.emit('afteraddnode', item)
  }

  public addEdge(item: IEdgeType) {
    this.edgeController.addEdge(item)
    this.emit('afteraddedge', item)
  }

  public setNodeState(state: string, value: any) {
    this.nodeController[state] = value
  }

  public getNodeState(state: string) {
    return this.nodeController[state]
  }

  public setEdgeState(state: string, value: any) {
    this.edgeController[state] = value
  }

  public getEdgeState(state: string) {
    return this.edgeController[state]
  }

  public getZoom() {
    return this.viewController.transform.scale
  }

  public zoom(value: number) {
    this.viewController.transform.scale = value
    this.emit('afterzoom', value)
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

  public findNode(id: number) {
    return this.nodes.filter(item => {
      return id === item.nodeId
    })[0]
  }

  public findEdge(id: number) {
    return this.edges.filter(item => {
      return id === item.edgeId
    })
  }

  // 加载数据
  data(data: IDataItem) {
    this.nodes = JSON.parse(JSON.stringify(data.nodes))
    this.edges = JSON.parse(JSON.stringify(data.edges)).map(
      (item: IEdgeType) => {
        item.edgeId = item.fromNodeId + '' + item.toNodeId
        return item
      }
    )
  }

  getNodes() {
    return this.nodes
  }

  getEdges() {
    return this.edges
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
    delete this.menuController
    delete this.stackController
  }
}
