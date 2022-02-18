<template>
  <circle
    class="graph-port"
    :class="{
      'graph-port-enable': enable,
      'graph-port-active': port.type === 'out',
      'graph-port-linked': linked
    }"
    :r="enable ? highlightCircleR : circleR"
  ></circle>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ISlot } from '@datafe/graph-core'

@Component
export default class Port extends Vue {
  @Prop({
    required: true
  })
  port: ISlot

  circleR = 4
  highlightCircleR = 6

  get enable() {
    return this.port.hasState('enable')
  }

  get linked() {
    return !this.enable && this.port.hasState('linked')
  }
}
</script>
