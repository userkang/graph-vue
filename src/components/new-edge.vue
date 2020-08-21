<template>
  <g
    v-show="createLineValue.show"
    stroke-linecap="round"
    stroke-width="1.5"
    stroke="#555"
    fill="transparent"
    class="new-edge"
  >
    <path :d="newEdgePath"></path>
  </g>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { EdgeStore } from '@/stores/edge'
import { calculateCurve } from '@/assets/js/utils'

@Component
export default class NewEdge extends Vue {
  private edgeState = EdgeStore.state

  get createLineValue() {
    return this.edgeState.createLine
  }

  get newEdgePath() {
    const { fromX, fromY, toX, toY } = this.createLineValue
    return calculateCurve(fromX, fromY, toX, toY)
  }
}
</script>

<style lang="scss" scoped>
.new-edge {
  pointer-events: none;
  stroke-dasharray: 5;
}
</style>
