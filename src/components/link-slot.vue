<template>
  <circle
    :data-type="`${isInOrOut}slot`"
    :data-item="item"
    class="slot-style"
    :class="{
      'enable-slot': slotEnableLink,
      'active-slot': isInOrOut === 'out',
      'linked-slot': slotLinked
    }"
    :r="slotEnableLink ? highlightCircleR : circleR"
    :transform="
      `translate(${node[isInOrOut + 'Slot'].x}, ${node[isInOrOut + 'Slot'].y})`
    "
  ></circle>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import GraphContent from './graph.vue'

@Component
export default class LinkSlot extends Vue {
  @Prop({
    required: true
  })
  node!: INodeType

  @Prop({
    type: String
  })
  isInOrOut!: string

  get graph() {
    return (this.$parent as GraphContent).graph
  }

  get item() {
    return JSON.stringify(this.node)
  }

  circleR = 4
  highlightCircleR = 6

  get isSlotLinked() {
    if (this.isInOrOut === 'in') {
      return this.graph
        .getEdges()
        .map((item: any) => {
          return item.toNodeId
        })
        .includes(this.node.nodeId)
    } else {
      return this.graph
        .getEdges()
        .map((item: any) => {
          return item.fromNodeId
        })
        .includes(this.node.nodeId)
    }
  }

  get slotEnableLink() {
    return (this.node as any)[this.isInOrOut + 'Slot'].status === 'enable'
  }

  get slotLinked() {
    return (this.node as any)[this.isInOrOut + 'Slot'].status === 'linked'
  }
}
</script>

<style lang="scss" scoped>
.slot-style {
  stroke: #dddeeb;
  fill: #fff;
  stroke-width: 1;
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
