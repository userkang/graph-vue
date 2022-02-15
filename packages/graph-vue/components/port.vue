<template>
  <g
    graph-type="slot"
    :graph-id="port.id"
    :transform="`translate(${port.x}, ${port.y})`"
  >
    <template v-if="$slots.default">
      <slot :port="port"></slot>
    </template>
    <template v-else>
      <g>
        <circle
          class="graph-port"
          :class="{
            'graph-port-enable': enable,
            'graph-port-active': port.type === 'out',
            'graph-port-linked': linked
          }"
          :r="enable ? highlightCircleR : circleR"
        ></circle>
      </g>
    </template>
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
