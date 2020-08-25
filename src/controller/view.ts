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
  private svgInfo = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }

  public rectInfo = {
    width: 190,
    height: 35,
    rx: 2,
    ry: 2
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
    this.translateToCenter()
  }

  expand() {
    if (this.transform.scale < 2) {
      this.transform.scale += 0.1
      this.caculateOffset()
    }
  }

  shrink() {
    if (this.transform.scale > 0.5) {
      this.transform.scale -= 0.1
      this.caculateOffset()
    }
  }

  select() {
    const { graph } = this
    graph.eventController.isSelecting = !graph.eventController.isSelecting
  }

  reset() {
    this.transform.scale = 1
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

    this.transform.scale = scale
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

      this.transform.translateX += translateX
      this.transform.translateY += translateY
    })
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

  public resize() {
    const bounding = this.$container.getBoundingClientRect()

    this.svgInfo = {
      x: bounding.x,
      y: bounding.y,
      width: bounding.width,
      height: bounding.height
    }
  }

  getCanTranslateDirection() {
    const enum Direction {
      UP = 'UP',
      DOWN = 'DOWN',
      LEFT = 'LEFT',
      RIGHT = 'RIGHT'
    }
    const directions = [
      Direction.UP,
      Direction.DOWN,
      Direction.LEFT,
      Direction.RIGHT
    ]
    const $el_svg = this.graph.svgDom
    const $el_g = this.graph.transformDom
    const {
      height: svg_h,
      width: svg_w,
      x: svg_x,
      y: svg_y
    } = $el_svg.getBoundingClientRect()
    const {
      height: g_h,
      width: g_w,
      x: g_x,
      y: g_y
    } = $el_g.getBoundingClientRect()
    // bottom right
    const br = [g_x + g_w, g_y + g_h]
    // 1. 左边线快要淹没到右边了
    if (g_x + 0.5 * g_w >= svg_x + svg_w) {
      removeAction(Direction.RIGHT)
    }
    // 2. 右边线快要淹没到左边了
    if (br[0] - 0.5 * g_w <= svg_x) {
      removeAction(Direction.LEFT)
    }
    // 3. 下边的线快要淹没到上边了
    if (br[1] - 0.5 * g_h <= svg_y) {
      removeAction(Direction.UP)
    }
    // 4. 上边的线快要淹没到下边了
    if (g_y + 0.5 * g_h >= svg_y + svg_h) {
      removeAction(Direction.DOWN)
    }

    function removeAction(direction: Direction) {
      const index = directions.findIndex(item => item === direction)
      directions.splice(index, 1)
    }
    return directions
  }
}
