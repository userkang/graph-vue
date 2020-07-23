<template>
  <g v-show="createLineValue.isShow" stroke-width="1.5" stroke="#000" fill="transparent">
    <path class="edge-style" :d="newEdgePath"></path>
  </g>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { CreateLineController } from '../../stores/graph/graphVisual/LocalState'
import { calculateCurve } from '../../common/utils'

@Component
export default class NewGraphEdge extends Vue {
  private createLineState = CreateLineController.state

  get createLineValue() {
    return this.createLineState.value
  }

  get newEdgePath() {
    const { fromX, fromY, toX, toY } = this.createLineValue
    return calculateCurve(fromX, fromY, toX, toY)
  }
}
</script>
