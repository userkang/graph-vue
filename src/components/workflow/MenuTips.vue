<template>
  <div ref="menubox">
    <div @click="hideMenuTips" class="menu-mask"></div>
    <ul
      ref="menuTipsRef"
      class="menu-tips"
      :style="{top: tips.y + 2 + 'px', left: tips.x + 2 + 'px'}"
    >
      <template v-if="tips.type === 'group'">
        <li @click="splitNodeGroup">
          <i class="iconfont-custom">&nbsp; &nbsp;</i>
          <i class="iconfont-custom">&#xe65e;</i>拆分节点组
        </li>
        <li @click="execAFO" v-if="showExec">
          <i class="iconfont-custom">&nbsp; &nbsp;</i>
          <i class="iconfont-custom">&#xe65b;</i>执行
        </li>
        <li @click="renameGroup">
          <i class="iconfont-custom">&nbsp; &nbsp;</i>
          <i class="mtdicon mtdicon-edit"></i>重命名
        </li>
      </template>
      <template v-else>
        <li @click="goJobLink" :class="{'disabled': !isBindTask }">
          <i class="iconfont-custom">&nbsp; &nbsp;</i>
          <i class="mtdicon mtdicon-edit"></i>进入任务
        </li>
        <li @click="handleDelete" :class="{'disabled': !canEditGraph }">
          <i class="iconfont-custom">&nbsp; &nbsp;</i>
          <i class="iconfont-custom">&#xe65e;</i>删除
        </li>
        <li @click="rename">
          <i class="iconfont-custom">&nbsp; &nbsp;</i>
          <i class="mtdicon mtdicon-edit"></i>重命名
        </li>
        <li v-if="showAssociateCantorTask" @click="handleAsscociate">
          <i class="iconfont-custom">&nbsp; &nbsp;</i>
          <i class="mtdicon mtdicon-code-off"></i>关联调度
        </li>
        <li v-if="showDQCConfig" @click="configDQC">
          <i class="iconfont-custom">&nbsp; &nbsp;</i>
          <i class="mtdicon mtdicon-edit"></i>DQC配置
          <i
            v-if="DQCState.loading"
            class="mtdicon mtdicon-loading"
            style="color: #4E73FF; vertical-align: -1px"
          ></i>
        </li>
        <li @click="copyNode">
          <i class="iconfont-custom">&nbsp; &nbsp;</i>
          <i class="iconfont-custom">&#xe659;</i>复制
        </li>
        <li @click="reload">
          <i class="iconfont-custom">&nbsp; &nbsp;</i>
          <i class="iconfont-custom">&#xe65b;</i>重导
        </li>
        <li @click="openAutoExtendModal">
          <i class="iconfont-custom">&nbsp; &nbsp;</i>
          <i class="iconfont-custom">&#xe65d;</i>自动扩充
        </li>
        <li v-if="showViewRelatedWorkflows" @click="handleViewRelatedWorkflows">
          <i class="iconfont-custom">&nbsp; &nbsp;</i>
          <i class="mtdicon mtdicon-hierarchy-o"></i>查看关联的工作流
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import {
  DeleteNodeStore,
  NodeReloadStore
} from '@/stores/workflow/graphVisual/GraphVisual'
import {
  MenuTipsController,
  MenuTipsPayload
} from '@/stores/workflow/graphVisual/LocalState'
import { GraphRequestStore } from '@/stores/workflow/graphVisual/GraphContent'
import { SwitchGraphController } from '@/stores/workflow/graphVisual/SwitchGraph'
import {
  NodeCopyStore,
  NodeGroupStore
} from '@/stores/workflow/graphVisual/GraphVisual'
import { ComponentListStore } from '@/stores/workflow/graphVisual/ComponentList'
import { NodeDevelopDetailStore } from '@/stores/workflow/createNode/nodeDevelopDetail'
import { ActiveNodeStore } from '@/stores/workflow/graphVisual/activeNode'
import { DQCStore } from '@/stores/workflow/graphVisual/GraphContent'
@Component({})
export default class MenuTips extends Vue {
  @Prop({
    required: true
  })
  private tips!: MenuTipsPayload

  private switchGraphState = SwitchGraphController.state
  private activeNodeState = ActiveNodeStore.state
  private DQCState = DQCStore.state

  get canEditGraph() {
    return this.switchGraphState.isCurrentGraphCanBeEdit
  }

  get workflowId() {
    return this.switchGraphState.activeGraphExec.workflowId
  }

  get isBindTask() {
    if (this.tips.type === 'node') {
      return (this.tips.data as Workflow.WorkflowNodeVo).bindTask
    }
    return false
  }

  get lastNodeId() {
    return this.activeNodeState.selectNodeIds
  }

  get showExec() {
    if (this.tips.type === 'group') {
      const group = this.tips.data as Workflow.WorkflowNodeGroupVo
      return group.nodes.some(item => {
        return item.componentType === 'AFO_TOOL_TASK'
      })
    }
    return false
  }

  get showAssociateCantorTask() {
    if (this.tips.type === 'node') {
      return (this.tips.data as Workflow.WorkflowNodeVo).categoryType === 'MSP'
    }
    return false
  }

