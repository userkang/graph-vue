<template>
  <CommonModal title="添加模型" width="500px" placement="center" @close="handleClose">
    <MtdForm :model="form">
      <MtdFormItem label="选择模型" prop="selectedModel" :labelWidth="120" required>
        <MtdSelect
          v-model="form.selectedModel"
          class="add-model-item"
          @input="handleSelectedModelChange"
          filterable
        >
          <MtdOption
            v-for="psModelItem in modelList"
            :key="psModelItem.id"
            :value="psModelItem.id"
            :label="psModelItem.modelName"
          />
        </MtdSelect>
      </MtdFormItem>
      <MtdFormItem label="选择模型版本" prop="modelVersion" :labelWidth="120" required>
        <MtdSelect v-model="form.modelVersion" class="add-model-item">
          <MtdOption
            v-for="modelVersion in psModelVersionListValue"
            :key="modelVersion.id"
            :value="modelVersion.id"
            :label="modelVersion.modelPath"
            class="add-model-item-version"
          />
        </MtdSelect>
      </MtdFormItem>
      <MtdFormItem label="模型名称" prop="modelName" :labelWidth="120">
        <MtdInput v-model="form.modelName" class="add-model-item" />
      </MtdFormItem>
      <MtdFormItem class="handle-panel no-bottom">
        <MtdButton class="cancel-btn gap" @click="handleClose">取消</MtdButton>
        <MtdButton :disabled="isAddBtnDisabled" class="submit-btn" @click="handleSubmit">确定</MtdButton>
      </MtdFormItem>
    </MtdForm>
  </CommonModal>
</template>

<style lang="scss" scoped>
.add-model-item {
  width: 260px;
  &-version {
    max-width: 450px;
    word-break: break-all;
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ModelVersionListStore } from '@/stores/model'
import CommonModal from '@/components/CommonModal.vue'
import { AddPSModelStore } from '@/stores/service/mlxPS/mlxPSModelPanel'
import { ModelVoType } from '@/types/model'
@Component({
  components: {
    CommonModal
  }
})
export default class AddPSModelModal extends Vue {
  @Prop({
    type: Number,
    required: true
  })
  private id!: number

  @Prop({
    type: Number,
    required: true
  })
  private appId!: number

  private isDisabled = false

  @Prop({
    type: Array,
    required: true
  })
  private modelList!: ModelVoType[]

  private form = {
    selectedModel: '',
    modelName: '',
    modelVersion: ''
  }

  private psModelVersionListState = ModelVersionListStore.state

  get psModelVersionListValue() {
    return this.psModelVersionListState.value
  }

  get isAddBtnDisabled() {
    return (
      !(this.form.selectedModel && this.form.modelVersion) || this.isDisabled
    )
  }

  private handleClose() {
    this.$emit('close')
  }

  private async handleSelectedModelChange() {
    this.modelList.forEach(item => {
      if (item.id === Number(this.form.selectedModel)) {
        this.form.modelName = item.modelName
      }
    })
    await ModelVersionListStore.request({
      modelId: Number(this.form.selectedModel),
      page: 1,
      size: 1000,
      sort: ''
    })
  }

  private async handleSubmit() {
    this.isDisabled = true
    const {
      selectedModel: modelId,
      modelVersion: modelVersionId,
      modelName: name
    } = this.form
    await AddPSModelStore.request({
      psId: this.id,
      psAppId: this.appId,
      name,
      modelId: Number(modelId),
      modelVersionId: Number(modelVersionId)
    })
    this.$emit('refreshModel')
    this.isDisabled = false
    this.$emit('close')
  }
}
</script>
