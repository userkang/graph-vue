<template>
  <g @mousedown="handleNodeMouseDown">
    <rect
      ref="node"
      data-type="node"
      class="graph-node"
      :style="{
        stroke: isNodeActive ? '#606BE1' : '#DEDFEC',
        fill: isNodeActive ? '#E3E6FF' : '#FFF'
      }"
      :width="rectWidth"
      :height="rectHeight"
      :x="node.posX"
      :y="node.posY"
      rx="2"
      ry="2"
    ></rect>
    <foreignObject
      :x="node.posX"
      :y="node.posY"
      :width="rectWidth"
      :height="rectHeight"
    >
      <div class="node-content">{{ isNodeActive }}</div>
    </foreignObject>
    <GraphSlot
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
    />
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { INodeType } from '../../types/dag'
// import { AddEdgePositionType, NodeVoType } from '@/types/graph'
import GraphSlot from '@/components/graph/graph-slot.vue'
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
    GraphSlot
  }
})
export default class GraphNode extends Vue {
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
    required: true,
    type: Boolean
  })
  isNodeActive!: boolean

  rectWidth = 190
  rectHeight = 34

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

  handleNodeMouseDown(e: MouseEvent) {
    e.stopPropagation()

    this.$emit('clickNode', e, this.node)
  }

  private handleSlotMouseDown(value: AddEdgePositionType) {
    this.$emit('clickSlot', value)
  }
}
</script>

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
.node-content {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #666;
  cursor: pointer;
}
</style>
