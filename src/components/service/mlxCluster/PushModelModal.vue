<template>
  <CommonModal
    placement="top"
    :title="isPreviewShow ? '预览推送模型' : '推送模型'"
    width="500px"
    @close="handleClose"
  >
    <template v-if="!isPreviewShow">
      <MtdForm :model="pushForm">
        <MtdFormItem label="模型名称" prop="pushName" :labelWidth="120">
          <MtdInput v-model="pushForm.pushName" class="push-form-item" placeholder="模型名称，可不填" />
        </MtdFormItem>
        <MtdFormItem label="选择模型" prop="modelId" :labelWidth="120">
          <MtdSelect
            v-model="modelIdAndName"
            class="push-form-item"
            @input="handleModelChange"
            filterable
          >
            <MtdOption
              v-for="modelItem in modelListValue"
              :key="modelItem.id"
              :label="modelItem.modelName"
              :value="`${modelItem.id}|${modelItem.modelName}`"
              :data-id="modelItem.id"
            />
          </MtdSelect>
        </MtdFormItem>
        <MtdFormItem label="选择模型版本" prop="modelVersionId" :labelWidth="120">
          <MtdSelect v-model="pushForm.modelVersionId" class="push-form-item">
            <MtdOption
              v-for="modelVersion in modelVersionValue"
              :key="modelVersion.id"
              :label="modelVersion.modelPath"
              :value="modelVersion.id"
            />
          </MtdSelect>
        </MtdFormItem>
        <MtdFormItem label="YARN队列" prop="queue" :labelWidth="120">
          <MtdSelect v-model="pushForm.queue" class="push-form-item" filterable>
            <MtdOption
              v-for="yarnQueue in yarnQueueValue"
              :label="yarnQueue"
              :value="yarnQueue"
              :key="yarnQueue"
            />
          </MtdSelect>
        </MtdFormItem>
        <MtdFormItem label="开启move模式" prop="openMoveModel" :labelWidth="120">
          <MtdRadioGroup v-model="pushForm.openMoveModel" class="push-form-item">
            <MtdRadio :value="true">是</MtdRadio>
            <MtdRadio :value="false">否</MtdRadio>
          </MtdRadioGroup>
        </MtdFormItem>
        <MtdFormItem
          v-if="pushForm.openMoveModel"
          label="move模型"
          prop="toModelName"
          :labelWidth="120"
        >
          <MtdInput v-model="pushForm.toModelName" class="push-form-item" />
        </MtdFormItem>
        <MtdFormItem label="推送间隔时间" prop="pushInterval" :labelWidth="120">
          <MtdInput v-model="pushForm.pushInterval" type="number" class="push-form-item" />
        </MtdFormItem>
        <MtdFormItem label="选择副本" prop="federationIdList" :labelWidth="120">
          <MtdSelect v-model="pushForm.federationIdList" multiple clearable class="push-form-item">
            <MtdOption
              v-for="duplication in duplications"
              :key="duplication.federationId"
              :label="duplication.name"
              :value="duplication.federationId"
            />
          </MtdSelect>
        </MtdFormItem>
        <MtdFormItem label="选择审批人" prop="approverList" :labelWidth="120">
          <MtdSelect v-model="pushForm.approverList" multiple clearable class="push-form-item">
            <MtdOption
              v-for="approver in approverList"
              :key="approver"
              :label="approver"
              :value="approver"
            />
          </MtdSelect>
        </MtdFormItem>
      </MtdForm>
      <div class="handle-panel">
        <MtdButton @click="showPushPreview" class="submit-btn" :disabled="isReviewDisabled">预览</MtdButton>
        <MtdButton @click="handleClose" class="cancel-btn gap">取消</MtdButton>
      </div>
    </template>
    <template v-else>
      <div>
        <InfoItem label="选择模型" labelWidth="120px">{{extractModelNameFromId()}}</InfoItem>
        <InfoItem label="选择模型版本" labelWidth="120px">{{pushForm.modelVersionId}}</InfoItem>
        <InfoItem label="YARN队列" labelWidth="120px">{{pushForm.queue}}</InfoItem>
        <InfoItem label="开启move模式" labelWidth="120px">{{pushForm.openMoveModel ? '是' : '否'}}</InfoItem>
        <InfoItem label="move间隔" labelWidth="120px">{{pushForm.pushInterval}}</InfoItem>
        <InfoItem label="审批人" labelWidth="120px">{{pushForm.approverList + ''}}</InfoItem>
      </div>
      <h4>副本信息</h4>
      <MtdTable :data="machineListValue" style="max-height: 400px; overflow-y: auto">
        <EmptyIcon slot="empty" />
        <MtdTableColumn prop="federation" label="副本" />
        <MtdTableColumn prop="host" label="ip" />
        <MtdTableColumn prop="port" label="端口" />
      </MtdTable>
      <div class="handle-panel has-top">
        <MtdButton class="submit-btn" @click="handlePush">提交审核</MtdButton>
        <MtdButton class="cancel-btn gap" @click="handleClose">取消</MtdButton>
      </div>
    </template>
  </CommonModal>
