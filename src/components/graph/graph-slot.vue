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
    :data-id="`${node.nodeId}`"
    :data-status="isSlotEnableLink ? 'enable' : 'disable'"
    @mousedown="addLine"
    @mouseup="mouseup"
    @mouseenter="mouseenter"
    @mouseout="mouseout"
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

  get isCreateLine() {
    return this.edgeState.createLine.show
  }

  get isSlotLinked() {
    if (this.isInOrOut === 'in') {
      return this.edges
        .map(item => {
          return item.toNodeId
        })
        .includes(this.node.nodeId)
    } else {
      return this.edges
        .map(item => {
          return item.fromNodeId
        })
        .includes(this.node.nodeId)
    }
  }

  get isDirectLinked() {
    if (this.isInOrOut === 'in') {
      let linked = false
      this.edges.forEach(item => {
        linked =
          item.fromNodeId === this.fromNodeId &&
          item.toNodeId === this.node.nodeId

        console.log(linked)
      })
      return linked
    }
  }

  get isSlotEnableLink() {
    return (
      this.fromNodeId !== this.node.nodeId &&
      this.isInOrOut === 'in' &&
      this.isCreateLine &&
      !this.isDirectLinked
    )
  }

  addLine(e: MouseEvent) {
    e.stopPropagation()
    const canLinkEdge = this.isInOrOut === 'out'
    if (canLinkEdge) {
      // 是初始化连线的起点和移动位置
      EdgeStore.setNewLineStart(this.cx, this.cy)
      EdgeStore.setNewLineMove(this.cx, this.cy)
      this.$emit('mousedown', e)
    }
  }

  mouseup(e: MouseEvent) {
    console.log(333)
    e.stopPropagation()
    if (this.isSlotEnableLink) {
      this.$emit('mouseup', e)
    }
  }

  mouseenter(e: MouseEvent) {
    if (this.isSlotEnableLink) {
      this.highlightCircleR = 8
    }
  }

  mouseout(e: MouseEvent) {
    if (this.isSlotEnableLink) {
      this.highlightCircleR = 6
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
