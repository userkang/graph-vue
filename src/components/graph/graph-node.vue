<template>
  <g>
    <rect
      ref="node"
      data-type="node"
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
    <!-- <image
      :xlink:href="iconSrc"
      :x="node.posX + modelIconXPosition"
      :y="node.posY + modelIconYPosition"
      :width="imgIconSize"
      :height="imgIconSize"
      style="pointer-events: none;"
    /> -->
    <!-- <text
      data-type="node"
      :x="node.posX + modelNameXPosition"
      :y="node.posY + modelNameYPosition"
      fill="#666666"
      style="font-size: 13px;"
      @mouseover.capture="showFullNodeName"
      @mouseout.capture="hideFullNodeName"
      @mousedown.capture="handleNodeMouseDown"
      >{{ nodeName }}</text
    > -->
    <!-- <image
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
        :from="
          `0 ${node.posX + statusIconXPosition + imgIconSize / 2} ${node.posY +
            10 +
            imgIconSize / 2}`
        "
        :to="
          `360 ${node.posX +
            statusIconXPosition +
            imgIconSize / 2} ${node.posY + 10 + imgIconSize / 2}`
        "
        type="rotate"
        repeatCount="indefinite"
      ></animateTransform>
    </image> -->
    <!-- <GraphSlot
      :node="node"
      :fromNodeId="fromNodeId"
      isInOrOut="in"
      :rectWidth="rectWidth"
      :rectHeight="rectHeight"
    />
    <GraphSlot
      :node="node"
      :fromNodeId="fromNodeId"
      isInOrOut="out"
      :rectWidth="rectWidth"
      :rectHeight="rectHeight"
      @mousedown="handleSlotMouseDown"
    /> -->
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
// import { AddEdgePositionType, NodeVoType } from '@/types/graph'
// import GraphSlot from './GraphSlot.vue'
// import dataSource from '../../assets/dataSource.svg'
// import mlx from '../../assets/mlx.svg'
// import modelManage from '../../assets/modelManage.svg'
// import xietong from '../../assets/workflow/xietong.svg'
// import tuoguan from '../../assets/workflow/tuoguan.svg'
// import dataSourceActive from '../../assets/datasource_active.svg'
// import mlxActive from '../../assets/MLX_active.svg'
// import modelManageActive from '../../assets/modelManage_active.svg'
// import notConfig from '../../assets/notConfig.svg'
// import running from '../../assets/running.svg'
// import complete from '../../assets/complete.svg'
// import stopped from '../../assets/stopped.svg'
// import failed from '../../assets/failed.svg'
// import { getCharsLen } from '@/common/utils'

@Component({
  components: {
    // GraphSlot
  }
})
export default class GraphNode extends Vue {
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
    required: true,
    type: Boolean
  })
  private isNodeActive!: boolean

  @Prop({
    required: true,
    type: Boolean
  })
  private isLocked!: boolean

  private rectWidth = 198
  private rectHeight = 34
  private imgIconSize = 14
  private statusIconXPosition = 176
  private statusIconYPosition = 10
  private modelIconXPosition = 10
  private modelIconYPosition = 10
  private modelNameXPosition = 30
  private modelNameYPosition = 22

  // get iconSrc() {
  //   switch (this.node.categoryType) {
  //     case 'XT':
  //       return xietong
  //     case 'MSP':
  //       return tuoguan
  //     default:
  //       return dataSourceActive
  //   }
  // }

  // get statusIconSrc() {
  //   return this.node.bindTask ? '' : notConfig
  // }

  // private showMenuTips(event: MouseEvent) {
  //   event.preventDefault()
  //   event.stopPropagation()
  //   MenuTipsController.show({
  //     data: this.node,
  //     x: event.clientX,
  //     y: event.clientY,
  //     type: 'node'
  //   })
  // }

  // private showWarningTips(event: MouseEvent) {
  //   if (!this.node.bindTask) {
  //     WarningTipsController.show({
  //       x: event.clientX,
  //       y: event.clientY,
  //       text: '未添加关联任务'
  //     })
  //   }
  // }

  // private hideWarningTips() {
  //   WarningTipsController.hide()
  // }

  // private showFullNodeName(event: MouseEvent) {
  //   if (this.nodeName === this.node.nodeName) {
  //     return
  //   }

  //   this.timeId = setTimeout(() => {
  //     const nodeElement = (this.$refs[
  //       'node'
  //     ] as SVGRectElement).getBoundingClientRect()
  //     WarningTipsController.show({
  //       x: nodeElement.x + nodeElement.width / 2,
  //       y: nodeElement.y + 10,
  //       text: this.node.nodeName
  //     })
  //   }, 600)
  // }

  // private hideFullNodeName() {
  //   clearTimeout(this.timeId as number)
  //   WarningTipsController.hide()
  // }

  // private handleNodeMouseDown(event: MouseEvent) {
  //   this.hideFullNodeName()
  //   event.stopPropagation()
  //   if (event.button === 0) {
  //     this.$emit('mousedown', {
  //       type: 'node',
  //       x: event.clientX,
  //       y: event.clientY
  //     })
  //   }
  // }

  // private handleSlotMouseDown(value: AddEdgePositionType) {
  //   this.$emit('mousedown', value)
  // }
}
</script>
