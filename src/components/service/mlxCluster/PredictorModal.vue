<template>
  <CommonModal title="predictor配置" placement="top" width="500px" @close="handleClose">
    <template v-if="!isSubmitted">
      <MtdSelect style="width: 400px" v-model="federations" multiple fiterable placeholder="请选择副本">
        <MtdOption
          v-for="item in duplication"
          :key="item.federationId"
          :value="item.federationId"
          :label="item.name"
        />
      </MtdSelect>
      <div class="handle-panel has-top">
        <MtdButton class="submit-btn" @click="handleSubmit">确认</MtdButton>
        <MtdButton class="cancel-btn gap" @click="handleClose">取消</MtdButton>
      </div>
    </template>
    <template v-else>
      <MtdButton
        id="copyPredictorValue"
        type="text"
        class="highlight-text"
        @click="() => {this.$mtd.message('复制成功')}"
        :data-clipboard-text="predictorValue"
      >
        <i class="iconfont icon-chakanquanwen"></i>复制到剪贴板
      </MtdButton>
      <MtdTextarea v-model="predictorValue" style="width: 400px" :rows="20" disabled />
      <div class="handle-panel has-top">
        <MtdButton @click="handleClose" class="cancel-btn">关闭</MtdButton>
      </div>
    </template>
  </CommonModal>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Clipboard from 'clipboard'
import CommonModal from '@/components/CommonModal.vue'
import { FederationVoType } from '@/types/mlxCluster'
import { MLXClusterPredictorStore } from '@/stores/service/MLXCluster'

@Component({
  components: { CommonModal }
})
export default class PredictorModal extends Vue {
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

  private predictorState = MLXClusterPredictorStore.state

  private federations: string[] = []

  private isSubmitted = false

  get predictorValue() {
    return this.predictorState.value
  }

  private handleClose() {
    this.$emit('close')
  }

  private async handleSubmit() {
    await MLXClusterPredictorStore.request(
      this.clusterId,
      this.federations.join(',')
    )
    this.isSubmitted = true
  }

  private mounted() {
    const btnCopy = new Clipboard('#copyPredictorValue')
  }
}
</script>
