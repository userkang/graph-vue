<template>
  <g data-type="edge" :data-id="edge.id">
    <!-- <defs>
      <marker
        id="markerArrow"
        markerWidth="10"
        markerHeight="10"
        refX="10"
        refY="3"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M0,0 L0,6 L9,3 Z" style="fill:#00ff00" />
      </marker>
    </defs> -->
    <path
      marker-start="url(#markerArrow)"
      marker-mid="url(#markerArrow)"
      marker-end="url(#markerArrow)"
      stroke-width="2"
      :d="path.line"
      fill="transparent"
      :class="lineClassName"
    ></path>
    <path :d="path.arrow" class="arrow-style"></path>
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { calculateCurve } from '@/assets/js/utils'
import GraphContent from './graph.vue'

@Component
export default class Edge extends Vue {
  @Prop({
    required: true
  })
  edge!: any

  activeEdgeId = ''

  get graph() {
    return (this.$parent as GraphContent).graph
  }

  get lineClassName() {
    return this.edge.hasState('selected') ? 'edge-selected-style' : 'edge-style'
  }

  get path() {
    const { fromSlot, toSlot } = this.edge
    return calculateCurve(this.graph.get('drection'), {
      x1: fromSlot.x,
      y1: fromSlot.y,
      x2: toSlot.x,
      y2: toSlot.y
    })
  }
}
</script>

<style lang="scss" scoped>
.edge-style {
  stroke: #d1d1d1;
  stroke-width: 2;
  stroke-linecap: round;
  &:hover {
    stroke: #4150f6;
    stroke-width: 2.5;
    cursor: pointer;
  }
}

.edge-selected-style {
  stroke: #4150f6;
  stroke-width: 2.5;
  cursor: pointer;
}
.arrow-style {
  stroke: #d1d1d1;
  stroke-width: 2;
  stroke-linecap: round;
  fill: #d1d1d1;
}
</style>
