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

<script>
import { defineComponent, onMounted, getCurrentInstance } from 'vue-demi'

const generateCursor = cursor => {
  const styleElement = document.createElement('style')
  styleElement.innerHTML = `body *{cursor: ${cursor} !important;}`
  return styleElement
}

export default defineComponent({
  props: {
    theme: {
      type: Array,
      default: () => [255, 255, 255]
    }
  },
  data() {
    return {
      canGraphChage: true,
      svgHTML: '',
      prevMousePosition: { x: 0, y: 0 },
      prevVpmove: { x: 0, y: 0 },
      cursorMove: generateCursor('move'),
      cursorResize: generateCursor('nwse-resize'),
      mapRect: { width: 240, height: 160 }
    }
  },
  computed: {
    themeVars() {
      return {
        '--color-main': this.theme,
        '--color-shadow': [200, 200, 200]
      }
    },
    graph() {
      return this.$parent.graph
    },
    svgInfo() {
      return this.graph.getSvgInfo()
    },
    scale() {
      return this.graph.getZoom()
    },
    translate() {
      return this.graph.getTranslate()
    },
    rootStyle() {
      return {
        width: `${this.mapRect.width}px`,
        height: `${this.mapRect.height}px`
      }
    },
    nodesRect() {
      return this.graph && this.graph.getNodesBBox()
    },
    graphScale() {
      return (
        Math.min(
          this.mapRect.width / this.nodesRect.width,
          this.mapRect.height / this.nodesRect.height
        ) * 0.4
      )
    },
    graphRect() {
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
    },
    graphStyle() {
      const { left, top } = this.graphRect
      return `transform: scale(${this.graphScale}) translate3D(${left}px, ${top}px, 0)`
    },
    viewportRect() {
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
    },
    viewportStyle() {
      const { width, height, left, top } = this.viewportRect
      return {
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate3D(${left}px, ${top}px, 0)`
      }
    }
  },
  methods: {
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
    },
    onMousedown(e) {
      this.prevMousePosition = { x: e.x, y: e.y }
      document.head.appendChild(this.cursorMove)
      document.body.addEventListener('mousemove', this.onMousemove)
      document.body.addEventListener('mouseup', this.onMouseup)
      document.body.addEventListener('mouseleave', this.onMouseleave)
    },
    onMousemove(e) {
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
    },
    onMouseup() {
      if (this.cursorMove && this.cursorMove.parentElement === document.head) {
        document.head.removeChild(this.cursorMove)
      }
      document.body.removeEventListener('mousemove', this.onMousemove)
      document.body.removeEventListener('mouseup', this.onMouseup)
      document.body.removeEventListener('mouseleave', this.onMouseleave)
    },
    onMouseleave(e) {
      return this.onMouseup(e)
    },
    onVpResizedown(e) {
      this.prevVpmove = { x: e.x, y: e.y }
      document.head.appendChild(this.cursorResize)
      document.body.addEventListener('mousemove', this.onVpResizemove)
      document.body.addEventListener('mouseup', this.onVpResizeup)
      document.body.addEventListener('mouseleave', this.onVpResizeleave)
    },
    onVpResizemove(e) {
      const { x, y } = e
      const changeZoom =
        1 - (x - this.prevVpmove.x + y - this.prevVpmove.y) / 250
      const nextZoom = this.scale * changeZoom
      this.graph.zoom(nextZoom)
      Object.assign(this.prevVpmove, { x, y })
    },
    onVpResizeup() {
      if (
        this.cursorResize &&
        this.cursorResize.parentElement === document.head
      ) {
        document.head.removeChild(this.cursorResize)
      }
      document.body.removeEventListener('mousemove', this.onVpResizemove)
      document.body.removeEventListener('mouseup', this.onVpResizeup)
      document.body.removeEventListener('mouseleave', this.onVpResizeleave)
    },
    onVpResizeleave(e) {
      return this.onVpResizeup(e)
    },
    listenGraphChange() {
      const eventTypes = ['brushing', 'translate', 'datachange', 'stackchange']
      for (let i = eventTypes.length - 1; i >= 0; i--) {
        this.graph.on(eventTypes[i], this.onGraphChange)
      }
    }
  },
  setup() {
    onMounted(() => {
      const instance = getCurrentInstance().proxy
      if (instance.graph) {
        instance.onGraphChange()
        instance.listenGraphChange()
      }
    })
  }
  // mounted() {
  //   if (this.graph) {
  //     this.onGraphChange()
  //     this.listenGraphChange()
  //   }
  // }
})
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
