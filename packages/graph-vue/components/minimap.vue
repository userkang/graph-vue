<template>
  <div
    class="graph-vue-minimap"
    ref="root"
    :style="{ ...rootStyle, ...themeVars }"
  >
    <svg
      :width="mapRect.width"
      :height="mapRect.height"
      xmlns="http://www.w3.org/2000/svg"
      id="minimap"
      ref="map"
    >
      <rect
        width="100%"
        height="100%"
        :style="`fill:rgba(${theme.join(',')}, 0.05);`"
      />
      <g :style="graphStyle" v-html="svgHTML"></g>
    </svg>
    <div
      class="graph-vue-minimap-viewport"
      :style="viewportStyle"
      @mousedown="onMousedown"
    >
      <div
        class="graph-vue-minimap-resize"
        @mousedown.stop="onVpResizedown"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, InjectReactive } from 'vue-property-decorator'
import { Graph } from 'graph-logic'

const generateCursor = (cursor: string) => {
  const styleElement = document.createElement('style')
  styleElement.innerHTML = `body *{cursor: ${cursor} !important;}`
  return styleElement
}

@Component
export default class Minimap extends Vue {
  @InjectReactive()
  graph!: Graph

  @Prop({ default: () => [255, 255, 255] })
  theme!: [number, number, number]

  canGraphChage = true
  svgHTML = ''
  prevMousePosition: { x: number; y: number } = { x: 0, y: 0 }
  prevVpmove: { x: number; y: number } = { x: 0, y: 0 }
  cursorMove = generateCursor('move')
  cursorResize = generateCursor('nwse-resize')

  get themeVars() {
    return {
      '--color-main': this.theme,
      '--color-shadow': [200, 200, 200]
    }
  }

  get mapRect() {
    return { width: 240, height: 160 }
  }

  get svgInfo() {
    return this.graph.getSvgInfo()
  }

  get scale() {
    return this.graph.getZoom()
  }

  get translate() {
    return this.graph.getTranslate()
  }

  get rootStyle() {
    return {
      width: `${this.mapRect.width}px`,
      height: `${this.mapRect.height}px`
    }
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
    return { left: minX, top: minY, width: maxX - minX, height: maxY - minY }
  }

  get graphScale() {
    return (
      Math.min(
        this.mapRect.width / this.nodesRect.width,
        this.mapRect.height / this.nodesRect.height
      ) * 0.4
    )
  }

  get graphRect() {
    const left =
      -this.nodesRect.left +
      this.mapRect.width / this.graphScale / 2 -
      this.nodesRect.width / 2
    const top =
      -this.nodesRect.top +
      this.mapRect.height / this.graphScale / 2 -
      this.nodesRect.height / 2
    return {
      left,
      top,
      width: this.nodesRect.width,
      height: this.nodesRect.height
    }
  }

  get graphStyle() {
    const { left, top } = this.graphRect
    return `transform: scale(${this.graphScale}) translate3D(${left}px, ${top}px, 0)`
  }

  get viewportRect() {
    const width = (this.svgInfo.width * this.graphScale) / this.scale
    const height = (this.svgInfo.height * this.graphScale) / this.scale
    const offsetX = (this.svgInfo.width * (this.scale - 1)) / 2
    const offsetY = (this.svgInfo.height * (this.scale - 1)) / 2

    const left =
      (offsetX / this.scale - this.translate.x + this.graphRect.left) *
      this.graphScale
    const top =
      (offsetY / this.scale - this.translate.y + this.graphRect.top) *
      this.graphScale
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

  onGraphChange() {
    if (!this.graph || !this.canGraphChage) {
      return
    }
    this.canGraphChage = false
    window.requestAnimationFrame(() => {
      const g = this.graph.getContainer().querySelector('g')
      if (g) {
        this.svgHTML = g.innerHTML
      }
      this.canGraphChage = true
    })
  }

  onMousedown(e: MouseEvent) {
    this.prevMousePosition = { x: e.x, y: e.y }
    document.head.appendChild(this.cursorMove)
    document.body.addEventListener('mousemove', this.onMousemove)
    document.body.addEventListener('mouseup', this.onMouseup)
    document.body.addEventListener('mouseleave', this.onMouseleave)
  }
  onMousemove(e: MouseEvent) {
    const { x, y } = e
    const padding = 10
    const vpRect = this.viewportRect
    let dx = x - this.prevMousePosition.x
    let dy = y - this.prevMousePosition.y
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
    this.graph.translate(-dx / this.graphScale, -dy / this.graphScale)
    Object.assign(this.prevMousePosition, { x, y })
  }
  onMouseup(e: MouseEvent) {
    if (this.cursorMove?.parentElement === document.head) {
      document.head.removeChild(this.cursorMove)
    }
    document.body.removeEventListener('mousemove', this.onMousemove)
    document.body.removeEventListener('mouseup', this.onMouseup)
    document.body.removeEventListener('mouseleave', this.onMouseleave)
  }
  onMouseleave(e: MouseEvent) {
    return this.onMouseup(e)
  }

  onVpResizedown(e: MouseEvent) {
    this.prevVpmove = { x: e.x, y: e.y }
    document.head.appendChild(this.cursorResize)
    document.body.addEventListener('mousemove', this.onVpResizemove)
    document.body.addEventListener('mouseup', this.onVpResizeup)
    document.body.addEventListener('mouseleave', this.onVpResizeleave)
  }
  onVpResizemove(e: MouseEvent) {
    const { x, y } = e
    const changeZoom = 1 - (x - this.prevVpmove.x + y - this.prevVpmove.y) / 250
    const nextZoom = this.scale * changeZoom
    this.graph.zoom(nextZoom)
    Object.assign(this.prevVpmove, { x, y })
  }
  onVpResizeup(e: MouseEvent) {
    if (this.cursorResize?.parentElement === document.head) {
      document.head.removeChild(this.cursorResize)
    }
    document.body.removeEventListener('mousemove', this.onVpResizemove)
    document.body.removeEventListener('mouseup', this.onVpResizeup)
    document.body.removeEventListener('mouseleave', this.onVpResizeleave)
  }
  onVpResizeleave(e: MouseEvent) {
    return this.onVpResizeup(e)
  }

  listenGraphChange() {
    const eventTypes = ['brushing', 'translate', 'datachange', 'stackchange']
    for (let i = eventTypes.length - 1; i >= 0; i--) {
      this.graph.on(eventTypes[i], this.onGraphChange)
    }
  }

  mounted() {
    if (this.graph) {
      this.onGraphChange()
      this.listenGraphChange()
    }
  }
}
</script>

<style lang="scss">
.graph-vue-minimap {
  box-sizing: border-box;
  position: relative;
  position: absolute;
  left: 10px;
  bottom: 10px;
  overflow: hidden;
  user-select: none;
}
.graph-vue-minimap:hover > .graph-minimap-viewport {
  background-color: rgba(var(--color-main), 0.15);
}
.graph-vue-minimap-viewport {
  position: absolute;
  left: 0%;
  top: 0%;
  background-color: rgba(var(--color-main), 0.1);
  cursor: move;
  transform-origin: center;
}
.graph-vue-minimap-viewport:hover {
  background-color: rgba(var(--color-main), 0.2);
}
.graph-vue-minimap-resize {
  position: absolute;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  background-color: rgb(var(--color-shadow));
  cursor: nwse-resize;
}
</style>
