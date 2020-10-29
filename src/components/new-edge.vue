<template>
  <path
    stroke-linecap="round"
    stroke-width="1.5"
    stroke="#d1d1d1"
    fill="transparent"
    class="new-edge"
    :d="path"
  ></path>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import GraphContent from './graph.vue'

@Component
export default class NewEdge extends Vue {
  @Prop({
    required: true,
    default: ''
  })
  path = ''
}
</script>

<style lang="scss" scoped>
.new-edge {
  pointer-events: none;
  stroke-dasharray: 5;
}
</style>
