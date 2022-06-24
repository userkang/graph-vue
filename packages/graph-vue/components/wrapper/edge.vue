<template>
  <g v-if="!edge.hasState('hide')" graph-type="edge" :graph-id="edge.id">
    <slot></slot>
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IEdge } from '@datafe/graph-core'

@Component
export default class EdgeWrapper extends Vue {
  @Prop({
    required: true
  })
  edge!: IEdge
}
</script>
