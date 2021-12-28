<template>
  <g>
    <template v-if="$slots.default">
      <g graph-type="edge" :graph-id="edge.id">
        <slot></slot>
      </g>
    </template>
    <template v-else>
      <path
        :d="path"
        class="graph-edge-wrapper"
        graph-type="edge"
        :graph-id="edge.id"
      ></path>
      <path
        ref="edge"
        :marker-end="
          edge.hasState('selected') ? `url(#arrow-active)` : 'url(#arrow)'
        "
        :d="path"
        class="graph-edge"
        :class="{ 'graph-edge-active': edge.hasState('selected') }"
      ></path>
    </template>
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { calculateCurve } from '../utils/calculateCurve'
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

  get path() {
    const { fromSlot, toSlot } = this.edge
    const direction = this.graph.get('direction')
    let x2 = toSlot.x
    let y2 = toSlot.y
    if (direction === 'LR') {
      x2 -= 4
    } else {
      y2 -= 4
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
}
</script>
