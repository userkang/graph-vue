import {
  isFullScreen,
  requestFullScreen,
  cancelFullScreen
} from '../util/utils'
import Graph from './graph'

export default class ViewController {
  graph: Graph

  public $svg!: SVGElement

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

  constructor(graph: Graph) {
    this.graph = graph
    this.$svg = graph.cfg.container.querySelector('svg') as SVGElement
    ;/Safari/.test(navigator.userAgent)
      ? setTimeout(() => this.resize())
      : this.resize()
  }

  public getZoom() {
    return this.transform.scale
  }

  public zoom(value: number, e?: WheelEvent) {
    const zoom = this.getZoom()
    if ((zoom < value && zoom < 2) || (zoom > value && zoom > 0.5)) {
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
      this.graph.emit('afterzoom', value, e)
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
    const nodes = this.graph.getNodes()
    let [minX, minY, maxX, maxY] = [
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER
    ]
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i]
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

  // 将g移动到画布中心区域
  translateToCenter() {
    this.updateSvgInfo()
    const dx =
      -this.transform.translateX -
      this.nodesBox.left +
      (this.svgInfo.width - this.nodesBox.width) / 2
    const dy =
      -this.transform.translateY -
      this.nodesBox.top +
      (this.svgInfo.height - this.nodesBox.height) / 2
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
    this.graph.emit(
      'aftertranslate',
      this.transform.translateX,
      this.transform.translateY
    )
  }

  fixMissView() {
    const visiableDom = this.$svg.querySelector('g[graph-type=slot]')
    if(visiableDom) {
      visiableDom.innerHTML = visiableDom.innerHTML
    }
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
    ;(this.graph as null | Graph) = null
    ;(this.$svg as SVGElement | null) = null
  }
}
