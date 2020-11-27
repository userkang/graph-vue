<template>
  <g data-type="edge" :data-id="edge.id">
    <path
      stroke-width="2"
      :d="path.line"
      fill="none"
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
      this.graph.get('drection')
    )
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
    + .arrow-style {
      stroke: #4150f6;
      fill: #4150f6;
    }
  }
}
.edge-selected-style {
  stroke: #4150f6;
  stroke-width: 2.5;
  cursor: pointer;
  stroke-linecap: round;
}
.arrow-style {
  stroke: #d1d1d1;
  stroke-width: 2;
  stroke-linecap: round;
  fill: #d1d1d1;
}
.arrow-selected {
  stroke: #4150f6;
  fill: #4150f6;
}
</style>
