<template>
  <g v-if="pos">
    <image
      :xlink:href="statusIconSrc"
      :x="pos.groupTextPosX - statusIconXPostion"
      :y="pos.groupTextPosY - statusIconYPostion"
      :width="statusIconSize"
      :height="statusIconSize"
      :style="
        `transform-origin: ${pos.groupTextPosX -
          statusIconXPostion +
          statusIconSize / 2}px ${pos.groupTextPosY -
          statusIconYPostion +
          statusIconSize / 2}px`
      "
      :class="{ rotate: group.status === 30 }"
    >
    </image>
    <text
      style="font-size: 14px;"
      fill="#222"
      :x="pos.groupTextPosX"
      :y="pos.groupTextPosY"
      >{{ groupName }}</text
    >
    <path
      :d="pos.groupPath"
      @mousedown.capture="e => setDragGroupStart(e, group.nodes)"
      @contextmenu.capture="e => showMenuTips(e, group)"
      style="fill: rgb(242, 242, 155, 0.2); stroke: black;"
      stroke-dasharray="5 5"
      v-show="!group.fold"
    />
    <template v-if="!group.fold">
      <GraphNode
        v-for="item in group.nodes"
        :key="item.nodeId"
        :node="item"
        :fromNodeId="fromNodeId"
        :isLocked="isLocked"
        :isNodeActive="isNodeActive(item.id)"
        @mousedown="position => handleNodeClick(item, position)"
        @dblclick.native="handleDoubleClick"
      />
    </template>
    <GraphGroupNode
      v-show="group.fold"
      :posX="pos.foldGroupPosX"
      :posY="pos.foldGroupPosY"
      @showMenuTips="showMenuTips"
      :group="group"
      @mousedown="setDragGroupStart"
      :statusIconSrc="statusIconSrc"
    />
    <image
      @mousedown.capture="handleIconClick"
      :xlink:href="iconSrc"
      :x="pos.iconPosX"
      :y="pos.iconPosY"
      :width="imgIconSize"
      :height="imgIconSize"
    />
  </g>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator'
import GraphNode from '@/components/workflow/GraphNode.vue'
import GraphGroupNode from '@/components/workflow/GraphGroupNode.vue'
import {
  GraphRequestStore,
  GraphVisualStore
} from '@/stores/workflow/graphVisual/GraphContent'
import { AddEdgePositionType, PositionType } from '../../types/graph'
import { MenuTipsController } from '@/stores/workflow/graphVisual/LocalState'
import { ActiveNodeStore } from '@/stores/workflow/graphVisual/activeNode'
import { SwitchGraphController } from '@/stores/workflow/graphVisual/SwitchGraph'
import { getCharsLen } from '@/common/utils'
import add from '@/assets/workflow/add.svg'
import subtract from '@/assets/workflow/subtract.svg'
import { NodeGroupStore } from '@/stores/workflow/graphVisual/GraphVisual'
import notConfig from '@/assets/notConfig.svg'
import running from '@/assets/running.svg'
import complete from '@/assets/complete.svg'
import stopped from '@/assets/stopped.svg'
import failed from '@/assets/failed.svg'

@Component({
  components: {
    GraphNode,
    GraphGroupNode
  }
})
export default class GraphGroup extends Vue {
  @Prop({
    required: true,
    type: Number
  })
  private fromNodeId!: number

  @Prop({
    required: true
  })
  private group!: Workflow.WorkflowNodeGroupVo

  @Prop({
    required: true
  })
  private groupPosition!: { [key: string]: number[] }

  @Prop({
    required: true
  })
  private index!: number

  private graphContentState = GraphVisualStore.state
  private activeNodeState = ActiveNodeStore.state
  private switchGraphState = SwitchGraphController.state
  private modelIconXPosition = 12
  private modelIconYPosition = 5
  private imgIconSize = 24
  private statusIconSize = 14
  private nodeWidth = 198
  private nodeHeight = 34
  private statusIconXPostion = 16
  private statusIconYPostion = 12
  private modelNameXPosition = 20
  private modelNameYPosition = 22

  get iconSrc() {
    return this.group.fold ? add : subtract
  }

  get lastNodeId() {
    return this.activeNodeState.selectNodeIds
  }

  get isLocked() {
    return !this.switchGraphState.isCurrentGraphCanBeEdit
  }

  get workflowId() {
    return Number(this.$route.params.id)
  }

  get groupName() {
    const name = this.group.nodeGroupName

    // 默认超过17个字母就截断
    let limit = 19
    // 如果不是纯英文就把截断限制到9个字符
    if (name && name.length !== getCharsLen(name)) {
      limit = 9
    }

    return getCharsLen(name) > limit ? name.slice(0, limit) + '...' : name
  }

  get statusIconSrc() {
    switch (this.group.status) {
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

  get pos() {
    const padding = 20
    const paddingTop = 58
    const paddingBottom = 35
    const startX = this.groupPosition.startX[this.index]
    const startY = this.groupPosition.startY[this.index]
    const endX = this.groupPosition.endX[this.index]
    const endY = this.groupPosition.endY[this.index]

    if (startX && startY && endX && endY) {
      const groupPath = `M${startX - padding},${startY - paddingTop}H${endX +
        this.nodeWidth +
        padding}V${endY + this.nodeHeight + paddingBottom}H${startX - padding}Z`

      const textIconMargin = this.statusIconSrc ? this.statusIconSize : 0
      let groupTextPosX = 0
      let groupTextPosY = 0

      if (this.group.fold) {
        groupTextPosX =
          endX + padding + this.modelNameXPosition + textIconMargin
        groupTextPosY = startY - paddingTop + this.modelNameYPosition
      } else {
        groupTextPosX = startX + textIconMargin
        groupTextPosY = startY - 34
      }

      return {
        groupPath,
        groupTextPosX,
        groupTextPosY,
        foldGroupPosX: endX + padding,
        foldGroupPosY: startY - paddingTop,
        iconPosX: endX + this.nodeWidth - this.modelIconXPosition,
        iconPosY: startY - paddingTop + this.modelIconYPosition
      }
    } else {
      return null
    }
  }

  private async handleIconClick(e: MouseEvent) {
    e.stopPropagation()
    this.graphContentState.isRefreshEdge = true
    this.group.fold = !this.group.fold
    setTimeout(() => {
      this.graphContentState.isRefreshEdge = false
    }, 0)

    await NodeGroupStore.fold(
      {
        workflowId: this.workflowId,
        nodeGroupId: this.group.id
      },
      this.group.fold
    )
  }

  private isNodeActive(id: number) {
    for (const item of this.lastNodeId) {
      if (item.id === id) {
        return true
      }
    }

    return false
  }

  private handleNodeClick(
    node: Workflow.WorkflowNodeVo,
    position: PositionType | AddEdgePositionType
  ) {
    this.$emit('handleNodeClick', node, position)
  }

  private handleDoubleClick() {
    this.$emit('handleDoubleClick')
  }

  private showMenuTips(event: MouseEvent, group: Workflow.WorkflowNodeGroupVo) {
    event.preventDefault()
    MenuTipsController.show({
      data: group,
      x: event.clientX,
      y: event.clientY,
      type: 'group'
    })
  }

  private setDragGroupStart(e: MouseEvent, nodes: Workflow.WorkflowNodeVo[]) {
    this.$emit('mousedown', e, nodes)
  }
}
</script>

<style lang="scss" scoped>
.rotate {
  animation: circle 3s infinite linear;
}
@keyframes circle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>