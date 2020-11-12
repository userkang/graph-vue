<template>
  <path
    stroke-linecap="round"
    stroke-width="1.5"
    stroke="#d1d1d1"
    fill="transparent"
    class="new-edge"
    :d="path"
    v-if="path"
  ></path>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import GraphContent from './graph.vue'
import { calculateCurve } from '@/assets/js/utils'

@Component
export default class NewEdge extends Vue {
  path = ''

  get graph() {
    return (this.$parent as GraphContent).graph
  }

  mounted() {
    this.graph.on('addingedge', this.handlePath)
  }

  handlePath(createEdge: any) {
    if (!createEdge) {
      this.path = ''
    } else {
      const { fromPoint, toPoint } = createEdge
      this.path = calculateCurve(fromPoint.x, fromPoint.y, toPoint.x, toPoint.y)
    }
  }
}
</script>

<style lang="scss" scoped>
.new-edge {
  pointer-events: none;
  stroke-dasharray: 5;
}
</style>
