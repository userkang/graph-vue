<template>
  <div>
    <DangerDialog
      v-if="psConfigModalDisplay.isRemoveShow"
      @cancel="closeModal('isRemoveShow')"
      @submit="handleRemoveModel"
      title="移出"
      submitBtnLabel="移出"
      :disabled="isRemoveDisabled"
      :text=" `您确定要移出[${currentModel.name}]吗？`"
    />
    <CommonModal
      v-if="psConfigModalDisplay.isSaveShow"
      title="保存"
      placement="center"
      width="500px"
      @close="closeModal('isSaveShow')"
    >
      <h4 class="model-save-item">将作为新版本保存在【模型管理】中</h4>
      <div class="model-save-item">
        模型版本标识
        <MtdInput v-model="modelVersionLabel" class="save-as-item" />
      </div>
      <div class="handle-panel has-top">
        <MtdButton class="submit-btn" :disabled="isSaveBtnDisabled" @click="handleSaveModel">确定</MtdButton>
        <MtdButton class="cancel-btn gap" @click="closeModal('isSaveShow')">取消</MtdButton>
      </div>
    </CommonModal>
    <CommonModal
      v-if="psConfigModalDisplay.isSaveAsShow"
      @close="closeModal('isSaveAsShow')"
      title="另存为"
      placement="center"
      width="500px"
    >
      <h4 class="model-save-item">模型将作为新版本保存在指定的路径中</h4>
      <MtdForm>
        <MtdFormItem label="保存的模型名称" :labelWidth="120">
          <MtdInput v-model="modelVersionName" style="width: 260px" />
        </MtdFormItem>
        <MtdFormItem label="保存路径" :labelWidth="120">
          <MtdTextarea v-model="modelVersionPath" />
        </MtdFormItem>
      </MtdForm>
      <div class="handle-panel no-bottom has-top">
        <MtdButton class="submit-btn" :disabled="isSaveAsBtnDisabled" @click="handleSaveAsModel">保存</MtdButton>
        <MtdButton class="cancel-btn gap" @click="closeModal('isSaveAsShow')">取消</MtdButton>
      </div>
    </CommonModal>
    <DangerDialog
      v-if="psConfigModalDisplay.isCloseDumpShow"
      @cancel="cancelCloseDump"
      @submit="handleCloseDump"
      title="关闭自动dump"
      submitBtnLabel="关闭"
      :text="`您确定要关闭${currentModel.name}的自动dump吗？`"
    />
    <CommonModal
      v-if="psConfigModalDisplay.isOpenDumpShow"
      title="自动dump"
      placement="center"
      width="400px"
      @close="cancelOpenDump"
    >
      <h4
        style="margin-bottom: 40px;font-size: 14px;color: #666666;font-weight: normal"
      >您确定要开启自动dump吗？</h4>
      <div class="handle-panel">
        <MtdButton class="submit-btn" @click="handleOpenDump">确定</MtdButton>
        <MtdButton class="cancel-btn gap" @click="cancelOpenDump">取消</MtdButton>
      </div>
    </CommonModal>
    <DangerDialog
      v-if="psConfigModalDisplay.isClosePushShow"
      @cancel="cancelClosePush"
      @submit="handleClosePush"
      title="关闭增量推送"
      submitBtnLabel="关闭"
      :text="`您确定要关闭[${currentModel.name}]的自动推送吗？`"
    />
    <OpenAutoPushModal
      v-if="psConfigModalDisplay.isOpenPushShow"
      :appKey="appKey"
      :disabled="isOpenPushDisabled"
      @submit="handleOpenPush"
      @cancel="cancelOpenPush"
    />
  </div>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
  MLXPSAutoDumpStore,
  MLXPSAutoPushStore,
  MLXPSModelSaveStore,
  MLXPSModelSaveAsStore,
  MLXPSModelRemoveStore,
  OpenPushPayload
} from '@/stores/service/mlxPS/mlxPSModel'
import { PSPushConfigFetchStore } from '@/stores/service/mlxPS/mlxPSModelPanel'
import CommonModal from '@/components/CommonModal.vue'
import DangerDialog from '@/components/service/DangerDialog.vue'
import OpenAutoPushModal from '@/components/service/mlxPS/OpenAutoPushModal.vue'
import { PSConfigModalDisplayType, PSConfigModalName } from '@/types/service'
import { PSModelVoType } from '@/types/mlxPs'
import { parseDate } from '@/common/utils'

