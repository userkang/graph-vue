<template>
  <g>
    <path
      class="graph-new-edge"
      :d="path"
      v-if="path"
      marker-end="url(#arrow)"
    ></path>
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import GraphContent from './graph.vue'
import { calculateCurve } from '../utils/calculateCurve'

@Component
export default class NewEdge extends Vue {
  path = ''

  get graph() {
    return (this.$parent as GraphContent).graph
  }

  mounted() {
    this.graph.on('addingedge', this.handlePath)
  }

  handlePath(createEdge: any) {
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
</script>

<style lang="scss" scoped>
.new-edge {
  pointer-events: none;
  stroke-dasharray: 5;
  stroke-linecap: round;
  stroke-width: 1.5;
  stroke: #d1d1d9;
  fill: transparent;
}
.arrow {
  pointer-events: none;
  stroke-width: 2;
  stroke: #d1d1d9;
  fill: #d1d1d9;
}
</style>
