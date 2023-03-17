<template>
  <g
    graph-type="port"
    :graph-id="port.id"
    :transform="`translate(${port.x}, ${port.y})`"
  >
    <slot :port="port"></slot>
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IPort } from 'graph-logic'

@Component
export default class Port extends Vue {
  @Prop({
    required: true
  })
  port!: IPort
}
</script>