</template>

<style lang="scss" scoped>
.push-form-item {
  width: 220px;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import { ModelListStore, ModelVersionListStore } from '@/stores/model'
import { YarnQueueStore } from '@/stores/common'
import { ClusterMachineVoType, FederationVoType } from '@/types/mlxCluster'
import {
  MLXClusterPushModelStore,
  FederationMachineBatchStore,
  MLXClusterApproverStore
} from '@/stores/service/MLXCluster'
import InfoItem from '@/components/InfoItem.vue'
import EmptyIcon from '@/components/EmptyIcon.vue'

@Component({
  components: {
    EmptyIcon,
    InfoItem,
    CommonModal
  }
})
export default class PushModelModal extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private clusterId!: string

  @Prop({
    type: Array,
    required: true
  })
  private duplications!: FederationVoType[]

  private isPreviewShow = false
  private modelIdAndName = ''
  private initModelName = ''
  private pushForm = {
    federationIdList: [],
    modelId: 0,
    modelVersionId: 0,
    openMoveModel: false,
    pushInterval: 1,
    toModelName: '',
    pushName: '',
    queue: '',
    approverList: []
  }

  private machineListState = FederationMachineBatchStore.state
  private modelListState = ModelListStore.state
  private yarnQueueState = YarnQueueStore.state
  private modelVersionState = ModelVersionListStore.state
  private approverState = MLXClusterApproverStore.state

  get modelListValue() {
    return this.modelListState.value
  }

  get machineListValue() {
    interface FederationListType extends ClusterMachineVoType {
      federation: string
    }
    const value: FederationListType[] = []
    this.machineListState.value.forEach(federationMachine => {
      return federationMachine.detailVos.forEach(machine => {
        value.push({
          federation: federationMachine.name,
          ...machine
        })
      })
    })
    return value
  }

  get modelVersionValue() {
    return this.modelVersionState.value
  }

  get yarnQueueValue() {
    return this.yarnQueueState.value
  }

  get approverList() {
    return this.approverState.value
  }

  get isReviewDisabled() {
    if (!this.pushForm.openMoveModel) {
      return !(
        this.pushForm.modelId &&
        this.pushForm.modelVersionId &&
        this.pushForm.pushInterval &&
        this.pushForm.federationIdList.length &&
        this.pushForm.queue
      )
    }
    return !(
      this.pushForm.modelId &&
      this.pushForm.modelVersionId &&
      this.pushForm.pushInterval &&
      this.pushForm.federationIdList.length &&
      this.pushForm.queue &&
      this.pushForm.toModelName
    )
  }

  private extractModelNameFromId() {
    for (const model of this.modelListValue) {
      if (this.pushForm.modelId === model.id) {
        return model.modelName
      }
    }
    return ''
  }

  private extractFederationNameFromId(id: string) {
    for (const federation of this.duplications) {
      if (federation.federationId === id) {
        return federation.name
      }
    }
    return ''
  }

  private async handleModelChange(modelIdAndName: string) {
    this.pushForm.modelVersionId = 0
    const [modelId, modelName] = modelIdAndName.split('|')
    this.initModelName = modelName
    this.pushForm.modelId = Number(modelId)
    await ModelVersionListStore.request({
      modelId: this.pushForm.modelId
    })
  }

  private async handlePush() {
    await MLXClusterPushModelStore.request(this.clusterId, {
      ...this.pushForm,
      pushName: this.pushForm.pushName || this.initModelName
    })
    this.$nextTick(() => {
      this.$emit('refresh')
    })
  }

  private async showPushPreview() {
    this.isPreviewShow = true
    await FederationMachineBatchStore.request({
      clusterId: this.clusterId,
      federations: this.pushForm.federationIdList.join(',')
    })
  }

  private handleClose() {
    this.$emit('close')
  }

  private async created() {
    await ModelListStore.request({
      modelType: 'MLX'
    })
    await YarnQueueStore.request()
    await MLXClusterApproverStore.request(this.clusterId)
  }
}
</script>
