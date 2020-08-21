import LayoutController from './layout'
import ViewController from './view'
import EventController from './event'
import { NodeStore } from '@/stores/node'

export default class Graph {
  private config: { [key: string]: any }

  private svgDom!: HTMLElement

  private transformDom!: HTMLElement

  private viewController: any
  private layoutController: any
  private eventController: any

  nodes!: INodeType[]
  edges!: IEdgeType[]

  constructor(config: any) {
    this.init()
    this.config = config
    this.svgDom = config.containerDom
    this.transformDom = config.gDom
    this.nodes = config.data.nodes
    this.edges = config.data.edges
    this.viewController.rectInfo = config.rectInfo
  }

  private init() {
    this.layoutController = new LayoutController(this)
    this.eventController = new EventController(this)
    this.viewController = new ViewController(this)
  }

  public resize() {
    const bounding = this.svgDom.getBoundingClientRect()
    this.viewController.svgInfo = {
      x: bounding.x,
      y: bounding.y,
      width: bounding.width,
      height: bounding.height
    }
    this.layoutController.init()
  }

  public addNode(item: INodeType) {
    item.posX = this.viewController.positionTransformX(item.posX)
    item.posY = this.viewController.positionTransformX(item.posY)
    console.log(item)
    NodeStore.addNode(item)
  }

  /**
   * 销毁
   */
  public destroy() {
    this.eventController = null
    this.viewController = null
    this.layoutController = null
    window.removeEventListener('resize', this.resize)
  }
}
