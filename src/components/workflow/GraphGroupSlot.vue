<template>
  <g>
    <circle
      v-for="(item, index) in filterSlots"
      :key="index"
      class="slot-style linked-slot"
      :r="4"
      :cx="calculateCircleX"
      :cy="cy"
      :data-id="`${item}`"
      :data-type="`${item}-${isInOrOut}`"
    ></circle>
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
  CreateLineController,
  WarningTipsController
} from '@/stores/workflow/graphVisual/LocalState'
import { GraphVisualStore } from '@/stores/workflow/graphVisual/GraphContent'

@Component
export default class GraphGroupSlot extends Vue {
  @Prop({
    required: true
  })
  private nodes!: Workflow.WorkflowNodeVo[]

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

  @Prop({
    required: true
  })
  private posX!: number

  @Prop({
    required: true
  })
  private posY!: number

  private graphContentState = GraphVisualStore.state

  get cy() {
    return this.posY + this.rectHeight / 2
  }

  get edges() {
    return this.graphContentState.edges
  }

  get filterSlots() {
    const nodes = this.nodes.map(item => {
      return item.id
    })
    const slots = []

    for (const v of this.edges) {
      // 边起点在节点组外，终点在节点组内，类型是 in 的插槽
      if (
        !nodes.includes(v.fromNodeId) &&
        nodes.includes(v.toNodeId) &&
        this.isInOrOut === 'in'
      ) {
        slots.push(v.toNodeId)
      }

      // 边起点在节点组内，终点在节点组外，类型是 out 的插槽
      if (
        nodes.includes(v.fromNodeId) &&
        !nodes.includes(v.toNodeId) &&
        this.isInOrOut === 'out'
      ) {
        slots.push(v.fromNodeId)
      }
    }

    return slots
  }

  get calculateCircleX() {
    return this.isInOrOut === 'in' ? this.posX : this.posX + this.rectWidth
  }
}
</script>

<style lang="scss" scoped>
@import '../../../static/css/variable';
.slot-style {
  stroke: #dddeeb;
  fill: #fff;
  stroke-width: 1;
  &.linked-slot {
    fill: $highlight-color;
    stroke: $highlight-color;
  }
}
</style>