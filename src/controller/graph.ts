import LayoutController from './layout'
import ViewController from './view'
import EventController from './event'
import MenuController from './menu'
import NodeController from './node'
import EdgeController from './edge'
import ImmutableController from './immutable'

export default class Graph {
  public config: { [key: string]: any }

  public viewController!: ViewController
  public layoutController!: LayoutController
  public eventController!: EventController
  public menuController!: MenuController
  public nodeController!: NodeController
  public edgeController!: EdgeController
  public immutableController!: ImmutableController

  public nodes!: INodeType[]
  public edges!: IEdgeType[]

  constructor(config: any) {
    (window as any).ddd = this
    this.config = config
    this.nodes = config.data.nodes
    this.edges = config.data.edges.map((item: IEdgeType) => {
      item.edgeId = item.fromNodeId + '' + item.toNodeId
      return item
    })
    this.initController()
  }

  private initController() {
    this.viewController = new ViewController(this)
    this.layoutController = new LayoutController(this)
    this.eventController = new EventController(this)
    this.nodeController = new NodeController(this)
    this.edgeController = new EdgeController(this)
    this.menuController = new MenuController(this)
    this.immutableController = new ImmutableController(this)
  }

  public addNode(item: INodeType) {
    item.posX = this.viewController.positionTransformX(item.posX)
    item.posY = this.viewController.positionTransformY(item.posY)
    this.nodeController.addNode(item)
  }

  undo() {
    const data = this.immutableController.undo()
    this.nodes = data.nodes
    this.edges = data.edges
  }

  redo() {
    const data = this.immutableController.redo()
    if (data) {
      this.nodes = data.nodes
      this.edges = data.edges
    }
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
    delete this.immutableController
  }
}
