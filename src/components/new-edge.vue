<template>
  <path
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
  createEdge = null
  newEdgePath = ''

  get graph() {
    return (this.$parent as GraphContent).graph
  }

  mounted() {
    this.graph.on('addingEdge', (createEdge: any) => {
      this.createEdge = createEdge
      const { fromX, fromY, toX, toY } = createEdge
      this.newEdgePath = calculateCurve(fromX, fromY, toX, toY)
    })
  }
}
</script>

<style lang="scss" scoped>
.new-edge {
  pointer-events: none;
  stroke-dasharray: 5;
}
</style>
