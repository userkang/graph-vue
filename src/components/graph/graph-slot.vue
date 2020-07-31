<template>
  <circle
    class="slot-style"
    :class="{
      'enable-slot': isSlotEnableLink,
      'active-slot': isInOrOut === 'out',
      'linked-slot': !isSlotEnableLink && isSlotLinked
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
import {
  CreateLineController,
  WarningTipsController
} from '@/stores/workflow/graphVisual/LocalState'
import { GraphVisualStore } from '@/stores/workflow/graphVisual/GraphContent'

@Component
export default class GraphSlot extends Vue {
  @Prop({
    required: true
  })
  private node!: Workflow.WorkflowNodeVo

  @Prop({
    required: true,
    type: Number
  })
  private fromNodeId!: number

  @Prop({
    type: String
  })
  private isInOrOut!: string

  @Prop({
    required: true,
    type: Number
  })
  private rectWidth!: number

  @Prop({
    required: true,
    type: Number
  })
  private rectHeight!: number

  private circleR = 4
  private highlightCircleR = 6
  private graphContentState = GraphVisualStore.state

  get cy() {
    return this.node.posY + this.rectHeight / 2
  }

  get canEditGraph() {
    return (this.$store.state as any).isCurrentGraphCanBeEdit
  }

  get isSlotLinked() {
    return this.linkedSlots.includes(this.node.id + this.isInOrOut)
  }

  get isSlotActive() {
    return this.graphContentState.isSlotActive
  }

  get linkedSlots() {
    return this.graphContentState.linkedSlots
  }

  get isSlotEnableLink() {
    return (
      this.fromNodeId !== this.node.id &&
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
      CreateLineController.add(x, y)
      this.$emit('mousedown', {
        type: 'line',
        x: event.clientX,
        y: event.clientY,
        fromNodeId: this.node.id
      })
    }
  }

  private hideSlotName(event: MouseEvent) {
    WarningTipsController.hide()
  }
}
</script>

<style lang="scss" scoped>
@import '../../../static/css/variable';
.slot-style {
  stroke: #dddeeb;
  fill: #fff;
  stroke-width: 1;
  &.active-slot {
    &:hover {
      stroke: $highlight-color;
      stroke-width: 2;
    }
  }
  &.enable-slot {
    stroke: rgba(96, 107, 225, 0.7);
    stroke-width: 4;
    fill: #fff;
  }

  &.linked-slot {
    fill: $highlight-color;
    stroke: $highlight-color;
  }
}
</style>