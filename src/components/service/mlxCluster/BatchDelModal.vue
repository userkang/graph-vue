<template>
  <CommonModal placement="top" title="批量删除模版" @close="handleClose" width="500px">
    <template>
      <MtdForm :model="initForm">
        <MtdFormItem label="模型名称">
          <MtdInput v-model="initForm.modelName" style="width: 260px" />
        </MtdFormItem>
        <MtdFormItem label="选择副本">
          <MtdSelect v-model="initForm.fedarations" style="width: 260px" multiple clearable>
            <MtdOption
              v-for="item in duplication"
              :key="item.federationId"
              :value="item.federationId"
              :label="item.name"
            />
          </MtdSelect>
        </MtdFormItem>
      </MtdForm>
      <div class="handle-panel">
        <MtdButton
          class="submit-btn"
          :loading="isDeleting"
          @click="handleDelete"
          :disabled="isDisabled || isDeleting"
        >确定</MtdButton>
        <MtdButton class="cancel-btn gap" @click="handleClose">取消</MtdButton>
      </div>
    </template>
  </CommonModal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import { FederationVoType } from '@/types/mlxCluster'
import {
  MLXClusterEvalStore,
  DuplicationModelBatchDeleteStore
} from '@/stores/service/MLXCluster'

@Component({
  components: {
    CommonModal
  }
})
export default class EvalDuplicationModal extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private clusterId!: string

  @Prop({
    type: Array,
    required: true
  })
  private duplication!: FederationVoType[]

  private isDeleting = false

  private initForm = {
    modelName: '',
    fedarations: []
  }

  get isDisabled() {
    return !this.initForm.modelName || this.initForm.fedarations.length === 0
  }

  private async handleDelete() {
    this.isDeleting = true

    await DuplicationModelBatchDeleteStore.request({
      modelName: this.initForm.modelName,
      clusterId: this.clusterId,
      federationId: this.initForm.fedarations.join()
    })
    this.isDeleting = false

    this.handleClose()
  }

  private handleClose() {
    this.$emit('close')
  }
}
</script>
