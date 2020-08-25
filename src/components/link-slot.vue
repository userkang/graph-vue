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
    @mousedown="addLine"
    @mouseup="mouseup"
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

  get fromNodeId() {
    return this.graph.eventController.fromNodeId
  }

  get rectInfo() {
    return this.graph.viewController.rectInfo
  }

  circleR = 4
  highlightCircleR = 6

  get cx() {
    return this.node.posX + this.rectInfo.width / 2
  }

  get cy() {
    return this.isInOrOut === 'in'
      ? this.node.posY
      : this.node.posY + this.rectInfo.height
  }

  get edges(): IEdgeType[] {
    return this.graph.edges
  }

  get isCreateLine() {
    return this.graph.edgeController.createEdge.show
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
      for (const item of this.edges) {
        linked =
          item.fromNodeId === this.fromNodeId &&
          item.toNodeId === this.node.nodeId
        if (linked) {
          break
        }
      }
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
    if (this.isInOrOut === 'out') {
      // 是初始化连线的起点和移动位置
      this.graph.edgeController.setNewEdgeStart(this.cx, this.cy)
      this.graph.edgeController.setNewEdgeMove(this.cx, this.cy)
      this.$emit('mousedown', e)
    }
  }

  mouseup(e: MouseEvent) {
    if (this.isSlotEnableLink) {
      this.$emit('mouseup', e)
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
