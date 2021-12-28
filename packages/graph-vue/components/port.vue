<template>
  <g
    graph-type="slot"
    :graph-id="item.id"
    :transform="`translate(${item.x}, ${item.y})`"
  >
    <template v-if="$slots.default">
      <slot :port="item"></slot>
    </template>
    <template v-else>
      <circle
        class="graph-port"
        :class="{
          'graph-port-enable': portEnableLink,
          'graph-port-active': item.type === 'out',
          'graph-port-linked': portLinked
        }"
        :r="portEnableLink ? highlightCircleR : circleR"
      ></circle>
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
  item: ISlot

  circleR = 4
  highlightCircleR = 6

  get portEnableLink() {
    return this.item.hasState('enable')
  }

  get portLinked() {
    return this.item.hasState('linked') && !this.portEnableLink
  }
}
</script>
