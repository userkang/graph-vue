import {
  isFullScreen,
  requestFullScreen,
  cancelFullScreen
} from '@/assets/js/utils'
import Graph from './graph'

export default class ViewController {
  graph: Graph

  public $container!: SVGElement

  // 画布宽高信息
  public svgInfo = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }

  public nodeInfo = {
    width: 190,
    height: 35
  }

  // 画布变换相关值
  public transform = {
    scale: 1,
    translateX: 0,
    translateY: 0,
    offsetX: 0,
    offsetY: 0
  }

  constructor(graph: Graph) {
    this.graph = graph
    this.$container = graph.config.container
    this.nodeInfo = graph.config.nodeInfo
    this.translateToCenter()
    this.resize()
  }

  expand() {
    if (this.transform.scale < 2) {
      this.graph.zoom(this.transform.scale + 0.1)
      this.caculateOffset()
    }
  }

  shrink() {
    if (this.transform.scale > 0.5) {
      this.graph.zoom(this.transform.scale - 0.1)
      this.caculateOffset()
    }
  }

  select() {
    const { graph } = this
    graph.eventController.isSelecting = !graph.eventController.isSelecting
  }

  reset() {
    this.graph.zoom(1)
    this.transform.offsetX = 0
    this.transform.offsetY = 0
  }

  fullScreen() {
    if (isFullScreen()) {
      cancelFullScreen()
    } else {
      requestFullScreen(document.documentElement)
    }
  }

  // 让g的宽和高适应画布
  fitView() {
    // 变换group的信息
    const transformInfo = (this.$container.querySelector(
      'g'
    ) as SVGElement).getBoundingClientRect()

    const vScale =
      (this.svgInfo.width / transformInfo.width) * this.transform.scale
    const hScale =
      (this.svgInfo.height / transformInfo.height) * this.transform.scale
    let scale = vScale < hScale ? vScale : hScale

    if (scale > 2) {
      scale = 2
    }

    if (scale < 0.5) {
      scale = 0.5
    }

    this.graph.zoom(scale)
    this.caculateOffset()

    this.translateToCenter()
  }

  caculateOffset() {
    this.transform.offsetX =
      (this.svgInfo.width * (this.transform.scale - 1)) / 2
    this.transform.offsetY =
      (this.svgInfo.height * (this.transform.scale - 1)) / 2
  }

  // 将g移动到画布中心区域
  translateToCenter() {
    setTimeout(() => {
      // 这里需要到下一个周期获取g变换后的位置信息
      const transformInfo = (this.$container.querySelector(
        'g'
      ) as SVGElement).getBoundingClientRect()

      // 变换g与画布左方和上方的距离
      const transformLeft = transformInfo.x - this.svgInfo.x
      const transformTop = transformInfo.y - this.svgInfo.y

      const translateX =
        ((this.svgInfo.width - transformInfo.width) / 2 - transformLeft) /
        this.transform.scale
      const translateY =
        ((this.svgInfo.height - transformInfo.height) / 2 - transformTop) /
        this.transform.scale

      this.graph.translate(translateX, translateY)
    })
  }

  translate(x: number, y: number) {
    if (this.judgeBoundary(x, y)) {
      return
    }

    this.transform.translateX += x
    this.transform.translateY += y
  }

  positionTransformX(originValue: number) {
    const posX = originValue - this.svgInfo.x
    return (
      (posX + this.transform.offsetX) / this.transform.scale -
      this.transform.translateX
    )
  }

  positionTransformY(originValue: number) {
    const posY = originValue - this.svgInfo.y
    return (
      (posY + this.transform.offsetY) / this.transform.scale -
      this.transform.translateY
    )
  }

  resize() {
    const bounding = this.$container.getBoundingClientRect()

    this.svgInfo = {
      x: bounding.x,
      y: bounding.y,
      width: bounding.width,
      height: bounding.height
    }
  }

  judgeBoundary(x: number, y: number) {
    const transformInfo = (this.$container.querySelector(
      'g'
    ) as SVGElement).getBoundingClientRect()

    const { height: gHeight, width: gWidth, x: gX, y: gY } = transformInfo
    //  右边界
    if (gX + 0.5 * gWidth >= this.svgInfo.x + this.svgInfo.width && x > 0) {
      return true
    }
    // 左边界
    if (gX + gWidth - 0.5 * gWidth <= this.svgInfo.x && x < 0) {
      return true
    }
    // 下边界
    if (gY + gHeight - 0.5 * gHeight <= this.svgInfo.y && y < 0) {
      return true
    }
    // 上边界
    if (gY + 0.5 * gHeight >= this.svgInfo.y + this.svgInfo.height && y > 0) {
      return true
    }

    return false
  }
}
