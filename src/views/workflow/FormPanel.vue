<template>
  <section
    class="form-panel-wrap"
    :class="{ 'unfold-table-panel': isRightTableShow }"
    v-show="isRightTableShow"
  >
    <h3 class="title">{{ workflowInfo.isActive ? '工作流属性' : '节点属性' }}</h3>
    <WorkflowInfo v-if="workflowInfo.isActive"></WorkflowInfo>
    <div v-else class="node-info-container">
      <NodeBaseInfo :workflowId="workflowId" :nodeId="nodeId"></NodeBaseInfo>
      <NodeTaskInfo @changeTimeType="changeTimeType"></NodeTaskInfo>
      <NodeUpstream v-if="activeNodeTaskInfo.flagRequset"></NodeUpstream>
      <NodeExtraInfo v-if="activeNodeTaskInfo.flagRequset"></NodeExtraInfo>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import WorkflowInfo from '@/components/workflow/nodeInfo/WorkflowInfo.vue'
import NodeBaseInfo from '@/components/workflow/nodeInfo/NodeBaseInfo.vue'
import NodeTaskInfo from '@/components/workflow/nodeInfo/NodeTaskInfo.vue'
import NodeUpstream from '@/components/workflow/nodeInfo/NodeUpstream.vue'
import NodeExtraInfo from '@/components/workflow/nodeInfo/NodeExtraInfo.vue'
import { ActiveWorkflowStore } from '@/stores/workflow/graphVisual/activeWorkflow'
import {
  ActiveNodeBaseInfoStore,
  ActiveNodeTaskInfoStore,
  ActiveNodeUpstreamInfoStore,
  ActiveNodeExtraInfoStore
} from '@/stores/workflow/graphVisual/activeNode'
import { ActiveNodeController } from '@/stores/workflow/graphVisual/LocalState'
import { SwitchGraphController } from '@/stores/workflow/graphVisual/SwitchGraph'
import eventBus from '@/common/bus'

@Component({
  components: {
    WorkflowInfo,
    NodeBaseInfo,
    NodeTaskInfo,
    NodeUpstream,
    NodeExtraInfo
  }
})
export default class FormPanel extends Vue {
  @Prop({
    type: Boolean,
    required: true
  })
  private isRightTableShow!: boolean
  private activeNodeTaskInfoState = ActiveNodeTaskInfoStore.state
  private activeNodeState = ActiveNodeController.state
  private activeWorkflowState = ActiveWorkflowStore.state
  private switchGraphState = SwitchGraphController.state
  private timeType = 'latestWeek'

  get activeNodeTaskInfo() {
    return this.activeNodeTaskInfoState.value
  }

  get workflowInfo() {
    return this.activeWorkflowState.value
  }

  get nodeId() {
    return String(this.activeNodeState.value.nodeId)
  }

  get workflowId() {
    return String(this.switchGraphState.activeGraphExec.workflowId)
  }

  private changeTimeType(v: string) {
    this.timeType = v
    ActiveNodeTaskInfoStore.getTaskInfo({
      workflowId: this.workflowId,
      nodeId: this.nodeId,
      timeType: this.timeType
    })
  }

  // TODO: 一会删掉
  @Watch('workflowId', {
    immediate: true
  })
  private handleWorkflowIdChange(v: string) {
    if (v && v !== '0') {
      ActiveWorkflowStore.request(v)
    }
  }

  @Watch('nodeId')
  private async handleInfo() {
    if (this.workflowId && Number(this.nodeId)) {
      ActiveNodeBaseInfoStore.getBaseInfo({
        workflowId: this.workflowId,
        nodeId: this.nodeId
      })

      await ActiveNodeTaskInfoStore.getTaskInfo({
        workflowId: this.workflowId,
        nodeId: this.nodeId,
        timeType: this.timeType
      })

      if (this.activeNodeTaskInfo.flagRequset) {
        ActiveNodeUpstreamInfoStore.getUpstreamInfo({
          workflowId: this.workflowId,
          nodeId: this.nodeId
        })
        ActiveNodeExtraInfoStore.getExtraInfo({
          workflowId: this.workflowId,
          nodeId: this.nodeId
        })
      }
    }
  }

  private created() {
    eventBus.$on('refresh-form-panel', this.handleInfo)
  }
}
</script>
<style lang="scss" scoped>
$border-color: #e4e8f5;

.unfold-table-panel {
  width: 200px;
  min-width: 200px;
  max-width: 40%;
  overflow: auto;
}

.form-panel-wrap {
  box-sizing: border-box;
  padding: 10px 6px 0 6px;
  background: #f7f9ff;
  border-left: 1px solid $border-color;
  box-shadow: 0 1px 2px 0 rgba(50, 54, 101, 0.08);
  .title {
    height: 34px;
    text-align: center;
    font-size: 14px;
    color: #666666;
    border-bottom: 1px solid $border-color;
  }
}
.node-info-container {
  ::v-deep.param-wrap {
    padding-bottom: 12px;
    margin-top: 12px;
    border-bottom: 1px solid #e4e8f5;
    .param-title {
      display: flex;
      position: relative;
      height: 22px;
      .slide {
        position: absolute;
        display: inline-block;
        left: 0;
        top: 4px;
        background: #606be1;
        width: 2px;
        height: 14px;
      }
      .comp-name {
        position: absolute;
        top: 0;
        left: 20px;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #666666;
        margin-left: 4px;
      }
      .fold-param-icon {
        color: #d3d8eb;
        font-size: 12px;
        position: absolute;
        top: 0;
        left: 10px;
        &.fold-status {
          transform: rotate(-90deg);
        }
      }
    }
    .param-content {
      text-align: left;
      .mtd-btn-text {
        font-size: 12px;
        color: #4e73ff;
        padding-left: 0;
      }
    }
    .param-item-label {
      display: block;
      font-size: 12px;
      color: #8a94c2;
      text-align: left;
      font-weight: normal;
      margin-top: 12px;
      margin-bottom: 6px;
      i {
        color: #606be1;
        font-size: 12px;
      }
    }
    .label-text {
      text-align: left;
      color: #666;
      font-size: 12px;
      word-break: break-all;
      word-wrap: break-word;
      margin: 5px 0;
      line-height: 1.5;
    }
  }
}
</style>
