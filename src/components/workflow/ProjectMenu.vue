<template>
  <div>
    <div @click="hideMenuTips" class="menu-mask"></div>
    <ul
      id="projectMenu"
      class="menu-tips"
      :style="{top: tips.y + 2 + 'px', left: tips.x + 2 + 'px'}"
    >
      <li v-if="tips.type === 'project' && tips.data.level < 4" @click="handleCreateProject">
        <i class="mtdicon mtdicon-file-add-o"></i>新建目录
      </li>
      <li v-if="tips.type === 'project'" @click="handleCreateWorkflow">
        <i class="mtdicon mtdicon-file-add-o"></i>新建工作流
      </li>
      <li @click="handleCopy">
        <i class="mtdicon mtdicon-copy-o"></i>复制
      </li>
      <li @click="handleRename">
        <i class="mtdicon mtdicon-edit-o"></i>重命名
      </li>
      <li @click="handleDelete">
        <i class="mtdicon mtdicon-delete-o"></i>删除
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ProjectListStore } from '@/stores/workflow/ProjectList'
import {
  ProjectMenuStore,
  MenuTipsPayload
} from '../../stores/workflow/ProjectMenu'
import { HistoryListController } from '../../stores/workflow/graphVisual/HistoryList'
import { GraphVisualStore } from '../../stores/workflow/graphVisual/GraphContent'
import { SwitchGraphController } from '../../stores/workflow/graphVisual/SwitchGraph'
import { ActiveWorkflowStore } from '../../stores/workflow/graphVisual/activeWorkflow'

@Component({
  components: {}
})
export default class ProjectMenu extends Vue {
  @Prop({
    required: true
  })
  private tips!: MenuTipsPayload

  private hideMenuTips() {
    ProjectMenuStore.hide()
  }

  private handleCreateWorkflow() {
    const id = (this.tips.data as Workflow.WorkflowGroupVo).id
    this.$emit('showCreateWorkflow', id)
  }

  private handleCreateProject() {
    const id = (this.tips.data as Workflow.WorkflowGroupVo).id
    this.$emit('showCreateProject', id)
  }

  private async handleCopy() {
    if (this.tips.type === 'project') {
      await ProjectListStore.copyProject(
        (this.tips.data as Workflow.WorkflowGroupVo).id
      )
    } else {
      await ProjectListStore.copyWorkflow(
        (this.tips.data as Workflow.WorkflowBasicVo).id
      )
    }
  }

  private handleRename() {
    this.$emit('showRenameModal', 'rename', this.tips.data)
  }

  private async handleDelete() {
    const tip =
      this.tips.type === 'project'
        ? `您确定要删除【${
            (this.tips.data as Workflow.WorkflowGroupVo).groupName
          }】目录及其包含的工作流吗？`
        : `您确定要删除【${
            (this.tips.data as Workflow.WorkflowBasicVo).workflowName
          }】工作流吗？`

    await this.$mtd.confirm({
      title: `提示`,
      message: tip,
      showCancelButton: true,
      okButtonText: '删除',
      okButtonProps: {
        type: 'danger'
      }
    })

    if (this.tips.type === 'project') {
      await ProjectListStore.deleteProject(
        (this.tips.data as Workflow.WorkflowGroupVo).id
      )
      ;(this.tips.data as Workflow.WorkflowGroupVo).workflows.forEach(
        async item => {
          await this.closeGraph({
            workflowId: item.id,
            name: ''
          })
        }
      )
    } else {
      await ProjectListStore.deleteWorkflow(
        (this.tips.data as Workflow.WorkflowBasicVo).id
      )

      await this.closeGraph({
        workflowId: (this.tips.data as Workflow.WorkflowBasicVo).id,
        name: '',
        isActive:
          (this.tips.data as Workflow.WorkflowBasicVo).id ===
          Number(this.$route.params.id)
      })
    }
  }

  private async closeGraph(value: Workflow.GraphItemType) {
    const newActiveItem = await HistoryListController.removeGraph(value)

    await SwitchGraphController.set(newActiveItem, false)
    // if history graph list is null, clean graph content data
    if (!newActiveItem.workflowId) {
      await this.cleanContent()
    }
  }

  private async cleanContent() {
    GraphVisualStore.cleanContent()
    ActiveWorkflowStore.clean()
    SwitchGraphController.cleanActiveGraph()
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
  pointer-events: none;
}
.menu-tips {
  width: 120px;
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
    padding-left: 20px;
    cursor: pointer;
    text-align: left;
    &:hover {
      color: #333;
      background: #f2f3fa;
    }
    i {
      margin-right: 7px;
      font-size: 12px;
      color: #666;
    }
  }
}
.ml-loading {
  display: inline-block;
  margin-left: 6px;
}
</style>