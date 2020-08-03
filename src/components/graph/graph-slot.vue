<template>
  <circle
    class="slot-style"
    :class="{
      'enable-slot': isSlotEnableLink,
      'active-slot': isInOrOut === 'out',
      'linked-slot': !isSlotEnableLink && isSlotLinked
    }"
    :r="isSlotEnableLink ? highlightCircleR : circleR"
    :cx="cx"
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
import { DagStore } from '@/stores/graph/dag'

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
  edgeState = EdgeStore.state
  dagState = DagStore.state

  get cx() {
    return this.node.posX + this.rectWidth / 2
  }

  get cy() {
    return this.isInOrOut === 'in'
      ? this.node.posY
      : this.node.posY + this.rectHeight
  }

  get edges() {
    return this.dagState.dag.edges
  }

  get isSlotActive() {
    return this.edgeState.isSlotActive
  }

  get isSlotLinked() {
    if (this.isInOrOut === 'in') {
      return this.edges
        .map(item => {
          return item.fromNodeId
        })
        .includes(this.node.nodeId)
    } else {
      return this.edges
        .map(item => {
          return item.toNodeId
        })
        .includes(this.node.nodeId)
    }
  }

  get isSlotEnableLink() {
    return (
      this.fromNodeId !== this.node.nodeId &&
      this.isInOrOut === 'in' &&
      this.isSlotActive
    )
  }

  addLine(event: MouseEvent) {
    // cannot remove canLinkEdge when slot type is in, as need to stop mouse down event propagation
    const canLinkEdge = this.isInOrOut === 'out'
    event.stopPropagation()
    if (canLinkEdge) {
      const el = event.target as SVGCircleElement
      const x = Number(el.getAttribute('cx'))
      const y = Number(el.getAttribute('cy'))
      // CreateLineController.add(x, y)
      this.$emit('mousedown', {
        type: 'line',
        x: event.clientX,
        y: event.clientY,
        fromNodeId: this.node.nodeId
      })
    }
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
