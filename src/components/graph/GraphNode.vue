<template>
  <g
    @contextmenu.capture="showMenuTips"
    @mousedown="handleNodeMouseDown"
    :style="{cursor: isLocked && 'not-allowed'}"
  >
    <rect
      class="graph-node"
      :style="{
                 stroke: isNodeActive ? '#606BE1' : '#DEDFEC',
                 fill: isNodeActive ? '#E3E6FF' : '#FFF',
                 cursor: isLocked && 'not-allowed'
            }"
      :width="rectWidth"
      :height="rectHeight"
      :x="node.posX"
      :y="node.posY"
      rx="2"
      ry="2"
    ></rect>
    <image
      :xlink:href="iconSrc"
      :x="node.posX + modelIconXPosition"
      :y="node.posY + modelIconYPosition"
      :width="imgIconSize"
      :height="imgIconSize"
    >
    </image>
    <text
      :x="node.posX + modelNameXPosition"
      :y="node.posY + modelNameYPosition"
      fill="#666666"
      style="font-size: 14px"
    >{{node.nodeLabel}}</text>
    <image
      :xlink:href="statusIconSrc"
      :x="node.posX + statusIconXPosition"
      :y="node.posY + statusIconYPosition"
      :width="imgIconSize"
      :height="imgIconSize"
      data-type="status"
      @mouseover.capture="showWarningTips"
      @mouseout.capture="hideWarningTips"
    >
      <animateTransform
        v-if="node.status === 30"
        attributeName="transform"
        begin="0s"
        dur="3s"
        :from="`0 ${node.posX + statusIconXPosition + imgIconSize/2} ${node.posY + 10 + imgIconSize/2}`"
        :to="`360 ${node.posX + statusIconXPosition + imgIconSize/2} ${node.posY + 10 + imgIconSize/2}`"
        type="rotate"
        repeatCount="indefinite"
      ></animateTransform>
    </image>
    <GraphSlot
      v-for="(slot, index) in node.inSlots"
      :key="slot.slotId"
      :ownSlot="slot"
      :node="node"
      :fromNodeId="fromNodeId"
      :activeSlotType="activeSlotType"
      isInOrOut="in"
      :index="index"
      :length="node.inSlots.length"
      :rectWidth="rectWidth"
      :rectHeight="rectHeight"
      :linkedSlots="linkedSlots"
    />
    <GraphSlot
      v-for="(slot, index) in node.outSlots"
      :key="slot.slotId"
      :ownSlot="slot"
      :node="node"
      :fromNodeId="fromNodeId"
      :activeSlotType="activeSlotType"
      isInOrOut="out"
      :index="index"
      :length="node.outSlots.length"
      :rectWidth="rectWidth"
      :rectHeight="rectHeight"
      :linkedSlots="linkedSlots"
      @mousedown="handleSlotMouseDown"
    />
  </g>
</template>

<style lang="scss" scoped>
.graph-node {
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
} from '@/stores/graph/graphVisual/LocalState'
import GraphSlot from './GraphSlot.vue'
import dataSource from '../../assets/dataSource.svg'
import mlx from '../../assets/mlx.svg'
import modelManage from '../../assets/modelManage.svg'
import dataSourceActive from '../../assets/datasource_active.svg'
import mlxActive from '../../assets/MLX_active.svg'
import modelManageActive from '../../assets/modelManage_active.svg'
import notConfig from '../../assets/notConfig.svg'
import running from '../../assets/running.svg'
import complete from '../../assets/complete.svg'
import stopped from '../../assets/stopped.svg'
import failed from '../../assets/failed.svg'

@Component({
  components: {
    GraphSlot
  }
})
export default class GraphNode extends Vue {
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
    required: true,
    default: [],
    type: Array
  })
  private linkedSlots!: number[]

  @Prop({
    required: true,
    type: Boolean
  })
  private isNodeActive!: boolean

  @Prop({
    required: true,
    type: Boolean
  })
  private isLocked!: boolean

  @Prop({
    required: true,
    type: Boolean
  })
  private isDagActived!: boolean

  private rectWidth = 198
  private rectHeight = 34
  private imgIconSize = 14
  private statusIconXPosition = 176
  private statusIconYPosition = 10
  private modelIconXPosition = 10
  private modelIconYPosition = 10
  private modelNameXPosition = 30
  private modelNameYPosition = 22

  get canEditGraph() {
    return (this.$store.state as any).isCurrentGraphCanBeEdit
  }

  get iconSrc() {
    if (this.isNodeActive) {
      switch (this.node.categoryIndex) {
        case 1:
          return dataSourceActive
        case 5:
          return mlxActive
        case 6:
          return modelManageActive
        default:
          return dataSourceActive
      }
    } else {
      switch (this.node.categoryIndex) {
        case 1:
          return dataSource
        case 5:
          return mlx
        case 6:
          return modelManage
        default:
          return dataSource
      }
    }
  }

  get statusIconSrc() {
    switch (this.node.status) {
      case 0:
        return notConfig
      case 10:
        return ''
      case 30:
        return running
      case 40:
        return failed
      case 80:
        return stopped
      case 60:
        return complete
      default:
        return ''
    }
  }

  private showMenuTips(event: MouseEvent) {
    event.preventDefault()
    MenuTipsController.show({
      isDagActived: this.isDagActived,
      data: this.node,
      x: event.clientX,
      y: event.clientY
    })
  }

  private showWarningTips(event: MouseEvent) {
    if (this.node.status === 0) {
      WarningTipsController.show({
        x: event.clientX,
        y: event.clientY,
        text: '参数配置未完成'
      })
    }
  }

  private hideWarningTips() {
    WarningTipsController.hide()
  }

  private handleNodeMouseDown(event: MouseEvent) {
    event.stopPropagation()
    if (event.button === 0) {
      this.$emit('mousedown', {
        type: 'node',
        x: event.clientX,
        y: event.clientY
      })
    }
  }

  private handleSlotMouseDown(value: AddEdgePositionType) {
    this.$emit('mousedown', value)
  }
}
</script>
