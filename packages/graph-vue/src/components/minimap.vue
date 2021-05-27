<template>
  <div class="Minimap" ref="root" :style="rootStyle">
    <svg
      :width="mapRect.width"
      :height="mapRect.height"
      xmlns="http://www.w3.org/2000/svg"
      class="graph-svg"
      id="minimap"
      ref="map"
    >
      <g :style="graphStyle" v-html="svgHTML"></g>
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
  IEdge,
  ISlotModel
} from '@datafe/graph-core'
@Component
export default class Minimap extends Vue {
  @Prop()
  graph?: Graph

  svgHTML = ''

  mousedown?: { x: number; y: number }
  prevMove = { x: 0, y: 0 }
  prevVpmove?: { x: number; y: number }
  syncgraphRect = 1

  @Watch('graph')
  watchGraph() {
    if (this.graph) {
      this.graph.on('datachange', this.initMinimap)
    }
  }
  get svgInfo() {
    return this.graph.viewController.svgInfo
  }
  get transform() {
    return this.graph.viewController.transform
  }

  get mapRect() {
    const width = 320
    const height = 200

    return {
      width,
      height
    }
  }

  get rootStyle() {
    return {
      width: `${this.mapRect.width}px`,
      height: `${this.mapRect.height}px`
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
  get nodesRect() {
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
    return { minX, minY, maxX, maxY }
  }

  get graphRect() {
    if (!this.graph) {
      return
    }
    const { minX, minY, maxX, maxY } = this.nodesRect
    let [width, height, left, top] = [maxX - minX, maxY - minY, minX, minY]
    const scale =
      Math.min(this.mapRect.width / width, this.mapRect.height / height) * 0.5

    return {
      width,
      height,
      left,
      top,
      scale
    }
  }
  get graphStyleData ( ){
    const  left =
      -this.graphRect.left +
      this.mapRect.width / this.graphRect.scale / 2 -
      this.graphRect.width / 2
    const top =
      -this.graphRect.top +
      this.mapRect.height / this.graphRect.scale / 2 -
      this.graphRect.height / 2
      return {
        left ,top
      }
  }
  get graphStyle() {
    // const  left =
    //   -this.graphRect.left +
    //   this.mapRect.width / this.graphRect.scale / 2 -
    //   this.graphRect.width / 2
    // const top =
    //   -this.graphRect.top +
    //   this.mapRect.height / this.graphRect.scale / 2 -
    //   this.graphRect.height / 2
    const {left, top } = this.graphStyleData
    return {
      transform: `scale(${this.graphRect.scale}) translate3D(${left}px, ${top}px, 0)`
    }
  }

  get viewportRect() {
    const svgInfo = this.graph.viewController.svgInfo
    const transform = this.graph.viewController.transform
    const graphRect = this.graphRect
    const width =svgInfo.width *  this.graphRect.scale / transform.scale
    const height = (svgInfo.height * this.graphRect.scale) / transform.scale

    const left =(-transform.translateX + transform.offsetX / transform.scale+this.graphStyleData.left) *this.graphRect.scale
    const top = (-transform.translateY + transform.offsetY / transform.scale+this.graphStyleData.top) *this.graphRect.scale
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

    const g = this.graph.viewController.$container.querySelector('g')
    if (g) {
      this.svgHTML = g.innerHTML
    }
    // window.requestAnimationFrame(this.syncgraphRect)
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
    const padding = Math.min(this.mapRect.width, this.mapRect.height) * 0.1
    const vpRect = this.viewportRect
    let dx = (x - this.prevMove.x) / this.graphRect.scale
    let dy = (y - this.prevMove.y) / this.graphRect.scale
    // fixme边界算法有问题
    if (vpRect.left + vpRect.width < padding) {
      dx = Math.max(dx, 0)
    } else if (vpRect.left - this.mapRect.width > -padding) {
      dx = Math.min(dx, 0)
    }
    if (vpRect.top + vpRect.height < padding) {
      dy = Math.max(dy, 0)
    } else if (vpRect.top - this.mapRect.height > -padding) {
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
    const changeZoom = -(x - this.prevVpmove.x) / this.mapRect.width + 1
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
  onDragnode([node]: [INodeModel | IEdgeModel | ISlotModel]) {
    this.syncgraphRect = ~this.syncgraphRect
  }

  created() {
    console.log(this.graph)
  }
  mounted() {
    this.initMinimap()
    if (this.graph) {
      this.graph.on('dragingnode', this.onDragnode)
    }
  }
}
</script>
<style lang="scss" scoped>
.Minimap {
  box-sizing: border-box;
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
