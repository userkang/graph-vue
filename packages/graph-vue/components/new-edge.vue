<template>
  <g>
    <path
      class="graph-vue-new-edge"
      :d="path"
      v-if="path"
      marker-end="url(#arrow)"
    ></path>
  </g>
</template>

<script>
import { calculateCurve } from '../utils/calculateCurve'

export default {
  data() {
    return {
      path: ''
    }
  },
  computed: {
    graph() {
      return this.$parent.graph
    }
  },
  mounted() {
    this.graph.on('edge:connecting', this.handlePath)
  },
  methods: {
    handlePath(createEdge) {
      if (!createEdge) {
        this.path = ''
      } else {
        const { fromPoint, toPoint } = createEdge
        const direction = this.graph.get('direction')
        let x2 = toPoint.x
        let y2 = toPoint.y
        if (direction === 'LR') {
          x2 -= 5
        } else {
          y2 -= 5
        }

        this.path = calculateCurve(
          {
            x1: fromPoint.x,
            y1: fromPoint.y,
            x2,
            y2
          },
          direction
        )
      }
    }
  }
}
</script>

<style lang="scss">
.graph-vue-new-edge {
  pointer-events: none;
  stroke-dasharray: 5;
  stroke-linecap: round;
  stroke-width: 1.5;
  stroke: #d1d1d9;
  fill: transparent;
}
</style>
