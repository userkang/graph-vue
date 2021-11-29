<template>
  <g>
    <path
      :d="path"
      class="edge-wrapper"
      graph-type="edge"
      :graph-id="edge.id"
      @mouseover="onMouseover"
      @mouseout="onMouseout"
    ></path>
    <path
      ref="edge"
      :marker-end="isSelected ? `url(#arrow-active)` : 'url(#arrow)'"
      :d="path"
      class="edge-style"
      :class="{ 'edge-selected-style': isSelected }"
    ></path>
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

  get isSelected() {
    return this.edge.hasState('selected')
  }

  get path() {
    const { fromSlot, toSlot } = this.edge
    const direction = this.graph.get('direction')
    let x2 = toSlot.x
    let y2 = toSlot.y
    if (direction === 'LR') {
      x2 -= 10
    } else {
      y2 -= 10
    }

    return calculateCurve(
      {
        x1: fromSlot.x,
        y1: fromSlot.y,
        x2,
        y2
      },
      direction
    )
  }

  onMouseover() {
    ;(this.$refs.edge as HTMLElement).setAttribute(
      'marker-end',
      'url(#arrow-active)'
    )
  }

  onMouseout() {
    if (this.isSelected) {
      return
    }
    ;(this.$refs.edge as HTMLElement).setAttribute('marker-end', 'url(#arrow)')
  }
}
</script>

<style lang="scss" scoped>
$edge-color: #d1d1dd;
$select-color: #4150f6;

@keyframes dash {
  from {
    stroke-dashoffset: 320;
  }
  to {
    stroke-dashoffset: 0;
  }
}
.edge-wrapper {
  stroke-width: 10;
  fill: none;
  stroke: transparent;
  &:hover {
    + .edge-style {
      stroke: $select-color;
      stroke-width: 2.5;
      cursor: pointer;
    }
  }
}
.edge-style {
  stroke: $edge-color;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-dasharray: 5;
  animation: dash 10s linear infinite;
  pointer-events: none;
}
.edge-selected-style {
  stroke: $select-color;
  stroke-width: 2.5;
  cursor: pointer;
  stroke-linecap: round;
}
</style>