@Component({
  components: { OpenAutoPushModal, DangerDialog, CommonModal }
})
export default class MlxPSModelConfig extends Vue {
  @Prop({
    required: true
  })
  private psConfigModalDisplay!: PSConfigModalDisplayType

  @Prop({
    required: true
  })
  private currentModel!: PSModelVoType

  @Prop({
    required: true,
    type: String
  })
  private appKey!: string

  @Prop({
    required: true,
    type: Boolean
  })
  private isLocal!: boolean

  @Prop({
    required: true,
    type: Number
  })
  private id!: number

  @Prop({
    required: true,
    type: Number
  })
  private appId!: number
  private isRemoveDisabled = false
  private isSaveDisabled = false
  private isSaveAsDisabled = false
  private isOpenPushDisabled = false
  private modelVersionName = ''
  private modelVersionPath = ''
  private modelVersionLabel = parseDate(new Date())
    .split('-')
    .join('')

  get mappingId() {
    return this.currentModel.id
  }

  get isSaveBtnDisabled() {
    return !this.modelVersionLabel || this.isSaveDisabled
  }

  get isSaveAsBtnDisabled() {
    return (
      !this.modelVersionName || !this.modelVersionPath || this.isSaveAsDisabled
    )
  }

  private closeModal(modelType: PSConfigModalName) {
    this.$emit('closeModal', modelType)
  }

  private setDumpList(value: boolean) {
    this.$emit('setDumpList', value)
  }

  private setPushList(value: boolean) {
    this.$emit('setPushList', value)
  }

  private refreshModel() {
    this.$emit('refreshModel')
  }

  private cleanDefaultPushConfig() {
    PSPushConfigFetchStore.cleanState()
  }

  private cancelCloseDump() {
    this.setDumpList(true)
    this.closeModal('isCloseDumpShow')
    this.cleanDefaultPushConfig()
  }

  private async handleCloseDump() {
    this.closeModal('isCloseDumpShow')
    await MLXPSAutoDumpStore.request({
      type: 'close',
      mappingId: this.currentModel.id
    })
    this.cleanDefaultPushConfig()
    this.refreshModel()
  }

  private cancelOpenDump() {
    this.setDumpList(false)
    this.closeModal('isOpenDumpShow')
  }

  private async handleOpenDump() {
    this.closeModal('isOpenDumpShow')
    await MLXPSAutoDumpStore.request({
      type: 'open',
      mappingId: this.mappingId
    })
    this.refreshModel()
  }

  private cancelClosePush() {
    this.setPushList(true)
    this.closeModal('isClosePushShow')
  }

  private async handleClosePush() {
    this.closeModal('isClosePushShow')
    await MLXPSAutoPushStore.request({
      type: 'close',
      mappingId: this.mappingId
    })
    this.refreshModel()
  }

  private cancelOpenPush() {
    this.setPushList(false)
    this.closeModal('isOpenPushShow')
  }

  private async handleOpenPush(payload: OpenPushPayload) {
    this.isOpenPushDisabled = true
    await MLXPSAutoPushStore.request({
      type: 'open',
      mappingId: this.mappingId,
      ...payload
    })
    this.refreshModel()
    this.isOpenPushDisabled = false
    this.closeModal('isOpenPushShow')
  }

  private async handleSaveModel() {
    this.isSaveDisabled = true
    await MLXPSModelSaveStore.request({
      mappingId: this.mappingId,
      versionIdentifying: this.modelVersionLabel
    })
    this.refreshModel()
    this.isSaveDisabled = false
    this.closeModal('isSaveShow')
  }

  private async handleSaveAsModel() {
    this.isSaveAsDisabled = true
    await MLXPSModelSaveAsStore.request({
      mappingId: this.mappingId,
      dumpModelName: this.modelVersionName,
      dumpModelPath: this.modelVersionPath
    })
    this.refreshModel()
    this.isSaveAsDisabled = false
    this.closeModal('isSaveAsShow')
  }

  private async handleRemoveModel() {
    this.isRemoveDisabled = true
    await MLXPSModelRemoveStore.request({
      modelType: 'local',
      localPayload: {
        mappingId: this.mappingId
      }
    })
    this.refreshModel()
    this.isRemoveDisabled = false
    this.closeModal('isRemoveShow')
  }
}
</script>
