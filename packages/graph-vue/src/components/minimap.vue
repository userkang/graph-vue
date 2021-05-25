<template>
  <div class="Minimap" ref="root" :style="rootStyle">
    <svg
      :width="width"
      :height="height"
      xmlns="http://www.w3.org/2000/svg"
      class="graph-svg"
      id="minimap"
      ref="map"
    >
      <g :style="gStyle" v-html="svgHTML"></g>
    </svg>
    <div class="viewport" :style="viewportStyle" @mousedown="onMousedown">
      <div class="viewport-resize" @mousedown.stop="onVpResizedown"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import {
  Graph,
  IDataModel,
  INodeModel,
  IEdgeModel,
  INode,
  IEdge
} from '@datafe/graph-core'
@Component
export default class Minimap extends Vue {
  @Prop()
  graph?: Graph

  svgHTML = ''
  width = 320
  height = 0

  mousedown?: { x: number; y: number }
  prevMove = { x: 0, y: 0 }
  prevVpmove?: { x: number; y: number }

  @Watch('graph')
  watchGraph() {
    if (this.graph) {
      this.graph.on('datachange', this.initMinimap)
    }
  }
  get scale() {
    if (this.graph?.viewController?.svgInfo?.width) {
      return this.width / this.graph.viewController.svgInfo.width
    }
    return 1
  }
  get svgInfo() {
    return this.graph.viewController.svgInfo
  }
  get transform() {
    return this.graph.viewController.transform
  }
  get rootStyle() {
    return {
      width: `${this.width}px`,
      height: `${this.height}px`
    }
  }

  get padding() {
    let left = Number.MAX_SAFE_INTEGER
    let top = Number.MAX_SAFE_INTEGER
    const nodes = this.graph.getNodes()
    for (let index = nodes.length - 1; index >= 0; index--) {
      left = Math.min(nodes[index].x, left)
      top = Math.min(nodes[index].y, top)
    }
    return { left, top }
  }

  get gStyle() {
    return {
      transform: `scale(${this.scale}) translate3D(${0}px, ${0}px, 0)`
    }
  }

  get viewportRect() {
    const svgInfo = this.graph.viewController.svgInfo
    const transform = this.graph.viewController.transform
    const width = this.width / transform.scale
    const height = (svgInfo.height * this.scale) / transform.scale

    const left =
      (-transform.translateX + transform.offsetX / transform.scale) * this.scale
    const top =
      (-transform.translateY + transform.offsetY / transform.scale) * this.scale
    return { width, height, left, top }
  }

  get viewportStyle() {
    const { width, height, left, top } = this.viewportRect
    return {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate3D(${left}px, ${top}px, 0)`
    }
  }

  initMinimap() {
    if (!this.graph) {
      return
    }
    const svgInfo = this.graph.viewController.svgInfo

    let maxY = Number.MIN_SAFE_INTEGER
    const nodes = this.graph.getNodes()
    for (let i = nodes.length - 1; i >= 0; i--) {
      maxY = Math.max(maxY, nodes[i].y + nodes[i].height)
    }
    this.height = (maxY + Math.max(svgInfo.y, 0)) * this.scale

    const g = this.graph.viewController.$container.querySelector('g')
    if (g) {
      this.svgHTML = g.innerHTML
    }
    window.requestAnimationFrame(this.initMinimap)
  }

  onMousedown(e: MouseEvent) {
    document.body.addEventListener('mousemove', this.onMousemove)
    document.body.addEventListener('mouseup', this.onMouseup)
    document.body.addEventListener('mouseleave', this.onMouseleave)
    const { x, y } = e
    this.mousedown = { x, y }
    this.prevMove = { x, y }
    console.log(1)
  }
  onMousemove(e: MouseEvent) {
    const { x, y } = e
    const padding = 8
    const vpRect = this.viewportRect
    let dx = (x - this.prevMove.x) / this.scale
    let dy = (y - this.prevMove.y) / this.scale
    if (vpRect.left + vpRect.width < padding) {
      dx = Math.max(dx, 0)
    } else if (vpRect.left - vpRect.width > -padding) {
      dx = Math.min(dx, 0)
    }
    if (vpRect.top + vpRect.height < padding) {
      dy = Math.max(dy, 0)
    } else if (vpRect.top - this.height > -padding) {
      // console.log(vpRect.top , this.height)
      dy = Math.min(dy, 0)
    }
    this.graph.translate(-dx, -dy)
    Object.assign(this.prevMove, { x, y })
  }
  onMouseup(e: MouseEvent) {
    document.body.removeEventListener('mousemove', this.onMousemove)
    document.body.removeEventListener('mouseup', this.onMouseup)
    document.body.removeEventListener('mouseleave', this.onMouseleave)
    console.log(0)
  }
  onMouseleave(e: MouseEvent) {
    this.onMouseup(e)
  }

  onVpResizedown(e: MouseEvent) {
    const { x, y } = e
    this.prevVpmove = { x, y }
    document.body.addEventListener('mousemove', this.onVpResizemove)
    document.body.addEventListener('mouseup', this.onVpResizeup)
    document.body.addEventListener('mouseleave', this.onVpResizeleave)
  }
  onVpResizemove(e: MouseEvent) {
    const { x, y } = e
    const changeZoom = -(x - this.prevVpmove.x) / this.width + 1
    const nextZoom = this.transform.scale * changeZoom
    this.graph.zoom(nextZoom)
    Object.assign(this.prevVpmove, { x, y })
  }
  onVpResizeup(e: MouseEvent) {
    document.body.removeEventListener('mousemove', this.onVpResizemove)
    document.body.removeEventListener('mouseup', this.onVpResizeup)
    document.body.removeEventListener('mouseleave', this.onVpResizeleave)
  }
  onVpResizeleave(e: MouseEvent) {
    this.onVpResizeup(e)
  }

  created() {
    console.log(this.graph)
  }
  mounted() {
    this.initMinimap()
  }
}
</script>
<style lang="scss" scoped>
.Minimap {
  position: relative;
  color: #fff;
  border: 1px solid #fff;
  position: absolute;
  right: 10px;
  top: 50px;
  overflow: hidden;
  .viewport {
    position: absolute;
    left: 0%;
    top: 0%;
    border: 1px solid #fff;
    width: 100px;
    height: 100px;
    cursor: move;
    transform-origin: center;
    .viewport-resize {
      position: absolute;
      right: -5px;
      bottom: -5px;
      border-radius: 50%;
      border: 1px solid #fff;
      width: 10px;
      height: 10px;
      background-color: #fff;
      cursor: nwse-resize;
    }
  }
  &:hover {
    .viewport {
      background-color: rgba($color: #fff, $alpha: 0.1);
    }
  }
}
</style>
