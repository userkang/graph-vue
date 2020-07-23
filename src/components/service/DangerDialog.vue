<template>
  <CommonModal :title="title" width="300px" placement="center" @close="handleCancel">
    <span>
      <i class="iconfont icon-AlertNotifacationi2" style="color: #FF6459"></i>
      {{text}}
    </span>
    <div class="handle-panel has-top">
      <MtdButton class="delete-btn" :disabled="disabled" @click="handleSubmit">{{submitBtnLabel}}</MtdButton>
      <MtdButton class="cancel-btn gap" @click="handleCancel">取消</MtdButton>
    </div>
  </CommonModal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
@Component({
  components: { CommonModal }
})
export default class DangerDialog extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private title!: string

  @Prop({
    type: String,
    required: true
  })
  private text!: string

  @Prop({
    type: String,
    required: true,
    default: '确定'
  })
  private submitBtnLabel!: string

  @Prop({
    type: Boolean,
    default: false
  })
  private disabled!: boolean

  private handleCancel() {
    this.$emit('cancel')
  }

  private handleSubmit() {
    this.$emit('submit')
  }
}
</script>
