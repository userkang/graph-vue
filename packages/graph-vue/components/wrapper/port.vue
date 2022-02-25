<template>
  <g
    graph-type="slot"
    :graph-id="port.id"
    :transform="`translate(${port.x}, ${port.y})`"
  >
    <slot :port="port"></slot>
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ISlot } from '@datafe/graph-core'

@Component
export default class Port extends Vue {
  @Prop({
    required: true
  })
  port!: ISlot
}
</script>
