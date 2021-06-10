<template>
  <g>
    <path class="new-edge" :d="path.line" v-if="path.line"></path>
    <path class="arrow" :d="path.arrow" />
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import GraphContent from './graph.vue'
import { calculateCurve } from '@/assets/js/utils'

@Component
export default class NewEdge extends Vue {
  path = {}

  get graph() {
    return (this.$parent as GraphContent).graph
  }

  mounted() {
    this.graph.on('addingedge', this.handlePath)
  }

  handlePath(createEdge: any) {
    if (!createEdge) {
      this.path = {}
    } else {
      const { fromPoint, toPoint } = createEdge
      this.path = calculateCurve(
        {
          x1: fromPoint.x,
          y1: fromPoint.y,
          x2: toPoint.x,
          y2: toPoint.y
        },
        this.graph.get('direction')
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
