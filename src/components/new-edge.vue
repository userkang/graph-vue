<template>
  <path
    v-show="createLineValue.show"
    stroke-linecap="round"
    stroke-width="1.5"
    stroke="#555"
    fill="transparent"
    class="new-edge"
    :d="newEdgePath"
  ></path>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { calculateCurve } from '@/assets/js/utils'
import GraphContent from './graph.vue'

@Component
export default class NewEdge extends Vue {
  get graph() {
    return (this.$parent as GraphContent).graph
  }

  get createLineValue() {
    if (this.graph) {
      return this.graph.edgeController.createEdge
    }
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
