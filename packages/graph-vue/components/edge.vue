<template>
  <g>
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
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { calculateCurve } from '../utils/calculateCurve'
import { Graph, IEdge } from '@datafe/graph-core'

@Component
export default class Edge extends Vue {
  @Prop({
    required: true
  })
  edge!: IEdge

  @Prop({
    required: true
  })
  graph!: Graph

  activeEdgeId = ''

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
