<template>
  <div style="height: 100%">
    <CreateProjectModal
      :visible.sync="isShowProjectModal"
      :modalType="modalType"
      :biz="defalutValue"
      :data="editData"
      :groupId="groupId"
    />

    <CreateWorkflowModal
      :visible.sync="isShowWorkflowModal"
      :modalType="modalType"
      :data="editData"
      :groupId="groupId"
    />

    <div class="flex-justify-v-center filter-wrapper">
      <div class="cascader-wrapper">
        <mtd-cascader
          v-model="defalutValue"
          style="width: 100%"
          size="small"
          :data="bizList"
          expand-trigger="click"
          @change="bizChange"
        />
      </div>
      <mtd-button
        icon="mtdicon mtdicon-add"
        size="small"
        type="primary"
        @click="showCreateProjectModal(id = 0)"
      >目录</mtd-button>
    </div>

    <mtd-tree
      draggable
      class="tree-menu"
      :data="projectList"
      node-key="treeId"
      :allow-drop="allowDrop"
      @contextmenu.native="(e) => e.preventDefault()"
      @node-click="openGraph"
      @node-drop="dropNode"
      :node-class="getNodeClass"
    >
      <div
        class="tree-item"
        slot-scope="{ node, data }"
        :data-id="data.id"
        :data-type="data.type"
        @contextmenu="(e) => showMenuTips(e, data, data.type)"
      >
        <i v-if="data.type === 'workflow'" class="mtdicon mtdicon-hierarchy-o"></i>
        {{ data.title }}
      </div>
    </mtd-tree>

    <ProjectMenu
      @showRenameModal="showModal"
      @showCreateWorkflow="showCreateWorkflowModal"
      @showCreateProject="showCreateProjectModal"
      :tips="tips"
      v-if="menuTipsValue.isShow"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import ProjectMenu from '@/components/workflow/ProjectMenu.vue'
import {
  ProjectMenuStore,
  MenuTipsPayload
} from '@/stores/workflow/ProjectMenu'
import { ProjectListStore } from '@/stores/workflow/ProjectList'
import { ProjectListStore as ProjectGroupStore } from '@/stores/graph/GraphList'
import draggable from 'vuedraggable'
import CreateProjectModal from '@/components/workflow/CreateProjectModal.vue'
import CreateWorkflowModal from '@/components/workflow/CreateWorkflowModal.vue'
import { SwitchGraphController } from '@/stores/workflow/graphVisual/SwitchGraph'
import { WXProjectVoType } from '../../types/graph'

@Component({
  components: {
    ProjectMenu,
    draggable,
    CreateProjectModal,
    CreateWorkflowModal
  }
})
export default class Project extends Vue {
  menuTipsState = ProjectMenuStore.state
  projectListState = ProjectListStore.state
  projectGroupState = ProjectGroupStore.state
  options = []
  isShowProjectModal = false
  isShowWorkflowModal = false

  modalType = 'create'
  editData: unknown = {}
  groupId = ''
  defalutValue: string[] = []

  get projectList() {
    return this.projectListState.list
  }

  get bizList() {
    return this.projectListState.bizList.map((item: Workflow.BizLineVo) => {
      const children = item.bizSubjects.map((v: Workflow.BizSubjectVo) => {
        return {
          value: v.bizSubject,
          label: v.bizSubjectName
        }
      })

      return {
        value: item.bizLine,
        label: item.bizLineName,
        children
      }
    })
  }

  get menuTipsValue() {
    return this.menuTipsState.value
  }

  get tips() {
    const v = this.$nextTick(() => {
      const menuDom = document.getElementById('projectMenu') as HTMLDivElement
      const menuHeight = menuDom.getBoundingClientRect().height
      const clientHeight = document.body.clientHeight
      const shimY = this.menuTipsValue.y

      this.menuTipsValue.y =
        shimY + menuHeight - clientHeight > 0
          ? clientHeight - menuHeight - 5
          : shimY
    })

    return {
      ...this.menuTipsValue
    }
  }

