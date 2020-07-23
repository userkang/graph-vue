<template>
  <g @contextmenu.capture="showMenuTips" @mousedown="handleNodeMouseDown">
    <rect
      class="group-node"
      :style="{
        stroke: false ? '#606BE1' : 'black',
        fill: false ? '#E3E6FF' : 'rgb(242, 242, 155, 0.2)',
      }"
      stroke-dasharray="5 5"
      stroke-linecap="round"
      :width="rectWidth"
      :height="rectHeight"
      :x="posX"
      :y="posY"
      rx="2"
      ry="2"
    ></rect>
    <GraphGroupSlot
      :nodes="group.nodes"
      :posX="posX"
      :posY="posY"
      isInOrOut="in"
      :rectWidth="rectWidth"
      :rectHeight="rectHeight"
    />
    <GraphGroupSlot
      :nodes="group.nodes"
      isInOrOut="out"
      :posX="posX"
      :posY="posY"
      :rectWidth="rectWidth"
      :rectHeight="rectHeight"
    />
  </g>
</template>

<style lang="scss" scoped>
.group-node {
  stroke-width: 1;
  cursor: pointer;
  @keyframes rotate {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
text {
  cursor: pointer;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { AddEdgePositionType, NodeVoType } from '@/types/graph'
import {
  MenuTipsController,
  WarningTipsController
} from '@/stores/workflow/graphVisual/LocalState'
import GraphGroupSlot from './GraphGroupSlot.vue'

@Component({
  components: {
    GraphGroupSlot
  }
})
export default class GraphGroupNode extends Vue {
  @Prop({
    required: true
  })
  private group!: Workflow.WorkflowNodeGroupVo

  @Prop({
    required: true
  })
  private posX!: number

  @Prop({
    required: true
  })
  private posY!: number

  private fromNodeId!: number
  private toNodeId!: number

  private rectWidth = 198
  private rectHeight = 34

  get canEditGraph() {
    return (this.$store.state as any).isCurrentGraphCanBeEdit
  }

  get iconSrc() {
    return 1
  }

  private showMenuTips(event: MouseEvent) {
    this.$emit('showMenuTips', event, this.group)
  }

  private handleNodeMouseDown(event: MouseEvent) {
    event.stopPropagation()
    if (event.button === 0) {
      this.$emit('mousedown', event, this.group.nodes)
    }
  }
}
</script>
