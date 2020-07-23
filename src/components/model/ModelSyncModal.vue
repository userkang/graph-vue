<template>
  <CommonModal
    v-if="syncModalValue.isShow"
    placement="center"
    title="模型同步"
    width="300px"
    @close="hideSyncModal"
  >
    <span style="color: #666;font-weight: normal;font-size: 14px">
      <i class="iconfont" :class="[syncStyle]" style="display: inline-block"></i>
      {{syncText}}
    </span>
  </CommonModal>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { SyncModalStore } from '@/stores/model'
import CommonModal from '@/components/CommonModal.vue'
@Component({
  components: { CommonModal }
})
export default class ModelSyncModal extends Vue {
  private syncModalState = SyncModalStore.state

  get syncModalValue() {
    return this.syncModalState.value
  }

  get syncStyle() {
    return this.syncModalValue.status === 30
      ? 'icon-AlertNotifacationi3 success-text'
      : 'icon-yibohui failed-text'
  }

  get syncText() {
    return `模型${this.syncModalValue.modelName}同步${
      this.syncModalValue.status === 30 ? '成功' : '失败'
    }`
  }

  private hideSyncModal() {
    SyncModalStore.hideModal()
  }
}
</script>
