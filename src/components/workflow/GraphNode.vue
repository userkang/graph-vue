<template>
  <g
    @contextmenu.capture="showMenuTips"
    @mousedown="handleNodeMouseDown"
    :style="{cursor: isLocked && 'not-allowed'}"
  >
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
    <image
      :xlink:href="iconSrc"
      :x="node.posX + modelIconXPosition"
      :y="node.posY + modelIconYPosition"
      :width="imgIconSize"
      :height="imgIconSize"
      style="pointer-events: none;"
    />
    <text
      data-type="node"
      :x="node.posX + modelNameXPosition"
      :y="node.posY + modelNameYPosition"
      fill="#666666"
      style="font-size: 14px;"
      @mouseover.capture="showFullNodeName"
      @mouseout.capture="hideFullNodeName"
      @mousedown.capture="handleNodeMouseDown"
    >{{nodeName}}</text>
    <text
      v-if="node.execTime"
      :x="node.posX"
      :y="node.posY + 50"
      fill="#666"
      style="font-size: 11px"
    >最近执行时间：{{node.execTime}}</text>
    <defs>
      <filter
        v-for="({id, color}) in defsFilters"
        x="-0.1"
        y="0"
        width="1.2"
        height="1"
        :id="id"
        :key="id"
      >
        <feFlood :flood-color="color" />
        <feComposite
          in="SourceGraphic"
          operator="xor"
        />
      </filter>
    </defs>
    <text
      v-for="({text, filter}, index) in getInfosOnNode(node)"
      :filter="filter"
      :x="node.posX + 20 * (index)"
      :y="node.posY - 10"
      fill="#fff"
      style="font-size: 10px;"
      :key="text"
    >{{ text}}</text>
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
} from '@/stores/workflow/graphVisual/LocalState'
import GraphSlot from './GraphSlot.vue'
import dataSource from '../../assets/dataSource.svg'
import mlx from '../../assets/mlx.svg'
import modelManage from '../../assets/modelManage.svg'
import xietong from '../../assets/workflow/xietong.svg'
import tuoguan from '../../assets/workflow/tuoguan.svg'
import dataSourceActive from '../../assets/datasource_active.svg'
import mlxActive from '../../assets/MLX_active.svg'
import modelManageActive from '../../assets/modelManage_active.svg'
import notConfig from '../../assets/notConfig.svg'
import running from '../../assets/running.svg'
import complete from '../../assets/complete.svg'
import stopped from '../../assets/stopped.svg'
import failed from '../../assets/failed.svg'
import { getCharsLen } from '@/common/utils'

@Component({
  components: {
    GraphSlot
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
  private scheduleQueue = {
    weekly: '周',
    daily: '天',
    hour: '小时',
    monthly: '月',
    crontab: '自定义'
  }
  private timeId!: null | number

  private defsFilters = [
    {id: 'solid-for-schedule', color: '#5ABB3C'},
    {id: 'solid-for-dqc', color: '#3a7fad'},
  ]

  get nodeName() {
    const name = this.node.nodeName
    // 默认超过17个字母就截断
    let limit = 17
    // 如果不是纯英文就把截断限制到9个字符
    if (name && name.length !== getCharsLen(name)) {
      limit = 9
    }

    return getCharsLen(name) > 17 ? name.slice(0, limit) + '...' : name
  }

  get canEditGraph() {
    return (this.$store.state as any).isCurrentGraphCanBeEdit
  }

  get iconSrc() {
    switch (this.node.categoryType) {
      case 'XT':
        return xietong
      case 'MSP':
        return tuoguan
      default:
        return dataSourceActive
    }
  }

  get statusIconSrc() {
    return this.node.bindTask ? '' : notConfig
  }

  private showMenuTips(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    MenuTipsController.show({
      data: this.node,
      x: event.clientX,
      y: event.clientY,
      type: 'node'
    })
  }

  private showWarningTips(event: MouseEvent) {
    if (!this.node.bindTask) {
      WarningTipsController.show({
        x: event.clientX,
        y: event.clientY,
        text: '未添加关联任务'
      })
    }
  }

  private hideWarningTips() {
    WarningTipsController.hide()
  }

  private showFullNodeName(event: MouseEvent) {
    if (this.nodeName === this.node.nodeName) {
      return
    }

    this.timeId = setTimeout(() => {
      const nodeElement = (this.$refs[
        'node'
      ] as SVGRectElement).getBoundingClientRect()
      WarningTipsController.show({
        x: nodeElement.x + nodeElement.width / 2,
        y: nodeElement.y + 10,
        text: this.node.nodeName
      })
    }, 1200)
  }

  private hideFullNodeName() {
    clearTimeout(this.timeId as number)
    WarningTipsController.hide()
  }

  private handleNodeMouseDown(event: MouseEvent) {
    this.hideFullNodeName()
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

  private getInfosOnNode(node: Workflow.WorkflowNodeVo) {
    const infos = []
    if (node.scheduleQueueName) {
      infos.push({
        text: this.scheduleQueue[node.scheduleQueueName],
        filter: 'url(#solid-for-schedule)'
      })
    }
    if (node.dqcStatus === 'ONLINE') {
      infos.push({
        text: 'DQC',
        filter: 'url(#solid-for-dqc)'
      })
    }
    return infos
  }
}
</script>
