<template>
  <CommonModal title="增量推送" placement="center" width="630px" @close="handleCancel">
    <MtdForm :model="initForm" ref="form">
      <MtdFormItem label="Mafka Appkey" :labelWidth="120">{{appKey || initForm.appkey }}</MtdFormItem>
      <MtdFormItem label="Mafka Topic" :labelWidth="120" prop="topic" required>
        <MtdInput v-model="initForm.topic" :disabled="!canEdit" style="width: 400px" />
      </MtdFormItem>
      <MtdFormItem label="Namespace" :labelWidth="120" prop="namespace" required>
        <MtdInput v-model="initForm.namespace" :disabled="!canEdit" style="width: 400px" />
      </MtdFormItem>
      <MtdFormItem label="ShardNum" :labelWidth="120" prop="shardType" required>
        <mtd-radio-group v-model="initForm.shardType" :disabled="!canEdit">
          <mtd-radio value="MLX_CLUSTER">选择MLXPS线上分组</mtd-radio>
          <mtd-radio value="CUSTOM">自定义</mtd-radio>
        </mtd-radio-group>
        <mtd-select
          style="width: 400px; margin-bottom: 8px;"
          v-model="initForm.clusterId"
          placeholder="请选择MLXPS线上分组"
          v-if="initForm.shardType === 'MLX_CLUSTER'"
          :disabled="!canEdit"
          :remote-method="searchMlxCluster"
          :loading="searchLoading"
          filterable
          remote
          @change="selectCluster"
        >
          <mtd-option
            v-for="value in clusterList"
            :label="value.name"
            :value="value.clusterId"
            :key="value.clusterId"
          ></mtd-option>
        </mtd-select>
        <MtdInput
          v-if="initForm.shardType === 'MLX_CLUSTER'"
          v-model="initForm.shardNum"
          :disabled="true"
          type="number"
          style="width: 400px"
        />
        <MtdInput
          :disabled="!canEdit"
          v-else
          v-model="initForm.shardNum"
          type="number"
          style="width: 400px"
        />
      </MtdFormItem>
      <MtdFormItem label="Fetcher版本" :labelWidth="120" prop="shardNum">
        <MtdSelect v-model="initForm.fetcherVersion" style="width: 400px" :disabled="!canEdit">
          <MtdOption label="stable" value="stable" />
          <MtdOption label="beta" value="beta" />
        </MtdSelect>
      </MtdFormItem>
      <MtdFormItem :labelWidth="120" v-if="initForm.fetcherVersion === 'beta'">
        <span style="color: red;">beta版本用于灰度测试新特性，请慎用</span>
      </MtdFormItem>
    </MtdForm>
    <div class="handle-panel has-top">
      <MtdButton
        class="submit-btn gap"
        @click="handleSubmit"
        :disabled="isOpenBtnDisabled"
      >{{ btnText }}</MtdButton>
      <MtdButton class="cancel-btn" style="margin-right: 10px;" @click="handleCancel">取消</MtdButton>
    </div>
  </CommonModal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { OpenPushPayload } from '@/stores/service/mlxPS/mlxPSModel'
import { PSPushConfigFetchStore } from '@/stores/service/mlxPS/mlxPSModelPanel'
import { ClusterVo } from '@/types/stream'
import CommonModal from '@/components/CommonModal.vue'
@Component({
  components: {
    CommonModal
  }
})
export default class OpenAutoPushModal extends Vue {
  @Prop({
    type: Boolean,
    default: false
    // require: true
  })
  private disabled!: boolean

  @Prop({
    type: String,
    default: ''
    // required: true
  })
  private appKey!: string

  @Prop({
    type: String,
    // ADD OPEN CLOSE EDIT
    default: 'ADD'
  })
  private type!: string

  private psPushConfigState = PSPushConfigFetchStore.state
  private searchLoading = false

  get clusterList() {
    return this.psPushConfigState.clusterList
  }

  get isOpenBtnDisabled() {
    return this.disabled || !this.initForm.namespace || !this.initForm.topic
  }

  get psPushConfigValue() {
    return this.psPushConfigState.value
  }

  get canEdit() {
    return ['EDIT', 'ADD'].includes(this.type)
  }

  get btnText() {
    switch (this.type) {
      case 'ADD':
        return '添加'
        break
      case 'OPEN':
        return '开启'
        break
      case 'CLOSE':
        return '关闭'
        break
      case 'EDIT':
        return '修改'
        break
    }
  }

  private initForm: OpenPushPayload = {
    /** appkey */
    appkey: '',
    /** mafka topic */
    topic: '',
    /** topic ns */
    namespace: '',
    /** fetcher version */
    fetcherVersion: '',
    /** 分组数量的选择类型：CUSTOM MLX_CLUSTER */
    shardType: 'CUSTOM',
    /** 分组ID */
    clusterId: '',
    /** 自定义NUM */
    shardNum: 0
  }

  @Watch('psPushConfigValue', { immediate: true })
  private watchPsConfig() {
    this.initForm = this.psPushConfigValue
  }

  private handleCancel() {
    this.$emit('cancel')
  }

  private handleSubmit() {
    ;(this.$refs.form as any).validate((v: boolean) => {
      if (v) {
        this.$emit('submit', this.initForm)
      }
    })
  }

  private selectCluster(id: string) {
    const info: ClusterVo | undefined = this.clusterList.find(
      (item: ClusterVo) => item.clusterId === id
    )
    this.initForm.shardNum = info!.shardNum
  }

  private async searchMlxCluster(query: string) {
    this.searchLoading = true
    await PSPushConfigFetchStore.fetchMlxCluster(query)
    this.searchLoading = false
  }

  private mounted() {
    PSPushConfigFetchStore.fetchMlxCluster()
  }
}
</script>
