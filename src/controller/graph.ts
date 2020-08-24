import LayoutController from './layout'
import ViewController from './view'
import EventController from './event'
import MenuController from './menu'
import NodeController from './node'
import EdgeController from './edge'

export default class Graph {
  private config: { [key: string]: any }

  private $container!: SVGElement

  public viewController: any
  public layoutController: any
  public eventController: any
  public menuController: any
  public nodeController: any
  public edgeController: any

  public nodes!: INodeType[]
  public edges!: IEdgeType[]

  constructor(config: any) {
    this.init()
    this.$container = config.container
    this.config = config
    this.nodes = config.data.nodes
    this.edges = config.data.edges
    this.viewController.rectInfo = config.rectInfo
    this.viewController.resize()
  }

  private init() {
    this.viewController = new ViewController(this)
    this.layoutController = new LayoutController(this)
    this.nodeController = new NodeController(this)
    this.edgeController = new EdgeController(this)
    this.eventController = new EventController(this)
    this.menuController = new MenuController(this)
  }

  public addNode(item: INodeType) {
    item.posX = this.viewController.positionTransformX(item.posX)
    item.posY = this.viewController.positionTransformY(item.posY)
    this.nodeController.addNode(item)
  }

  /**
   * 销毁
   */
  public destroy() {
    this.eventController.destroy()

    this.eventController = null
    this.viewController = null
    this.layoutController = null
  }
}
