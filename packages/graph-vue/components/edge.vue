<template>
  <g>
    <path
      :d="path"
      class="graph-vue-edge-wrapper"
      graph-type="edge"
      :graph-id="edge.id"
    ></path>
    <path
      ref="edge"
      :marker-end="'url(#arrow)'"
      :d="path"
      class="graph-vue-edge"
      :class="{ 'graph-vue-edge-active': edge.hasState('selected') }"
    ></path>
  </g>
</template>

<script>
import { calculateCurve } from '../utils/calculateCurve'

export default {
  props: ['edge', 'graph'],
  data() {
    return {
      activeEdgeId: ''
    }
  },
  computed: {
    path() {
      const { source, target } = this.edge
      const direction = this.graph.get('direction')

      return calculateCurve(
        {
          x1: source.x,
          y1: source.y,
          x2: target.x,
          y2: target.y
        },
        direction
      )
    }
  }
}
</script>

<style lang="scss">
:root {
  --edge-color: #d1d1dd;
  --select-color: #4150f6;
}
.graph-vue-edge-wrapper {
  stroke-width: 10;
  fill: none;
  stroke: transparent;
}
.graph-vue-edge {
  stroke: var(--edge-color);
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  pointer-events: none;
}
.graph-vue-edge-active {
  stroke: var(--select-color);
  stroke-width: 2.5;
  cursor: pointer;
  stroke-linecap: round;
}
</style>
