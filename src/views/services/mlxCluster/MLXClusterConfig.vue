<template>
  <div>
    <DangerDialog
      v-if="panelDisplay.isOfflineDuplicationShow"
      title="禁用副本"
      submitBtnLabel="禁用"
      :text="`您确定要禁用“副本${duplication.name}”吗？`"
      @cancel="cancelOffline('isOfflineDuplicationShow')"
      @submit="handleOffline"
    />
    <CommonModal
      v-if="panelDisplay.isOnlineDuplicationShow"
      title="启用副本"
      placement="center"
      width="400px"
      @close="cancelOnline('isOnlineDuplicationShow')"
    >
      <h4
        style="margin-bottom: 40px;font-size: 14px;color: #666666;font-weight: normal"
      >您确定要启用副本吗？</h4>
      <div class="handle-panel">
        <MtdButton class="submit-btn" @click="handleOnline">确定</MtdButton>
        <MtdButton class="cancel-btn gap" @click="cancelOnline('isOnlineDuplicationShow')">取消</MtdButton>
      </div>
    </CommonModal>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { FederationVoType } from '@/types/mlxCluster'
import { FederationStatusOperationStore } from '@/stores/service/MLXCluster'
import { parseDate } from '@/common/utils'
import { ClusterPanelDisplayType, ClusterDisplayValue } from '@/types/mlxCluster'
import CommonModal from '@/components/CommonModal.vue'
import DangerDialog from '@/components/service/DangerDialog.vue'
import InfoItem from '@/components/InfoItem.vue'
import EmptyIcon from '@/components/EmptyIcon.vue'

@Component({
  components: { EmptyIcon, InfoItem, CommonModal, DangerDialog }
})
export default class MLXClusterConfig extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private clusterId!: string

  @Prop({
    required: true
  })
  private duplication!: FederationVoType

  @Prop({
    required: true
  })
  private panelDisplay!: ClusterPanelDisplayType

  private setDuplicationList(value: boolean) {
    this.$emit('setDuplicationList', value)
  }

  private async handleOnline() {
    this.closeModal('isOnlineDuplicationShow')
    await FederationStatusOperationStore.request({
      type: 'online',
      vo: this.duplication,
    })
    this.refreshModel();
  }

  private async handleOffline() {
    this.closeModal('isOfflineDuplicationShow')
    await FederationStatusOperationStore.request({
      type: 'offline',
      vo: this.duplication,
    })
    this.refreshModel()
  }

  private cancelOnline(modelType: ClusterDisplayValue) {
    this.setDuplicationList(false)
    this.$emit('closeModal', modelType)
  }

  private cancelOffline(modelType: ClusterDisplayValue) {
    this.setDuplicationList(true)
    this.$emit('closeModal', modelType)
  }

  private closeModal(modelType: ClusterDisplayValue) {
    this.$emit('closeModal', modelType)
  }

  private refreshModel() {
    this.$emit('refreshList')
  }
}
</script>
