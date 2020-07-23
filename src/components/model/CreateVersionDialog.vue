<template>
  <dmc-modal
    v-model="localShow"
    title="创建版本"
    width="480px"
    @ok="handleSubmit"
    @cancel="handleClose"
    @close="handleClose"
    okButtonText="创建"
  >
    <MtdForm :model="createForm" :rules="createRule" ref="createForm">
      <MtdFormItem label="存储路径" prop="path" required>
        <MtdTextarea v-model="createForm.path" style="width: 260px;height: 100px" />
      </MtdFormItem>
    </MtdForm>
  </dmc-modal>
</template>

<style lang="scss" scoped>
.create-modal-dialog {
  .form-item {
    display: flex;
    margin-bottom: 24px;
    &__label {
      width: 180px;
      text-align: right;
    }
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
@Component({
  components: { CommonModal }
})
export default class CreateModalDialog extends Vue {
  @Prop({
    default: false,
    type: Boolean
  })
  visible!: boolean

  private createForm = {
    path: ''
  }

  get localShow() {
    return this.visible
  }

  set localShow(v: boolean) {
    this.$emit('update:visible', v)
  }

  get createRule() {
    const validator = (
      rule: string,
      value: string,
      callback: (value?: Error) => void
    ) => {
      if (value.trim() === '') {
        callback(new Error('请输入'))
      } else {
        callback()
      }
    }
    return {
      path: {
        validator,
        trigger: 'blur'
      }
    }
  }

  private handleClose() {
    ;(this.$refs.createForm as any).resetFields()
    this.localShow = false
  }

  private handleSubmit() {
    ;(this.$refs.createForm as any).validate((valid: boolean) => {
      if (valid) {
        this.$emit('submit', this.createForm.path.trim())
      }
    })
  }
}
</script>
