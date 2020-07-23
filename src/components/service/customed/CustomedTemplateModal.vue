<template>
  <CommonModal
    width="600px"
    :title="modalType === 'add' ? '新建模板' : '编辑模板'"
    @close="handleClose"
  >
    <MtdForm :model="createForm" :label-width="110">
      <MtdFormItem required label="模板名称">
        <MtdInput v-model="createForm.name" style="width: 400px" />
      </MtdFormItem>
      <MtdFormItem required label="git仓库">
        <MtdInput v-model="createForm.git" style="width: 400px" />
      </MtdFormItem>
      <MtdFormItem required label="仓库分支">
        <MtdInput v-model="createForm.branch" style="width: 400px" />
      </MtdFormItem>
      <MtdFormItem label="commit号">
        <MtdInput v-model="createForm.commitId" style="width: 400px" />
      </MtdFormItem>
      <MtdFormItem label="子路径">
        <MtdInput v-model="createForm.userCodeDir" style="width: 400px" />
      </MtdFormItem>
    </MtdForm>
    <div class="handle-panel">
      <MtdButton
        :disabled="!isSubmitEnabled"
        class="submit-btn"
        @click="handleSubmit"
        >{{ modalType === 'add' ? '创建' : '更新' }}</MtdButton
      >
      <MtdButton class="cancel-btn gap" @click="handleClose">取消</MtdButton>
    </div>
  </CommonModal>
</template>

<style lang="scss">
.template-model-table {
  .mtd-table-body-wrapper {
    max-height: 400px;
    overflow-y: auto;
  }
}
.msg-text {
  position: absolute;
  top: 23px;
  left: 86px;
  font-size: 12px;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import EmptyIcon from '@/components/EmptyIcon.vue'
import { ModelListStore } from '@/stores/model'
import { MLXTFTemplateAddOrEditStore } from '@/stores/service/CustomService'
import { CustomTemplateQuery } from '@/types/customed'

@Component({
  components: {
    EmptyIcon,
    CommonModal
  }
})
export default class CustomedTemplateModal extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private id!: string

  @Prop({
    type: String
  })
  private templateId!: string // when modalType is edit, this prop is required

  @Prop({
    type: String,
    default: 'add' // add/edit
  })
  private modalType!: string

  @Prop()
  private initForm!: CustomTemplateQuery // when modalType is edit, this prop is required

  private isRequesting = false
  private createForm: CustomTemplateQuery = {
    name: '',
    git: '',
    branch: '',
    commitId: '',
    userCodeDir: ''
  }

  get isSubmitEnabled() {
    return (
      !this.isRequesting &&
      this.createForm.name &&
      this.createForm.git &&
      this.createForm.branch
    )
  }

  private async handleSubmit() {
    this.isRequesting = true
    await MLXTFTemplateAddOrEditStore.request({
      type: this.modalType,
      id: this.id,
      templateId: this.templateId,
      query: this.createForm
    })
    this.$emit('refresh')
  }

  private handleClose() {
    this.$emit('close')
  }

  private mounted() {
    if (this.modalType === 'edit') {
      this.createForm = this.initForm
    }
  }
}
</script>
