<template>
  <MtdForm class="modal-body-wrapper" ref="formRef" :model="formValue" :label-width="110">
    <!-- 较为通用的部分，特意冗余一下 -->
    <NodeTypeFormItem
      @change="handleChange"
      :toolType="NodeInfoMixin__toolType"
      :formCustom="formValue"
    ></NodeTypeFormItem>
    <NodeNameFormItem :formCustom="formValue"></NodeNameFormItem>
    <NodeDescFormItem :formCustom="formValue"></NodeDescFormItem>
    <CreateTypeFormItem @change="handleChange" :formCustom="formValue"></CreateTypeFormItem>
    <NodeProjectFormItem v-if="showNodeProject" @change="handleChange" :formCustom="formValue"></NodeProjectFormItem>
    <!-- 业务逻辑 -->

    <template v-if="formValue.createType === 'relate'">
      <MtdFormItem label="任务名称" prop="jobName" :rules="rules">
        <mtd-autocomplete
          :data="relatedTaskList"
          v-model="formValue.jobName"
          suffix-icon="mtdicon mtdicon-search"
          :placeholder="ruleMessage"
          class="form-item-sub-content"
          @search="throttleHandleTaskSearch"
          @blur="handleTaskSearchBlur"
        />
      </MtdFormItem>
      <MtdFormItem
        v-if="CantorTasksState.show"
        label="关联调度"
        prop="cantorName"
        :rules="{
          required: true,
          message: '请选择关联调度'
        }"
      >
        <mtd-select
          v-model="formValue.cantorName"
          :loading="CantorTasksState.loading"
          class="form-item-sub-content"
        >
          <mtd-option
            v-for="item in CantorTasksState.cantorTasks"
            :key="item"
            :value="item"
          >{{ item }}</mtd-option>
        </mtd-select>
      </MtdFormItem>
    </template>
    <template v-else>
      <MspJobNameFormItem :formCustom="formValue"></MspJobNameFormItem>

      <GitReposFormItem :formCustom="formValue"></GitReposFormItem>

      <SubDirFormItem :formCustom="formValue"></SubDirFormItem>

      <GitBranchFormItem :formCustom="formValue"></GitBranchFormItem>

      <!--pyspark -->
      <MainPyFormItem v-if="formValue.nodeType === 'MSP_PY_SPARK'" :formCustom="formValue"></MainPyFormItem>

      <!--spark,mapReduce -->
      <MainFuncFormItem v-else :formCustom="formValue"></MainFuncFormItem>

      <TaskQueueFormItem :formCustom="formValue"></TaskQueueFormItem>
    </template>
  </MtdForm>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import NodeTypeFormItem from '../formItem/NodeTypeFormItem.vue'
import NodeNameFormItem from '../formItem/NodeNameFormItem.vue'
import NodeDescFormItem from '../formItem/NodeDescFormItem.vue'
import NodeProjectFormItem from '../formItem/NodeProjectFormItem.vue'
import CreateTypeFormItem from '../formItem/CreateTypeFormItem.vue'

import MspJobNameFormItem from '../formItem/MspJobNameFormItem.vue'
import GitReposFormItem from '../formItem/GitReposFormItem.vue'
import SubDirFormItem from '../formItem/SubDirFormItem.vue'
import GitBranchFormItem from '../formItem/GitBranchFormItem.vue'
import MainPyFormItem from '../formItem/MainPyFormItem.vue'
import MainFuncFormItem from '../formItem/MainFuncFormItem.vue'
import TaskQueueFormItem from '../formItem/TaskQueueFormItem.vue'

import { ToolTaskMspStore } from '@/stores/workflow/createNode/toolTaskMsp'
import { TaskSearchStore } from '@/stores/workflow/createNode/taskSearch'
import MtdForm from '@ss/mtd-vue/types/form'
import { IToolTaskMspPayload } from '@/stores/workflow/createNode/toolTaskMsp'
import { TaskQueueStore } from '@/stores/workflow/createNode/taskQueue'
import { ProjectListStore } from '@/stores/graph/GraphList'
import { CantorTasksStore } from '@/stores/workflow/createNode/cantorTasks'

import { ValidatableForm } from '../interfaces'
import { NodeInfoMixin } from '../mixins'