  allowDrop(dragingNode: any, dropNode: any, type: string) {
    if (dropNode.data.type === 'project' && type === 'inner') {
      return true
    } else if (
      dropNode.level === 0 &&
      dragingNode.data.type === 'project' &&
      dropNode.data.type === 'project' &&
      type !== 'inner'
    ) {
      return true
    }
  }

  dropNode(before: any, after: any, type: string) {
    const dragId = before.data.id
    let targetId = after.data.id

    if (type !== 'inner') {
      targetId = after.data.parentId
    }

    if (before.data.type === 'workflow') {
      ProjectListStore.moveWorkflow(dragId, targetId)
    } else {
      ProjectListStore.moveGroup(dragId, targetId)
    }
  }

  showMenuTips(
    event: MouseEvent,
    value: Workflow.WorkflowBasicVo | Workflow.WorkflowGroupVo,
    type: string
  ) {
    event.preventDefault()
    event.stopPropagation()

    ProjectMenuStore.show({
      data: value,
      x: event.clientX,
      y: event.clientY,
      type
    })
  }

  showCreateProjectModal(id = '') {
    this.isShowProjectModal = true
    this.modalType = 'create'
    this.groupId = id
  }

  showCreateWorkflowModal(id = '') {
    this.isShowWorkflowModal = true
    this.modalType = 'create'
    this.groupId = id
  }

  showModal(
    type: string,
    data: Workflow.WorkflowBasicVo | Workflow.WorkflowGroupVo
  ) {
    if (data.type === 'project') {
      this.isShowProjectModal = true
    } else {
      this.isShowWorkflowModal = true
    }

    this.editData = data

    this.modalType = type
  }

  hideMenuTips() {
    ProjectMenuStore.hide()
  }

  getBizDefaultValue() {
    const projectInfo: WXProjectVoType = JSON.parse(
      localStorage.getItem('ml.projectInfo') as string
    )
    if (projectInfo.bizLine) {
      this.defalutValue = [
        projectInfo.bizLine as string,
        projectInfo.bizSubject as string
      ]
      ProjectListStore.setBizSubject(projectInfo.bizSubject as string)
    } else {
      this.defalutValue = [
        this.bizList[0].value,
        this.bizList[0].children[0].value
      ]
      ProjectListStore.setBizSubject(this.bizList[0].children[0].value)
    }
  }

  async openGraph(node: { data: Workflow.WorkflowVo }) {
    this.hideMenuTips()
    if (node.data.type === 'workflow') {
      await SwitchGraphController.set(
        {
          workflowId: node.data.id,
          name: node.data.workflowName
        },
        true
      )
    }
  }

  async bizChange() {
    ProjectListStore.setBizSubject(this.defalutValue[1])
    await ProjectListStore.getProjectList()
  }

  async mounted() {
    await ProjectListStore.getBizList()
    this.getBizDefaultValue()
    await ProjectListStore.getProjectList()
    document.addEventListener('click', this.hideMenuTips)
  }

  getNodeClass(node: any, data: any) {
    return data.isProject ? 'is-project' : ''
  }

  beforeDestory() {
    document.removeEventListener('click', this.hideMenuTips)
  }
}
</script>

<style lang="scss" scoped>
.filter-wrapper {
  margin-top: 10px;
  padding: 0 5px;
}
.tree-menu {
  margin-top: 10px;
  user-select: none;
  height: calc(100% - 36px);
  overflow: auto;
  padding-bottom: 50px;
  background: #fff;
  ::v-deep .mtd-tree-node-content {
    padding: 0;
  }
  ::v-deep .is-project {
    height: 34px;
  }
}
.drag-item {
  background: #fff;
}
.cascader-wrapper {
  flex: 1;
  margin-right: 7px;
}
.tree-item {
  // background: red;
  height: 34px;
  padding: 7px 0 7px 24px;
  margin-left: -24px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>