<template>
  <CommonModal width="800px" :title="modalType === 'add' ? '新建模板' : '编辑模板'" @close="handleClose">
    <span class='msg-text'>（暂不支持一个服务下的多模板同时运行，请参考：
      <a target="_blank" href="https://km.sankuai.com/page/135813169#id---%3E12%E3%80%81%E5%B9%B3%E5%8F%B0%E8%BF%98%E4%B8%8D%E6%94%AF%E6%8C%81%E5%A4%9A%E6%A8%A1%E6%9D%BF%E5%90%8C%E6%97%B6%E8%BF%90%E8%A1%8C%E3%80%82%E5%A6%82%E6%9E%9C%E5%B7%B2%E6%9C%89%E4%B8%80%E4%B8%AA%E8%BF%90%E8%A1%8C%E4%B8%AD%E7%9A%84%E6%A8%A1%E6%9D%BFA%E7%BB%91%E5%AE%9A%E6%A8%A1%E5%9E%8Ba%EF%BC%8Cb%EF%BC%8C%E5%A6%82%E4%BD%95%E5%86%8D%E6%96%B0%E5%A2%9E%E6%A8%A1%E5%9E%8Bc%EF%BC%9F">FAQ</a>
    ）</span>
    <MtdForm :model="createForm">
      <MtdFormItem label="模板名称">
        <MtdInput v-model="createForm.name" style="width: 400px" />
      </MtdFormItem>
      <MtdFormItem label="包含模型">
        <MtdTable :data="createForm.models" class="template-model-table">
          <EmptyIcon slot="empty" />
          <MtdTableColumn label="模型" width="250px">
            <template slot-scope="scope">
              <MtdSelect
                filterable
                style="width: 220px"
                v-model="createForm.models[scope.$index].id"
              >
                <MtdOption
                  v-for="model in modelList"
                  :key="model.id"
                  :value="model.id"
                  :label="model.modelName"
                />
              </MtdSelect>
            </template>
          </MtdTableColumn>
          <MtdTableColumn label="路径" prop="path" />
          <MtdTableColumn width="50px">
            <template slot-scope="scope">
              <MtdButton size="small" type="text" style="text-align: center">
                <i
                  class="iconfont icon-yibohui"
                  @click="removeModel(scope.$index)"
                  style="color: #999"
                />
              </MtdButton>
            </template>
          </MtdTableColumn>
        </MtdTable>
      </MtdFormItem>
      <MtdForm>
        <MtdButton type="text" @click="appendModel">
          <i class="iconfont icon-jiqi-fangda highlight-text"></i>添加模型
        </MtdButton>
      </MtdForm>
    </MtdForm>
    <div class="handle-panel">
      <MtdButton
        :disabled="!isSubmitEnabled"
        class="submit-btn"
        @click="handleSubmit"
      >{{modalType === 'add' ? '创建' : '更新'}}</MtdButton>
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
import { MLXTFTemplateAddOrEditStore } from '@/stores/service/MLXTF'
import { TemplateFormType } from '@/types/mlxTF'

@Component({
  components: {
    EmptyIcon,
    CommonModal
  }
})
export default class TFTemplateModal extends Vue {
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
  private initForm!: TemplateFormType // when modalType is edit, this prop is required

  private isRequesting = false
  private modelListState = ModelListStore.state
  private createForm: TemplateFormType = {
    name: '',
    models: []
  }

  get modelList() {
    return this.modelListState.value
  }

  get modelIdList() {
    return this.createForm.models.map(model => model.id)
  }

  get isSubmitEnabled() {
    return (
      !this.isRequesting &&
      this.createForm.name &&
      this.createForm.models.length &&
      this.createForm.models.every(model => !!model.id)
    )
  }

  private appendModel() {
    this.createForm.models.push({
      id: 0,
      path: ''
    })
  }

  private removeModel(index: number) {
    this.createForm.models.splice(index, 1)
  }

  private getModelPathFromId(id: number) {
    for (const model of this.modelList) {
      if (id === model.id) {
        return model.modelPrefixPath
      }
    }
    return ''
  }

  private async handleSubmit() {
    this.isRequesting = true
    await MLXTFTemplateAddOrEditStore.request({
      type: this.modalType,
      id: this.id,
      templateId: this.templateId,
      name: this.createForm.name,
      models: this.createForm.models.map(model => model.id)
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

  @Watch('modelIdList', { deep: true })
  private watchModelIdList() {
    this.createForm.models.forEach((model, index) => {
      this.createForm.models[index].path = this.getModelPathFromId(model.id)
    })
  }
}
</script>
