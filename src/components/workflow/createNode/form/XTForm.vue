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
        <mtd-input
          class="form-item-sub-content"
          :placeholder="ruleMessage"
          v-model="formValue.jobName"
        />
      </MtdFormItem>
      <MtdFormItem>
        <span
          class="node-name-tips"
        >说明：任务名字必须符合&lt;dsn&gt;.&lt;table&gt;格式，dsn是要写入数据的目标dsn名，table是要写入的数据的目标表名，例如hmart_waimai.test</span>
      </MtdFormItem>
    </template>
    <template v-else>
      <!-- 离线任务 -->
      <template v-if="formValue.nodeType === 'XT_OFFLINE_TASK'">
        <XtJobNameFormItem :formCustom="formValue"></XtJobNameFormItem>
      </template>

      <!-- 同步任务 -->
      <template v-else>
        <SourceEngineFormItem :formCustom="formValue"></SourceEngineFormItem>

        <TargetEngineFormItem :formCustom="formValue"></TargetEngineFormItem>

        <!-- 目标任务tips -->
        <mtd-form-item v-if="typeNotice.noticeCom || typeNotice.wikiName">
          <div class="node-name-tips">
            <span v-if="typeNotice.noticeCom">{{ typeNotice.noticeCom }}</span>
            <span v-if="typeNotice.wikiName">
              使用方式见 wiki：
              <a click="handleJumpToWiki(typeNotice.wikiUrl)">{{ typeNotice.wikiName }}</a>
            </span>
          </div>
        </mtd-form-item>

        <XtJobNameFormItem :formCustom="formValue"></XtJobNameFormItem>
      </template>
      <!-- 任务名字tips -->
      <mtd-form-item>
        <span
          class="node-name-tips"
        >说明：任务名字必须符合&lt;dsn&gt;.&lt;table&gt;格式，dsn是要写入数据的目标dsn名，table是要写入的数据的目标表名，例如hmart_waimai.test</span>
      </mtd-form-item>
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
import XtJobNameFormItem from '../formItem/XtJobNameFormItem.vue'
import SourceEngineFormItem from '../formItem/SourceEngineFormItem.vue'
import TargetEngineFormItem from '../formItem/TargetEngineFormItem.vue'

import { SyncTypeNoticeStore } from '@/stores/workflow/createNode/syncTypeNotice'
import MtdForm from '@ss/mtd-vue/types/form'
import { IToolTaskXtPayload } from '@/stores/workflow/createNode/toolTaskXt'
import { DataEngineStore } from '@/stores/workflow/createNode/dataEngine'
import { ProjectListStore } from '@/stores/graph/GraphList'

import { NodeInfoMixin } from '../mixins'
import { ValidatableForm } from '../interfaces'

@Component({
  components: {
    NodeTypeFormItem,
    NodeNameFormItem,
    NodeDescFormItem,
    NodeProjectFormItem,
    CreateTypeFormItem,
    XtJobNameFormItem,
    SourceEngineFormItem,
    TargetEngineFormItem
  }
})
export default class XTForm extends Mixins(NodeInfoMixin)
  implements ValidatableForm {
  componentName = 'XTForm'
  formValue = {
    nodeType: '',
    nodeName: '',
    nodeDesc: '',
    nodeProject: '',
    createType: 'relate',
    jobName: '',
    sourceEngine: '',
    destEngine: ''
  }

  ruleMessage: string = '请输入任务名称'

  rules = [{ required: true, message: this.ruleMessage }]

  syncTypeNoticeState = SyncTypeNoticeStore.state
  projectListState = ProjectListStore.state

  get typeNotice() {
    return this.syncTypeNoticeState.value
  }

  get showNodeProject() {
    return this.formValue.createType === 'create'
  }

  created() {
    DataEngineStore.getSourceEngine()
    // 默认选择项目组第一个
    this.formValue.nodeProject = this.projectListState.value[0]?.name
    this.formValue.nodeType = this.NodeInfoMixin__nodeType
  }

  handleJumpToWiki(val: string) {
    window.open(val, '_blank')
  }
  handleChange() {
    // do nothing
  }

  // 对外接口
  validate() {
    return new Promise<IToolTaskXtPayload>((resolve, reject) => {
      ;(this.$refs.formRef as MtdForm).validate(valid => {
        if (valid) {
          resolve({
            nodeName: this.formValue.nodeName,
            nodeDesc: this.formValue.nodeDesc,
            createType: this.formValue.createType,
            xtName: this.formValue.jobName,
            toolTaskType: this.formValue.nodeType,
            projName: this.showNodeProject ? this.formValue.nodeProject : '', // 如果不展示nodeProject，那么传空字符串
            sourceEngine: this.formValue.sourceEngine,
            destEngine: this.formValue.destEngine
          })
        } else {
          reject()
        }
      })
    })
  }
}
</script>