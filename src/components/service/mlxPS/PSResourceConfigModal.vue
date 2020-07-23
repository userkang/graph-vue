<template>
  <CommonModal title="配置资源" width="500px" @close="handleCancel">
    <MtdForm :model="form">
      <MtdFormItem required label="任务名" prop="serviceName">
        <MtdInput v-model="form.serviceName" class="form-item-width" />
      </MtdFormItem>
      <MtdFormItem required label="运行队列" prop="runQueue">
        <MtdSelect v-model="form.runQueue" class="form-item-width">
          <MtdOption
            v-for="(runQueue, index) in mlxPSRunQueueValue"
            :key="index"
            :label="runQueue"
            :value="runQueue"
          />
        </MtdSelect>
      </MtdFormItem>
      <MtdFormItem required label="PS内存" prop="psMemory">
        <mtd-select v-model="form.psMemory" class="form-item-width" allow-create filterable>
          <mtd-option v-for="memory in 16" :key="memory" :label="memory" :value="memory" />
        </mtd-select>
      </MtdFormItem>
      <MtdFormItem required label="PS CPU数" prop="psCPU">
        <MtdInput v-model="form.psCPU" type="number" class="form-item-width" />
      </MtdFormItem>
      <MtdFormItem required label="PS个数" prop="psNum">
        <MtdInput v-model="form.psNum" type="number" class="form-item-width" />
      </MtdFormItem>
      <MtdFormItem required label="PS版本" prop="psVersion">
        <MtdSelect v-model="form.psVersion" class="form-item-width">
          <MtdOption value="stable" label="stable" />
          <MtdOption value="beta" label="beta" />
        </MtdSelect>
        <span style="color: red" v-if="form.psVersion === 'beta'">beta版本用于灰度测试新特性，请慎用</span>
      </MtdFormItem>
      <MtdFormItem label="其他参数" prop="otherArgs">
        <MtdTextarea v-model="form.otherArgs" class="form-item-width" />
      </MtdFormItem>
      <MtdFormItem></MtdFormItem>
      <MtdFormItem class="handle-panel">
        <MtdButton class="cancel-btn gap" @click="handleCancel">取消</MtdButton>
        <MtdButton class="submit-btn" @click="handleSubmit" :disabled="!isConfigEnable">确定</MtdButton>
      </MtdFormItem>
    </MtdForm>
  </CommonModal>
</template>

<style lang="scss" scoped>
.form-item-width {
  width: 300px;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { MLXPSRunQueueStore } from '@/stores/service/mlxPS/mlxPS'
import CommonModal from '@/components/CommonModal.vue'
import { PSResourcePayloadType } from '@/types/mlxPs'
@Component({
  components: {
    CommonModal
  }
})
export default class PSServiceConfigModal extends Vue {
  @Prop({
    required: true
  })
  private initForm!: PSResourcePayloadType

  @Prop({
    required: true,
    type: Boolean
  })
  private isEditResource!: boolean

  @Prop({
    type: Boolean,
    required: true
  })
  private isLocal!: boolean

  private form: PSResourcePayloadType = {
    serviceName: '',
    runQueue: '',
    psMemory: 1,
    psCPU: 1,
    psNum: 1,
    psVersion: 'stable',
    otherArgs: ''
  }

  private mlxPSRunQueueState = MLXPSRunQueueStore.state

  get mlxPSRunQueueValue() {
    return this.mlxPSRunQueueState.value
  }

  get isConfigEnable() {
    return (
      this.form.serviceName &&
      this.form.runQueue &&
      this.form.psNum > 0 &&
      this.form.psCPU > 0
    )
  }

  private handleSubmit() {
    const {
      serviceName,
      runQueue,
      psMemory,
      psCPU,
      psNum,
      psVersion,
      otherArgs
    } = this.form
    if (psNum < 0) {
      this.$mtd.message('PS个数不能为负')
      return
    }
    this.$emit('submit', {
      type: this.isEditResource ? 'edit' : 'add',
      afoName: serviceName,
      afoQueue: runQueue,
      psVersion,
      afoResource: `-DworkerNum=${psNum} -DworkerMem=${psMemory} -DcpuNum=${psCPU}`,
      config: otherArgs
    })
  }

  private handleCancel() {
    this.$emit('close')
  }

  private beforeMount() {
    if (this.isEditResource && this.initForm) {
      this.form = this.initForm
    }
  }

  private async mounted() {
    await MLXPSRunQueueStore.request(this.isLocal)
  }
}
</script>
