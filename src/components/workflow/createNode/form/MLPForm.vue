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
    <NodeProjectFormItem @change="handleChange" :formCustom="formValue"></NodeProjectFormItem>
    <MtdFormItem label="任务类型" required>
      <MtdSelect v-model="formValue.afoType">
        <MtdOption :value="NodeType.training" label="训练任务"></MtdOption>
        <MtdOption :value="NodeType.prediction" label="预测任务"></MtdOption>
      </MtdSelect>
    </MtdFormItem>
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

import { NodeInfoMixin } from '../mixins'
import { ValidatableForm } from '../interfaces'
import MtdForm from '@ss/mtd-vue/types/form'
import { NodeType } from '@/types/createNode'
import { IToolTaskMlpPayload } from '@/stores/workflow/createNode/toolTaskMlp'
import { ProjectListStore } from '@/stores/graph/GraphList'

@Component({
  components: {
    NodeTypeFormItem,
    NodeNameFormItem,
    NodeDescFormItem,
    NodeProjectFormItem
  }
})
export default class MLPForm extends Mixins(NodeInfoMixin)
  implements ValidatableForm {
  componentName = 'MLPForm'
  NodeType = NodeType
  formValue = {
    nodeName: '',
    nodeType: 'AFO', // 固定
    nodeProject: '',
    nodeDesc: '',
    afoType: NodeType.training
  }
  projectListState = ProjectListStore.state

  created() {
    // 默认选择项目组第一个
    this.formValue.nodeProject = this.projectListState.value[0]?.name
    this.formValue.nodeType = this.NodeInfoMixin__nodeType
  }

  handleChange() {
    // do nothing
  }

  // 对外接口
  validate() {
    return new Promise<IToolTaskMlpPayload>((resolve, reject) => {
      ;(this.$refs.formRef as MtdForm).validate(valid => {
        if (valid) {
          resolve({
            nodeName: this.formValue.nodeName,
            toolTaskType: this.formValue.nodeType,
            nodeDesc: this.formValue.nodeDesc,
            projectName: this.formValue.nodeProject,
            afoType: this.formValue.afoType
          })
        } else {
          reject()
        }
      })
    })
  }
}
</script>