import {
  isFullScreen,
  requestFullScreen,
  cancelFullScreen
} from '../util/utils'
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
    this.$container = graph.cfg.container.querySelector('svg')
    this.nodeInfo = graph.cfg.nodeInfo
    // this.translateToCenter()
    this.resize()
  }

  fullScreen(el?: HTMLElement) {
    if (isFullScreen()) {
      cancelFullScreen()
    } else {
      if (!el) {
        el = this.$container.parentNode as HTMLElement
      }
      requestFullScreen(el)
    }
  }

  // 让g的宽和高适应画布
  fitView() {
    // 先居中再放大
    this.translateToCenter()
    // 变换group的信息
    setTimeout(() => {
      const transformInfo = this.getGroupBox()

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
    })
  }

  caculateOffset() {
    this.transform.offsetX =
      (this.svgInfo.width * (this.transform.scale - 1)) / 2
    this.transform.offsetY =
      (this.svgInfo.height * (this.transform.scale - 1)) / 2
  }

  // 将g移动到画布中心区域
  translateToCenter() {
    // 在移动前先更新 svgInfo 信息，比较视图滚动后，svgInfo 需要重新获取
    this.resize()
    setTimeout(() => {
      // 这里需要到下一个周期获取g变换后的位置信息
      const transformInfo = this.getGroupBox()

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
    // 暂时去掉边界判断
    // 原因：1、性能考虑 2、在图过长的情况下，会带来图剩余部分显示不全的问题。
    // if (this.judgeBoundary(x, y)) {
    //   return
    // }

    this.transform.translateX += x
    this.transform.translateY += y
  }

  getGroupBox() {
    const clientRect = this.$container
      .querySelector('g')
      .getBoundingClientRect()
    return {
      x: clientRect.left,
      y: clientRect.top,
      width: clientRect.width,
      height: clientRect.height
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
    const bounding = this.$container.getBoundingClientRect()

    this.svgInfo = {
      x: bounding.left,
      y: bounding.top,
      width: bounding.width,
      height: bounding.height
    }

    if (width && height) {
      const x = ((this.svgInfo.width - width) * this.transform.scale) / 2
      const y = ((this.svgInfo.height - height) * this.transform.scale) / 2
      this.graph.translate(x, y)
      this.caculateOffset()
    }
  }

  judgeBoundary(x: number, y: number) {
    const transformInfo = this.getGroupBox()

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
