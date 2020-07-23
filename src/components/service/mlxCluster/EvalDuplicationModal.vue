<template>
  <CommonModal
    placement="top"
    title="eval副本"
    :width="isEvalled ? '700px' : '500px'"
    @close="handleClose"
  >
    <template v-if="!isEvalled">
      <MtdForm :model="initForm">
        <MtdFormItem label="选择模型" required>
          <MtdInput v-model="initForm.evalModelName" style="width: 260px" />
        </MtdFormItem>
        <MtdFormItem label="数据路径" required>
          <MtdTextarea v-model="initForm.evalDataPath" />
        </MtdFormItem>
        <MtdFormItem label="选择副本" required>
          <MtdSelect v-model="initForm.fedarations" style="width: 260px" multiple clearable>
            <MtdOption
              v-for="item in duplication"
              :key="item.federationId"
              :value="item.federationId"
              :label="item.name"
            />
          </MtdSelect>
        </MtdFormItem>
        <MtdFormItem label="计算图配置">
          <MtdTextarea v-model="initForm.modelGraphStateSpec"/>
        </MtdFormItem>
      </MtdForm>
      <div class="handle-panel">
        <MtdButton class="submit-btn" @click="handleEval" :disabled="isEvalDisabled">开始eval</MtdButton>
        <MtdButton class="cancel-btn gap" @click="handleClose">取消</MtdButton>
      </div>
    </template>
    <template v-else>
      <LoadingIcon v-if="isLoading" />
      <MtdTable v-else :data="evalValue" style="max-height: 600px; overflow-y: auto">
        <EmptyAndLoading :loadingStatus="loadingStatus" />
        <MtdTableColumn label="模型" prop="federation"></MtdTableColumn>
        <MtdTableColumn label="eval结果" width="500px">
          <template slot-scope="scope">
            <MtdTextarea
              style="width: 500px"
              v-model="scope.row.evalResult.join('\n')"
              :rows="6"
              :cols="10"
              disabled
            />
          </template>
        </MtdTableColumn>
      </MtdTable>
      <div class="handle-panel">
        <MtdButton type="text" class="highlight-text" @click="handleClose">关闭</MtdButton>
      </div>
    </template>
  </CommonModal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import { ModelListStore } from '@/stores/model'
import { FederationVoType } from '@/types/mlxCluster'
import { MLXClusterEvalStore } from '@/stores/service/MLXCluster'
import EmptyAndLoading from '@/components/EmptyAndLoading.vue'
import LoadingIcon from '@/components/LoadingIcon.vue'

@Component({
  components: {
    LoadingIcon,
    EmptyAndLoading,
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

  private isEvalled = false
  private isLoading = false
  private initForm = {
    evalModelName: '',
    evalDataPath: '',
    fedarations: [],
    modelGraphStateSpec: ''
  }
  private modelListState = ModelListStore.state
  private evalState = MLXClusterEvalStore.state

  get evalValue() {
    return this.evalState.value
  }

  get modelListValue() {
    return this.modelListState.value
  }

  get isEvalDisabled() {
    return (
      !this.initForm.evalModelName ||
      !this.initForm.evalDataPath ||
      this.initForm.fedarations.length === 0
    )
  }

  get loadingStatus() {
    return this.evalState.loadingStatus
  }

  private async handleEval() {
    try {
      this.isEvalled = true
      this.isLoading = true
      await MLXClusterEvalStore.request({
        clusterId: this.clusterId,
        evalModelName: this.initForm.evalModelName,
        evalDataPath: this.initForm.evalDataPath,
        federationIds: this.initForm.fedarations,
        modelGraphStateSpec: this.initForm.modelGraphStateSpec
      })
      // tslint:disable-next-line
    } catch (e) {}
    this.isLoading = false
  }

  private handleClose() {
    MLXClusterEvalStore.cleanState()
    this.$emit('close')
  }

  private async mounted() {
    await ModelListStore.request({
      modelType: 'MLX'
    })
  }
}
</script>