import * as _ from 'lodash'

@Component({
  components: {
    NodeTypeFormItem,
    NodeNameFormItem,
    NodeDescFormItem,
    NodeProjectFormItem,
    CreateTypeFormItem,
    MspJobNameFormItem,
    GitReposFormItem,
    SubDirFormItem,
    GitBranchFormItem,
    MainPyFormItem,
    MainFuncFormItem,
    TaskQueueFormItem
  }
})
export default class MSPForm extends Mixins(NodeInfoMixin)
  implements ValidatableForm {
  @Prop({ type: Boolean })
  ready!: boolean

  get relatedTaskList() {
    return this.taskSearchStoreState.value.taskList
  }
  get showNodeProject() {
    return this.formValue.createType === 'create'
  }
  componentName = 'MSPForm'
  formValue = {
    nodeType: '',
    nodeName: '',
    nodeDesc: '',
    nodeProject: '',
    createType: 'relate',
    jobNamePrefix: '',
    jobName: '',
    cantorName: '',
    repos: '',
    branch: '',
    subDir: '',
    mainPy: '',
    queue: '',
    mainFunc: ''
  }

  ruleMessage: string = '请输入任务名称'

  rules = [{ required: true, message: this.ruleMessage }]

  taskSearchStoreState = TaskSearchStore.state
  projectListState = ProjectListStore.state
  CantorTasksState = CantorTasksStore.state

  throttleHandleTaskSearch = _.throttle(this.handleTaskSearch, 800)

  @Watch('formValue.nodeProject', { immediate: true })
  onNodeProjectChange(nodeProject: string) {
    if (nodeProject) {
      this.formValue.queue = ''
      TaskQueueStore.getTaskQueue(nodeProject)
    }
  }

  @Watch('formValue.jobName', { immediate: true })
  onJobNameChangeImmediate(jobName: string) {
    this.formValue.cantorName = ''
  }

  @Watch('formValue.jobName')
  onJobNameChange() {
    // 只有relate的时候需要有这个限制，防止用户提前点确定按钮
    if (this.formValue.createType === 'relate') {
      this.$emit('update:ready', false)
    }
  }

  @Watch('formValue.createType')
  onCreateTypeChange(val: string) {
    // 切换任务创建类型后，要做一些针对性的变动
    if (val === 'create') {
      this.$emit('update:ready', true)
    } else {
      this.formValue.jobName = ''
    }
  }

  created() {
    CantorTasksStore.reset()
    this.handleChange()

    // 默认选择项目组第一个
    this.formValue.nodeProject = this.projectListState.value[0]?.name
    this.formValue.nodeType = this.NodeInfoMixin__nodeType
  }

  handleTaskSearch() {
    TaskSearchStore.getTaskList(this.formValue.jobName)
  }

  async handleTaskSearchBlur() {
    if (this.formValue.jobName) {
      await CantorTasksStore.update(this.formValue.jobName)
      this.$emit('update:ready', true)
    } else {
      CantorTasksStore.reset()
    }
  }

  async handleChange() {
    if (this.formValue.createType === 'create') {
      this.formValue.jobNamePrefix = await ToolTaskMspStore.getJobPrefix({
        toolTaskType: this.formValue.nodeType,
        projectName: this.formValue.nodeProject
      })
    }
  }

  // 对外接口
  validate() {
    return new Promise<IToolTaskMspPayload>((resolve, reject) => {
      ;(this.$refs.formRef as MtdForm).validate(valid => {
        if (valid) {
          resolve({
            nodeName: this.formValue.nodeName,
            desc: this.formValue.nodeDesc,
            createType: this.formValue.createType,
            jobName: this.formValue.jobName,
            cantorName: this.formValue.cantorName,
            projectName: this.showNodeProject ? this.formValue.nodeProject : '', // 如果不展示nodeProject，那么传空字符串
            toolTaskType: this.formValue.nodeType,
            repos: this.formValue.repos,
            branch: this.formValue.branch,
            subDir: this.formValue.subDir,
            mainPy: this.formValue.mainPy,
            queue: this.formValue.queue,
            mainClass: this.formValue.mainFunc
          })
        } else {
          reject()
        }
      })
    })
  }
}
</script>