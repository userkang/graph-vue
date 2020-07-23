<template>
  <dmc-modal v-model="localShow" title="编辑">
    <MtdForm :model="localValue">
      <MtdFormItem label="集群" prop="hdfsCluster">
        <MtdSelect v-model="localValue.hdfsCluster" style="width: 360px">
          <MtdOption v-for="cluster in clusters" :key="cluster" :value="cluster" :label="cluster" />
        </MtdSelect>
      </MtdFormItem>
      <MtdFormItem label="存储路径" prop="modelPrefixPath">
        <MtdTextarea v-model="localValue.modelPrefixPath" style="width: 360px" :rows="8" />
      </MtdFormItem>
    </MtdForm>
    <div slot="footer">
      <MtdButton
        class="submit-btn"
        @click="handleSubmit"
        :disabled="isSubmitDisabled || isRequesting"
      >保存</MtdButton>
      <MtdButton class="cancel-btn gap" @click="handleClose">取消</MtdButton>
    </div>
  </dmc-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import { ModelEditType } from '@/types/model'
import { ModelDetailEditStore } from '@/stores/model'

@Component({
  components: { CommonModal }
})
export default class EditModelModal extends Vue {
  @Prop({
    default: false,
    type: Boolean
  })
  visible!: boolean

  @Prop({
    required: true,
    type: Number
  })
  private modelId!: number

  @Prop({
    required: true
  })
  private value!: ModelEditType

  @Prop({
    required: true,
    type: Array
  })
  private clusters!: string[]

  private isRequesting = false
  private localValue: ModelEditType = {
    hdfsCluster: '',
    modelPrefixPath: ''
  }

  get localShow() {
    return this.visible
  }

  set localShow(v: boolean) {
    this.$emit('update:visible', v)
  }

  get isSubmitDisabled() {
    return !this.localValue.hdfsCluster || !this.localValue.modelPrefixPath
  }

  private handleClose() {
    this.localShow = false
  }

  private async handleSubmit() {
    try {
      this.isRequesting = true
      await ModelDetailEditStore.request({
        id: this.modelId,
        ...this.localValue
      })
      // tslint:disable-next-line
    } catch (e) {}
    this.$emit('submit')
  }

  private mounted() {
    this.localValue = this.value
  }
}
</script>
