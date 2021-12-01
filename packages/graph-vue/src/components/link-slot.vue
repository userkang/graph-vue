<template>
  <g>
    <template v-if="hasDefaultSlot">
      <slot :linkSlot="item"></slot>
    </template>
    <template v-else>
      <circle
        graph-type="slot"
        :graph-id="item.id"
        class="slot-style"
        :class="{
          'enable-slot': slotEnableLink,
          'active-slot': item.type === 'out',
          'linked-slot': slotLinked
        }"
        :r="slotEnableLink ? highlightCircleR : circleR"
        :transform="`translate(${item.x}, ${item.y})`"
      ></circle>
    </template>
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import GraphContent from './graph.vue'

@Component
export default class LinkSlot extends Vue {
  @Prop({
    required: true
  })
  item: any

  circleR = 4
  highlightCircleR = 6

  get slotEnableLink() {
    return this.item.hasState('enable')
  }

  get slotLinked() {
    return this.item.hasState('linked') && !this.slotEnableLink
  }

  get hasDefaultSlot() {
    return (
      Reflect.has(this.$slots, 'default') ||
      Reflect.has(this.$scopedSlots, 'default')
    )
  }

  mounted() {
    console.log(this.$slots, this.$scopedSlots)
  }
}
</script>

<style lang="scss" scoped>
.slot-style {
  stroke: #dddeeb;
  fill: #fff;
  stroke-width: 1;
  cursor: pointer;
  &.active-slot {
    &:hover {
      stroke: $d2;
      stroke-width: 2;
      fill: #fff;
    }
  }
  &.enable-slot {
    stroke: rgba(96, 107, 225, 0.7);
    stroke-width: 4;
    fill: #fff;
    &:hover {
      stroke-width: 6;
      fill: rgba(96, 107, 225);
    }
  }

  &.linked-slot {
    fill: $d2;
    stroke: $d2;
  }
}
</style>
