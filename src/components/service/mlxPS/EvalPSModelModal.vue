<template>
  <CommonModal title="eval模型" width="500px" placement="center" @close="handleClose">
    <MtdForm v-if="!isEvaled" :model="form">
      <MtdFormItem label="选择模型" prop="mappingIdAndName" :labelWidth="120" required>
        <MtdSelect v-model="form.mappingIdAndName" class="add-model-item">
          <MtdOption
            v-for="psModelItem in mlxPSModelValue"
            :key="psModelItem.id"
            :value="`${psModelItem.id}||${psModelItem.name}`"
            :label="psModelItem.name"
          />
        </MtdSelect>
      </MtdFormItem>
      <MtdFormItem label="数据路径" prop="modelPath" :labelWidth="120" required>
        <MtdTextarea
          v-model="form.modelPath"
          class="add-model-item"
          placeholder="请填写 viewfs:/// 开头路径"
        />
      </MtdFormItem>

      <MtdFormItem class="handle-panel no-bottom">
        <MtdButton class="cancel-btn gap" @click="handleClose">取消</MtdButton>
        <MtdButton :disabled="isEvalBtnDisabled" class="submit-btn" @click="handleEval">开始eval</MtdButton>
      </MtdFormItem>
    </MtdForm>
    <MtdForm v-else>
      <MtdFormItem label="模型">{{modelName}}</MtdFormItem>
      <MtdFormItem label="eval结果">
        <MtdTextarea v-model="evalResult" disabled style="height: 100px" />
      </MtdFormItem>
      <MtdFormItem class="handle-panel">
        <MtdButton type="text" class="highlight-text" @click="handleClose">关闭</MtdButton>
      </MtdFormItem>
    </MtdForm>
  </CommonModal>
</template>

<style lang="scss" scoped>
.add-model-item {
  width: 260px;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { MLXPSModelStore } from '@/stores/service/mlxPS/mlxPS'
import CommonModal from '@/components/CommonModal.vue'
import { EvalPSModelStore } from '@/stores/service/mlxPS/mlxPSModelPanel'
@Component({
  components: {
    CommonModal
  }
})
export default class EvalPSModelModal extends Vue {
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
  private isEvaled = false
  private evalResult = ''
  private modelName = ''

  private form = {
    mappingIdAndName: '',
    modelPath: ''
  }

  private mlxPSModelState = MLXPSModelStore.state

  get mlxPSModelValue() {
    return this.mlxPSModelState.value
  }

  get isEvalBtnDisabled() {
    return (
      !(this.form.mappingIdAndName && this.form.modelPath) || this.isDisabled
    )
  }

  private handleClose() {
    this.$emit('close')
  }

  private async handleEval() {
    this.isDisabled = true
    const { mappingIdAndName, modelPath } = this.form
    const [mappingId, modelName] = mappingIdAndName.split('||')
    this.modelName = modelName
    const evalResult = await EvalPSModelStore.request({
      modelMappingId: Number(mappingId) || 0,
      evalModelName: modelName,
      evalDataPath: modelPath
    })
    this.evalResult = evalResult ? evalResult.join('\n') : ''
    this.isDisabled = false
    this.isEvaled = true
  }
}
</script>
