<template>
  <circle
    data-type="slot"
    :data-item="item"
    class="slot-style"
    :class="{
      'enable-slot': slotEnableLink,
      'active-slot': isInOrOut === 'out',
      'linked-slot': !slotEnableLink && isSlotLinked
    }"
    :r="slotEnableLink ? highlightCircleR : circleR"
    :cx="cx"
    :cy="cy"
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

  fromNodeId = 0
  directLinked = false
  slotEnableLink = false
  addingEdge = false

  get graph() {
    return (this.$parent as GraphContent).graph
  }

  get nodeInfo() {
    return (this.$parent as GraphContent).nodeInfo
  }

  get item() {
    return JSON.stringify({
      node: this.node,
      isInOrOut: this.isInOrOut,
      posX: this.cx,
      posY: this.cy,
      enableLink: this.slotEnableLink
    })
  }

  circleR = 4
  highlightCircleR = 6

  get cx() {
    return this.node.posX + this.nodeInfo.width / 2
  }

  get cy() {
    return this.isInOrOut === 'in'
      ? this.node.posY
      : this.node.posY + this.nodeInfo.height
  }

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

  isDirectLinked() {
    if (this.isInOrOut === 'in') {
      let linked = false
      for (const item of this.graph.getEdges()) {
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

  isSlotEnableLink() {
    return (
      this.fromNodeId !== this.node.nodeId &&
      this.isInOrOut === 'in' &&
      this.addingEdge &&
      !this.directLinked
    )
  }

  mounted() {
    this.graph.on('slot.mousedown', (e: MouseEvent, item: any) => {
      this.fromNodeId = item.node.nodeId
      this.directLinked = this.isDirectLinked() as boolean
    })

    this.graph.on('addingEdge', (createEdge: any) => {
      this.addingEdge = createEdge.show
      this.slotEnableLink = this.isSlotEnableLink()
    })
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
