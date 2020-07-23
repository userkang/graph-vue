<template>
  <circle
    class="slot-style"
    :class="{
            'enable-slot': isSlotEnableLink,
            'active-slot': isInOrOut === 'out',
            'linked-slot': isSlotLinked
         }"
    :r="isSlotEnableLink ? highlightCircleR : circleR"
    :cx="calculateCircleX"
    :cy="cy"
    :data-id="`${ownSlot.nodeId}-${ownSlot.slotId}`"
    :data-type="isInOrOut"
    :data-status="ownSlot.status === 1 ? 'enable' : 'disable'"
    @mousedown="addLine"
    @mouseover="showSlotName"
    @mouseout="hideSlotName"
  ></circle>
</template>

<style lang="scss" scoped>
@import '../../../static/css/variable';
.slot-style {
  stroke: #dddeeb;
  fill: #fff;
  stroke-width: 1;
  &.active-slot {
    &:hover {
      stroke: $highlight-color;
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

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { NodeVoType, SlotVoType } from '../../types/graph'
import { CreateLineController } from '../../stores/graph/graphVisual/LocalState'
import { WarningTipsController } from '../../stores/graph/graphVisual/LocalState'

@Component
export default class GraphSlot extends Vue {
  @Prop({
    required: true
  })
  private ownSlot!: SlotVoType

  @Prop({
    required: true
  })
  private node!: NodeVoType

  @Prop({
    required: true,
    type: Number
  })
  private fromNodeId!: number

  @Prop({
    required: true,
    type: String
  })
  private activeSlotType!: string

  @Prop({
    type: String
  })
  private isInOrOut!: string

  @Prop({
    required: true,
    type: Number
  })
  private index!: number

  @Prop({
    required: true,
    type: Number
  })
  private length!: number

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

  @Prop({
    required: true,
    type: Array,
    default: []
  })
  private linkedSlots!: number[]

  private circleR = 3
  private highlightCircleR = 5.5

  get cy() {
    return this.isInOrOut === 'in'
      ? this.node.posY
      : this.node.posY + this.rectHeight
  }

  get canEditGraph() {
    return (this.$store.state as any).isCurrentGraphCanBeEdit
  }

  get isSlotLinked() {
    return this.linkedSlots.includes(this.ownSlot.slotId)
  }

  get isSlotEnableLink() {
    // multi out and single in for slot
    // slot cannot be linked to own node's slot
    // slot should be in
    // slot cannot be linked and the slot type is same as current slot
    if (this.activeSlotType === 'HDFS_PATH') {
      return (
        this.fromNodeId !== this.node.nodeId &&
        this.isInOrOut === 'in' &&
        this.activeSlotType &&
        ['HDFS_PATH', 'HDFS_CONF', 'SPARK_MODEL'].includes(this.ownSlot.slotType) &&
        this.ownSlot.status === 1
      )
    }

    return (
      this.fromNodeId !== this.node.nodeId &&
      this.isInOrOut === 'in' &&
      this.activeSlotType &&
      (this.activeSlotType.startsWith(this.ownSlot.slotType) ||
        this.ownSlot.slotType.startsWith(this.activeSlotType)) &&
      this.ownSlot.status === 1
    )
  }

  get calculateCircleX() {
    return (
      this.node.posX + (this.rectWidth / (this.length + 1)) * (this.index + 1)
    )
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
        slotType: this.ownSlot.slotType,
        fromNodeId: this.node.nodeId,
        fromSlotId: this.ownSlot.slotId
      })
    }
  }

  private showSlotName(event: MouseEvent) {
    WarningTipsController.show({
      x: event.clientX,
      y: event.clientY,
      text: this.ownSlot.slotName
    })
  }

  private hideSlotName(event: MouseEvent) {
    WarningTipsController.hide()
  }
}
</script>
