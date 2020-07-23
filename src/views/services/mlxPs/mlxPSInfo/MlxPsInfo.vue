<template>
  <div>
    <ServiceSectionTitle title="基础信息" />
    <ul>
      <InfoItem label="服务类型">MLX_PS</InfoItem>
      <InfoItem label="PS类型">{{psTypeMap[psInfo.type]}}</InfoItem>
      <InfoItem label="appkey">{{psInfo.appkey}}</InfoItem>
      <InfoItem label="负责人">{{psInfo.creator}}</InfoItem>
      <InfoItem label="更新时间">{{psInfo.updateTime}}</InfoItem>
      <InfoItem label="创建时间">{{psInfo.createTime}}</InfoItem>
      <InfoItem label="描述">
        <EditTextItem compType="textarea" :text="psInfo.description" @submit="updateDesc" />
      </InfoItem>
    </ul>
    <MlxPSResource
      :isHistoryService="isHistoryService"
      :isServiceRunning="isServiceRunning"
      :id="id"
      :psResource="psResource"
      :versionId="versionId"
      :serviceName="psInfo.name"
      :isLocal="isLocal"
      @repullResource="handleRefresh"
    />
    <MlxPSModel
      v-if="runningStatus === 30"
      :psModel="psModel"
      :isLocal="isLocal"
      :id="id"
      :appId="appId"
      :appKey="psInfo.appkey"
      :isHistoryService="isHistoryService"
      :isConfigResource="psResource.length > 0"
      @refresh="getPSModel"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ServiceSectionTitle from '../../../../components/service/ServiceSectionTitle.vue'
import InfoItem from '../../../../components/InfoItem.vue'
import EmptyIcon from '../../../../components/EmptyIcon.vue'
import EditItem from '../../../../components/editItem/EditItem.vue'
import { PSResourceVoType, PSVoType } from '@/types/mlxPs'
import { psTypeMap, ServiceStatus } from '@/metaData/mlxPS'
import {
  UpdateMLXPSDescStore,
  MLXPSModelStore
} from '@/stores/service/mlxPS/mlxPS'
import MlxPSResource from '@/views/services/mlxPs/mlxPSInfo/MlxPSResource.vue'
import MlxPSModel from '@/views/services/mlxPs/mlxPSInfo/MlxPSModel.vue'
import EditTextItem from '@/components/editItem/EditTextItem.vue'

@Component({
  components: {
    EditTextItem,
    MlxPSModel,
    MlxPSResource,
    EditItem,
    EmptyIcon,
    InfoItem,
    ServiceSectionTitle
  }
})
export default class MlxInfoPs extends Vue {
  @Prop({
    required: true,
    type: Number
  })
  private id!: number

  @Prop({
    required: true,
    type: Number
  })
  private versionId!: number

  @Prop({
    required: true,
    type: Number
  })
  private status!: number

  @Prop({
    type: Boolean,
    required: true
  })
  private isServiceRunning!: boolean

  @Prop({
    type: Boolean,
    required: true
  })
  private isHistoryService!: boolean

  @Prop({
    required: true
  })
  private psInfo!: PSVoType

  @Prop({
    required: true
  })
  private psResource!: PSResourceVoType[]

  private psModelState = MLXPSModelStore.state

  private runningStatus = ServiceStatus.RUNNING

  private psTypeMap = psTypeMap

  /**
   * 代表近线类型
   */
  get isLocal() {
    return this.psInfo.type === 1
  }

  get psModel() {
    return this.psModelState.value
  }

  get appId() {
    return this.psResource.length > 0 ? this.psResource[0].activeAppId || 0 : 0
  }

  private async updateDesc(description: string) {
    await UpdateMLXPSDescStore.request({
      id: this.id,
      description
    })
  }

  private handleRefresh() {
    this.$emit('refresh')
  }

  private async getPSModel() {
    await MLXPSModelStore.request(this.appId)
  }

  @Watch('status')
  private async watchStatus(value: number) {
    if (value !== 0) {
      await this.getPSModel()
    }
  }

  private beforeDestroy() {
    MLXPSModelStore.reset()
  }
}
</script>
