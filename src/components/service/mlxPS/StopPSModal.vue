<template>
  <CommonModal title="停止服务" width="350px" placement="center" @close="handleClose">
    <h3 style="margin-bottom: 20px">确认要停止该服务吗?</h3>

    <div class="handle-panel">
      <MtdButton class="delete-btn" @click="handleStop">继续停止</MtdButton>
      <MtdButton class="submit-btn gap" @click="handleCancel">保存模型</MtdButton>
    </div>
  </CommonModal>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
@Component({
  components: { CommonModal }
})
export default class StopPSModal extends Vue {
  private handleStop() {
    this.$emit('submit')
  }
  private handleCancel() {
    this.$emit('cancel')
  }

  private handleClose() {
    this.$emit('close')
  }
}
</script>
