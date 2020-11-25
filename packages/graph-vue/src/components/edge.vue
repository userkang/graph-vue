<template>
  <g data-type="edge" :data-id="edge.id">
    <path
      stroke-width="2"
      :d="
        calculateCurve(
          edge.fromSlot.x,
          edge.fromSlot.y,
          edge.toSlot.x,
          edge.toSlot.y
        )
      "
      fill="transparent"
      :class="lineClassName"
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

  path = ''
  calculateCurve = calculateCurve
  activeEdgeId = ''

  get graph() {
    return (this.$parent as GraphContent).graph
  }

  get lineClassName() {
    return this.edge.hasState('selected') ? 'edge-selected-style' : 'edge-style'
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
</style>