  // TODO: 暂时只支持XT，后续把这个判断删了
  get showDQCConfig() {
    if (this.tips.type === 'node') {
      // return (this.tips.data as Workflow.WorkflowNodeVo).categoryType === 'XT'
      // TODO: 目前只支持XT的离线任务，等支持在线任务时，在恢复为👆的代码
      return (
        (this.tips.data as Workflow.WorkflowNodeVo).componentType ===
        'XT_OFFLINE_TASK'
      )
    }
    return false
  }

  get showViewRelatedWorkflows() {
    if (this.tips.type === 'node') {
      return !!(this.tips.data as Workflow.WorkflowNodeVo).bindTask
    }
    return false
  }

  private openAutoExtendModal() {
    this.$emit('show-auto-extend', {
      nodeId: this.tips.data.id
    })
    this.hideMenuTips()
  }

  private hideMenuTips() {
    MenuTipsController.hide()
  }

  private async goJobLink() {
    this.hideMenuTips()

    const { id, categoryType, bindTask } = this.tips
      .data as Workflow.WorkflowNodeVo

    if (!bindTask) {
      this.$mtd.message({
        type: 'warning',
        message: '请先双击组件关联任务'
      })
      return
    }

    const openNewTab = ['XT', 'MSP'].includes(categoryType)
    const pathParams = {
      workflowId: String(this.workflowId),
      nodeId: String(id)
    }
    if (openNewTab) {
      // TODO：待XT平台支持 https 后修改
      const taskUrl = await NodeDevelopDetailStore.getTaskUrl(pathParams)
      if (taskUrl) {
        window.open(taskUrl)
      }
    } else {
      this.$router.push({
        name: 'nodeDevelopDetail',
        params: pathParams,
        query: {
          // 用来从目标页面再跳回来
          from: this.$route.query.name,
          fromWorkflow: pathParams.workflowId
        }
      })
    }
  }

  private async handleDelete() {
    if (this.canEditGraph) {
      this.hideMenuTips()

      let nodes = []

      if (this.lastNodeId.includes(this.tips.data as Workflow.WorkflowNodeVo)) {
        nodes = this.lastNodeId
      } else {
        nodes = [this.tips.data as Workflow.WorkflowNodeVo]
      }

      await DeleteNodeStore.request({
        workflowId: this.workflowId,
        nodes
      })
    }
  }

  private rename() {
    this.$emit('show-rename', this.tips.data, 'node')
    this.hideMenuTips()
  }

  private async copyNode() {
    if (!(this.tips.data as Workflow.WorkflowNodeVo).bindTask) {
      await NodeCopyStore.updateNode({
        workflowId: this.workflowId,
        nodeId: this.tips.data.id
      })
    } else {
      this.$emit('show-rename', this.tips.data, 'copy')
    }
    this.hideMenuTips()
  }

  private async reload() {
    this.hideMenuTips()
    const url = await NodeReloadStore.reload({
      workflowId: this.workflowId,
      nodeId: this.tips.data.id
    })

    window.open(String(url), '_blank')
  }

  private renameGroup() {
    this.$emit('show-rename', this.tips.data, 'group')
    this.hideMenuTips()
  }

  private async splitNodeGroup() {
    this.hideMenuTips()
    await NodeGroupStore.splitGroup({
      workflowId: this.workflowId,
      nodeGroupId: this.tips.data.id
    })
    await ComponentListStore.getComponentList()
  }

  private async execAFO() {
    this.hideMenuTips()
    await NodeGroupStore.execAFO({
      workflowId: this.workflowId,
      nodeGroupId: this.tips.data.id
    })
  }

  private async handleAsscociate() {
    this.$emit('show-associate', {
      nodeId: this.tips.data.id
    })
    this.hideMenuTips()
  }

  private async configDQC() {
    if (this.DQCState.loading) {
      return
    }
    const dqcUrl = await DQCStore.getDQCUrl(this.workflowId, this.tips.data.id)
    if (dqcUrl) {
      window.open(dqcUrl)
      this.hideMenuTips()
    }
  }

  private handleViewRelatedWorkflows() {
    this.$emit('show-viewRelatedWorkflows', {
      nodeId: this.tips.data.id
    })
    this.hideMenuTips()
  }
}
</script>

<style lang="scss" scoped>
.menu-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
}
.menu-tips {
  width: 170px;
  // height: 136px;
  position: fixed;
  z-index: 100;
  background: #fff;
  box-shadow: 0 1px 4px 0 rgba(50, 57, 131, 0.25);
  border-radius: 1px;
  li {
    height: 34px;
    color: #666;
    font-size: 14px;
    line-height: 34px;
    cursor: pointer;
    text-align: left;
    .second-li {
      width: auto; // 覆盖上面的menu-tips的width
      max-width: 260px;
      display: none;
      position: absolute;
      top: 0;
      .submenu-wrapper {
        display: inline-block; // 让li的宽度占满整个scroll-width
        li {
          white-space: nowrap;
          padding-left: 12px;
        }
      }
    }
    &:hover {
      color: #333;
      background: #f2f3fa;
      .second-li {
        display: inline-block;
      }
    }
    &.disabled {
      cursor: not-allowed;
    }
    &.slide-gap {
      border-bottom: 1px solid #e8e9f2;
    }
    i {
      margin-right: 7px;
      font-size: 12px;
      color: #666;
    }
    .more-icon {
      float: right;
      transform: scale(0.8);
      color: #a6a6a6;
    }
  }
}
.ml-loading {
  display: inline-block;
  margin-left: 6px;
}
</style>
