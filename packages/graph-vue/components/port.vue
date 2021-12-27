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
        class="port-style"
        :class="{
          'enable-port': portEnableLink,
          'active-port': item.type === 'out',
          'linked-port': portLinked
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

<style lang="scss" scoped>
.port-style {
  stroke: #dddeeb;
  fill: #fff;
  stroke-width: 1;
  cursor: pointer;
  &.active-port {
    &:hover {
      stroke: $d2;
      stroke-width: 2;
      fill: #fff;
    }
  }
  &.enable-port {
    stroke: rgba(96, 107, 225, 0.7);
    stroke-width: 4;
    fill: #fff;
    &:hover {
      stroke-width: 6;
      fill: rgba(96, 107, 225);
    }
  }

  &.linked-port {
    fill: $d2;
    stroke: $d2;
  }
}
</style>
