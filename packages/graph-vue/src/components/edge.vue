<template>
  <g>
    <path
      :d="path.line"
      class="edge-wrapper"
      graph-type="edge"
      :graph-id="edge.id"
    ></path>
    <path
      :d="path.line"
      class="edge-style"
      :class="{ 'edge-selected-style': isSelected }"
    ></path>
    <path
      :d="path.arrow"
      class="arrow-style"
      :class="{ 'arrow-selected': isSelected }"
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
    return calculateCurve(
      {
        x1: fromSlot.x,
        y1: fromSlot.y,
        x2: toSlot.x,
        y2: toSlot.y
      },
      this.graph.get('direction')
    )
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
    +.edge-style {
      stroke: $select-color;
      stroke-width: 2.5;
      cursor: pointer;
      +.arrow-style {
        stroke: $select-color;
        fill: $select-color;
      }
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
.arrow-style {
  stroke: $edge-color;
  stroke-width: 2;
  stroke-linecap: round;
  fill: $edge-color;
}
.arrow-selected {
  stroke: $select-color;
  fill: $select-color;
}
</style>
