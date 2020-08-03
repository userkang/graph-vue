<template>
  <circle
    class="slot-style"
    :class="{
      'enable-slot': isSlotEnableLink,
      'active-slot': isInOrOut === 'out',
      'linked-slot': !isSlotEnableLink
    }"
    :r="isSlotEnableLink ? highlightCircleR : circleR"
    :cx="calculateCircleX"
    :cy="cy"
    :data-id="`${node.id}`"
    :data-status="isSlotEnableLink ? 'enable' : 'disable'"
    :data-type="`${node.id}-${isInOrOut}`"
    @mousedown="addLine"
  ></circle>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { INodeType } from '../../types/dag'
import { EdgeStore } from '@/stores/graph/edge'
// import {
//   CreateLineController,
//   WarningTipsController
// } from '@/stores/workflow/graphVisual/LocalState'
// import { GraphVisualStore } from '@/stores/workflow/graphVisual/GraphContent'

@Component
export default class GraphSlot extends Vue {
  @Prop({
    required: true
  })
  node!: INodeType

  @Prop({
    required: true,
    type: Number
  })
  fromNodeId!: number

  @Prop({
    type: String
  })
  isInOrOut!: string

  @Prop({
    required: true,
    type: Number
  })
  rectWidth!: number

  @Prop({
    required: true,
    type: Number
  })
  rectHeight!: number

  circleR = 4
  highlightCircleR = 6
  // private graphContentState = GraphVisualStore.state
  edgeState = EdgeStore.state

  get cy() {
    return this.node.posY + this.rectHeight / 2
  }

  get canEditGraph() {
    return (this.$store.state as any).isCurrentGraphCanBeEdit
  }

  get isSlotActive() {
    return this.edgeState.isSlotActive
  }

  get isSlotEnableLink() {
    return (
      this.fromNodeId !== this.node.nodeId &&
      this.isInOrOut === 'in' &&
      this.isSlotActive
    )
  }

  get calculateCircleX() {
    return this.isInOrOut === 'in'
      ? this.node.posX
      : this.node.posX + this.rectWidth
  }

  private addLine(event: MouseEvent) {
    // cannot remove canLinkEdge when slot type is in, as need to stop mouse down event propagation
    const canLinkEdge = this.isInOrOut === 'out'
    event.stopPropagation()
    if (canLinkEdge && this.canEditGraph) {
      const el = event.target as SVGCircleElement
      const x = Number(el.getAttribute('cx'))
      const y = Number(el.getAttribute('cy'))
      // CreateLineController.add(x, y)
      this.$emit('mousedown', {
        type: 'line',
        x: event.clientX,
        y: event.clientY,
        fromNodeId: this.node.id
      })
    }
  }

  // private hideSlotName(event: MouseEvent) {
  //   WarningTipsController.hide()
  // }
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
    }
  }
  &.enable-slot {
    stroke: rgba(96, 107, 225, 0.7);
    stroke-width: 4;
    fill: #fff;
  }

  &.linked-slot {
    fill: $d2;
    stroke: $d2;
  }
}
</style>
