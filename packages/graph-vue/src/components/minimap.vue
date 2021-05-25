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
    <div class="viewport" :style="viewportStyle" @mousedown="onMousedown"></div>
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
  scale = 1
  height = 0

  mousedown?: { x: number; y: number }
  prevMove = { x: 0, y: 0 }

  @Watch('graph')
  watchGraph() {
    if (this.graph) {
      this.graph.on('datachange', this.initMinimap)
    }
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
    //   transform: `scale(${this.scale}) translate3D(${-this.padding
    // .left}px, ${-this.padding.top}px, 0)`
    return {
      transform: `scale(${this.scale}) translate3D(${0}px, ${0}px, 0)`
    }
  }

  get viewportStyle() {
    const svgInfo = this.graph.viewController.svgInfo
    const transform = this.graph.viewController.transform
    const translateX = -transform.translateX * this.scale
    const translateY = -transform.translateY * this.scale
    return {
      width: `${this.width}px`,
      height: `${this.scale * svgInfo.height}px`,
      transform: `scale(${1}) translate3D(${translateX}px, ${translateY}px, 0)`
    }
  }

  initMinimap() {
    if (!this.graph) {
      return
    }
    const svgInfo = this.graph.viewController.svgInfo
    this.scale = this.width / svgInfo.width

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

    // const svgInfo = this.graph.viewController.svgInfo
    // this.scale = this.width / svgInfo.width
    // this.height = this.scale * svgInfo.height
    // const g = this.graph.viewController.$container.querySelector('g')
    // if (g) {
    //   this.svgHTML = g.innerHTML
    // }

    // const g = this.graph.viewController.$container.querySelector('g')
    // if (g) {
    //   const gRect = g.getBoundingClientRect()
    //   this.scale = this.width / gRect.width
    //   this.height = this.scale * gRect.height
    //   // this.svgHTML = this.graph.viewController.$container.innerHTML
    //   this.svgHTML = g.innerHTML
    //   if (!(Date.now() % 100)) {
    //     window.info = {}
    //   }
    // }
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
    const dx = (x - this.prevMove.x) / this.scale
    const dy = (y - this.prevMove.y) / this.scale
    this.graph.translate(dx, dy)
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
  }
  &:hover {
    .viewport {
      background-color: rgba($color: #fff, $alpha: 0.1);
    }
  }
}
</style>
