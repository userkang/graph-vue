<template>
  <CommonModal @close="handleClose" title="PS模型列表" width="500px" placement="center">
    <MtdForm>
      <MtdFormItem label="模型名称">
        <MtdInput v-model="modelName" style="width: 300px" />
      </MtdFormItem>
      <MtdFormItem class="handle-panel no-bottom">
        <MtdButton class="gap cancel-btn" @click="handleClose">取消</MtdButton>
        <MtdButton class="submit-btn" @click="handleSubmit">确定</MtdButton>
      </MtdFormItem>
    </MtdForm>
  </CommonModal>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { MLXPSModelRemoveStore } from '@/stores/service/mlxPS/mlxPSModel'
import CommonModal from '@/components/CommonModal.vue'

@Component({
  components: {
    CommonModal
  }
})
export default class ListPSModelModal extends Vue {
  @Prop({
    type: Number,
    required: true
  })
  private psId!: number

  @Prop({
    type: Number,
    required: true
  })
  private psAppId!: number

  private modelName = ''

  private handleClose() {
    this.$emit('close')
  }

  private async handleSubmit() {
    await MLXPSModelRemoveStore.request({
      modelType: 'offline',
      offlinePayload: {
        psId: this.psId,
        psAppId: this.psAppId,
        modelName: this.modelName
      }
    })
    this.$emit('refreshModel')
    this.$emit('close')
  }
}
</script>
