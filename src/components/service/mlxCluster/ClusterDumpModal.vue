<template>
  <mtd-modal v-model="localShow" :title="`dump【${duplication.name}】至本地`">
    <mtd-form :model="form" :rules="rules" ref="form">
      <mtd-form-item label="模型名" prop="name" required>
        <mtd-input v-model="form.name" style="width: 300px;"></mtd-input>
      </mtd-form-item>
    </mtd-form>

    <div slot="footer" class="demo-modal-footer">
      <mtd-button @click="localShow = false">取消</mtd-button>
      <mtd-button type="primary" @click="submitModal">确定</mtd-button>
    </div>
  </mtd-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { FederationVoType } from '@/types/mlxCluster'
import { MLXClusterDumpStore } from '@/stores/service/MLXCluster'

@Component
export default class ClusterDumpModal extends Vue {
  @Prop({
    type: String,
    required: true
  })
  clusterId!: string

  @Prop({
    required: true
  })
  duplication!: FederationVoType

  @Prop({
    type: Boolean,
    default: false
  })
  show = false

  form = {
    name: ''
  }

  rules = {
    name: {
      required: true,
      message: '不能为空'
    }
  }

  get localShow() {
    return this.show
  }

  set localShow(v: boolean) {
    ;(this.$refs.form as any).resetFields()
    this.$emit('update:show', v)
  }

  async submitModal() {
    await (this.$refs.form as any).validate()
    await MLXClusterDumpStore.request({
      clusterId: this.clusterId,
      federationId: this.duplication.federationId,
      modelName: this.form.name
    })
    this.$emit('refresh')
    this.localShow = false
  }
}
</script>
