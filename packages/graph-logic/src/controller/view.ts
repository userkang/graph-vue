import { INode } from '../types'
import {
  isFullScreen,
  requestFullScreen,
  cancelFullScreen
} from '../util/utils'
import Graph, { useGraph } from './graph'
import edgeView from '../view/edge'
import nodeView from '../view/node'
import Node from '../item/node'
import Edge from '../item/edge'
import { Item } from '../types/type'
import Store from './store'

const getGroupName = (item: Item) => {
  if (item instanceof Node) {
    return 'nodeGroup'
  } else if (item instanceof Edge) {
    return 'edgeGroup'
  }
}

const createView = (item: Item, graph: Graph) => {
  if (item instanceof Node) {
    return new nodeView(item, graph)
  } else if (item instanceof Edge) {
    return new edgeView(item, graph)
  }
}

export default class ViewController {
  private $graph: Graph
  private readonly $store: Store
  public $svg!: SVGElement
  readonly resizeObserver: ResizeObserver

  // 画布宽高信息
  public svgInfo = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }

  // 画布变换相关值
  public transform = {
    scale: 1,
    translateX: 0,
    translateY: 0,
    offsetX: 0,
    offsetY: 0
  }

  public translatePadding = 10

  constructor() {
    this.$graph = useGraph()
    this.$store = useGraph().store
    this.$svg = this.$graph.getContainer().querySelector('svg') as SVGElement
    this.resizeObserver = new ResizeObserver(
      this.$graph.resize.bind(this.$graph)
    )
    this.resizeObserver.observe(this.$graph.container)
    this.resize()
  }

  private mountItem(item: Item) {
    const graph = this.$graph
    if (!graph?.isRender) {
      return
    }
    const groupName = getGroupName(item)
    if (!groupName) {
      return
    }
    const group = graph.$svg?.get(groupName)
    if (!group) {
      return
    }
    const view = createView(item, graph)
    if (!view) {
      return
    }
    group.add(view)
    this.$store.viewMap.set(item, view)
  }

  private unMountItem(item: Item) {
    const graph = this.$graph
    if (!graph?.isRender) {
      return
    }
    const groupName = getGroupName(item)
    if (!groupName) {
      return
    }
    const group = graph.$svg?.get(groupName)
    if (!group) {
      return
    }
    const view = this.$store.viewMap.get(item)
    if (!view) {
      return
    }
    group.remove(view)
    this.$store.viewMap.delete(item)
  }

  onAdd(item: Item, prev?: Item) {
    if (prev && prev !== item) {
      this.onRemove(prev)
    }
    this.mountItem(item)
  }

  onRemove(item: Item) {
    this.unMountItem(item)
  }

  getTranslate() {
    return {
      x: this.transform.translateX,
      y: this.transform.translateY
    }
  }

  public getZoom() {
    return this.transform.scale
  }

  public zoom(value: number, e?: WheelEvent) {
    const zoom = this.getZoom()
    if ((zoom < value && zoom < 5) || (zoom > value && zoom > 0.2)) {
      let dx = 0
      let dy = 0
      if (e) {
        const svgInfo = this.svgInfo
        const zoomChange = 1 / zoom - 1 / value
        dx = (svgInfo.x + svgInfo.width / 2 - e.x) * zoomChange
        dy = (svgInfo.y + svgInfo.height / 2 - e.y) * zoomChange
      }
      this.transform.scale = value
      this.translateBy(dx, dy)
      this.caculateOffset()
      this.$graph.emit('zoom', value, e)
    }
  }

  private updateSvgInfo() {
    const bounding = this.$svg.getBoundingClientRect()
    Object.assign(this.svgInfo, {
      x: bounding.left,
      y: bounding.top,
      width: bounding.width,
      height: bounding.height
    })
  }

  fullScreen(el?: HTMLElement) {
    if (isFullScreen()) {
      cancelFullScreen()
    } else {
      requestFullScreen(el || (this.$svg.parentElement as HTMLElement))
    }
    this.updateSvgInfo()
  }

  // 让g的宽和高适应画布
  fitView() {
    const fitZoom = () => {
      const nextZoom =
        Math.min(
          this.svgInfo.height / this.nodesBox.height,
          this.svgInfo.width / this.nodesBox.width
        ) * 0.95 // 四周留些空间好看些
      if (nextZoom !== this.getZoom()) {
        this.zoom(nextZoom)
      }
    }

    this.translateToCenter()
    fitZoom()
  }

  get nodesBox() {
    return this.getNodesBBox()
  }

  getNodesBBox(value?: INode[]) {
    const nodes = value || this.$graph.getNodes()
    const filterNodes = nodes.filter(item => !item.hasState('hide'))
    if (!filterNodes.length) {
      return { left: 0, top: 0, width: 0, height: 0 }
    }
    const startNode = filterNodes[0]
    let [minX, minY, maxX, maxY] = [
      startNode.x,
      startNode.y,
      startNode.x + startNode.width,
      startNode.y + startNode.height
    ]
    for (let i = filterNodes.length - 1; i > 0; i--) {
      const node = filterNodes[i]
      minX = Math.min(minX, node.x)
      minY = Math.min(minY, node.y)
      maxX = Math.max(maxX, node.x + node.width)
      maxY = Math.max(maxY, node.y + node.height)
    }
    return { left: minX, top: minY, width: maxX - minX, height: maxY - minY }
  }

  caculateOffset() {
    this.transform.offsetX =
      (this.svgInfo.width * (this.transform.scale - 1)) / 2
    this.transform.offsetY =
      (this.svgInfo.height * (this.transform.scale - 1)) / 2
  }

  translateTo = (x: number, y: number) => {
    const { left, top, width, height } = this.nodesBox
    const dx = -(this.transform.translateX + left + width / 2) + x
    const dy = -(this.transform.translateY + top + height / 2) + y
    this.translateBy(dx, dy)
  }

  // 将g移动到画布中心区域
  translateToCenter() {
    this.updateSvgInfo()
    const { width, height } = this.svgInfo
    this.translateTo(width / 2, height / 2)
  }

  fitTo(x: number = 0, y: number = 0) {
    this.updateSvgInfo()
    const svgCenterX = this.svgInfo.width / 2
    const svgCenterY = this.svgInfo.height / 2
    const dx = -this.transform.translateX + svgCenterX - x
    const dy = -this.transform.translateY + svgCenterY - y
    this.translateBy(dx, dy)
  }

  private translateX(x: number) {
    // 结果正确前提是 transformOrigin:center ，transformOrigin是以svgInfo为基准
    let nextTranslateX = this.transform.translateX + x
    const svgCenterX = this.svgInfo.width / 2
    const leftPart = svgCenterX - this.nodesBox.left
    // svgCenterX * (1 +- 1/this.transform.scale) - this.nodesBox.left
    if (nextTranslateX < 0) {
      const minTranslateX =
        leftPart -
        svgCenterX / this.transform.scale -
        this.nodesBox.width +
        this.translatePadding
      nextTranslateX = Math.max(nextTranslateX, minTranslateX)
    } else if (nextTranslateX > 0) {
      const maxTranslateX =
        leftPart + svgCenterX / this.transform.scale - this.translatePadding
      nextTranslateX = Math.min(nextTranslateX, maxTranslateX)
    }
    this.transform.translateX = nextTranslateX
  }

  private translateY(y: number) {
    let nextTranslateY = this.transform.translateY + y
    const svgCenterY = this.svgInfo.height / 2
    const topPart = svgCenterY - this.nodesBox.top
    if (nextTranslateY < 0) {
      const minTranslateY =
        topPart -
        svgCenterY / this.transform.scale -
        this.nodesBox.height +
        this.translatePadding
      nextTranslateY = Math.max(nextTranslateY, minTranslateY)
    } else if (nextTranslateY > 0) {
      const maxTranslateY =
        topPart + svgCenterY / this.transform.scale - this.translatePadding
      nextTranslateY = Math.min(nextTranslateY, maxTranslateY)
    }
    this.transform.translateY = nextTranslateY
  }

  public translateBy(x: number, y: number) {
    this.translateX(x)
    this.translateY(y)
    this.$graph.emit(
      'translate',
      this.transform.translateX,
      this.transform.translateY
    )
  }

  getPointByClient(originX: number, originY: number) {
    const posX = originX - this.svgInfo.x
    const posY = originY - this.svgInfo.y
    const x =
      (posX + this.transform.offsetX) / this.transform.scale -
      this.transform.translateX
    const y =
      (posY + this.transform.offsetY) / this.transform.scale -
      this.transform.translateY
    return { x, y }
  }

  resize() {
    const width = this.svgInfo.width
    const height = this.svgInfo.height
    this.updateSvgInfo()
    if (width && height) {
      const x = ((this.svgInfo.width - width) * this.transform.scale) / 2
      const y = ((this.svgInfo.height - height) * this.transform.scale) / 2
      this.translateBy(x, y)
      this.caculateOffset()
    }
  }

  destroy() {
    this.resizeObserver.disconnect()
    ;(this.$svg as SVGElement | null) = null
  }
}
