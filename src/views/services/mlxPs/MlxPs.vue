<template>
  <div>
    <StopPSModal
      v-if="isStopModalShow"
      @submit="handleStopService"
      @cancel="cancelStopService"
      @close="hideStopModal"
    />

    <BackNav title @click="handleBack">
      <div slot="handle" class="flex" style="width: 100%">
        <div class="template-name flex-v-center">
          <EditItem buttonType="icon" :text="editName" @submit="handleSubmit">
            <mtd-input genre="line" v-model="mlxPSInfoValue.name" size="small" />
          </EditItem>
          <span class="status-icon" style="margin:0 10px" v-if="versionId">({{versionId}})</span>
          <i
            style="font-size: 12px; font-style: normal"
            :class="[statusStyleFunc(serviceStatus)]"
          >{{statusLabelFunc(serviceStatus)}}</i>
        </div>
        <div class="flex-item flex-end-v-center">
          <mtd-button
            v-if="mlxPSResourceValue.length && statusBtnFunc(serviceStatus)"
            type="primary"
            size="small"
            @click="handleServiceRunning"
            style="margin-right: 12px"
          >{{statusBtnFunc(serviceStatus)}}</mtd-button>
          <MtdTooltip v-if="!mlxPSResourceValue.length" placement="top" content="需先配置资源才能启动">
            <mtd-button style="margin-right: 12px" type="primary" size="small" class="disabled">启动</mtd-button>
          </MtdTooltip>
          <mtd-button type="danger" size="small" @click="handleDelete">删除</mtd-button>
        </div>
      </div>
    </BackNav>

    <div class="service-detail-wrap">
      <MtdTabs v-model="tabIndex" size="normal">
        <MtdTabPane label="服务信息" value="info">
          <MlxPsInfo
            :id="id"
            :versionId="versionId"
            :status="serviceStatus"
            :isServiceRunning="isServiceRunning"
            :isHistoryService="isHistoryVersion"
            :psInfo="mlxPSInfoValue"
            :psResource="mlxPSResourceValue"
            @refresh="getPSInfoAndResource"
          />
        </MtdTabPane>
        <MtdTabPane label="运行日志" value="log" v-if="serviceStatus >= 5">
          <MlxPsLog :psRunningLogValue="psAppRunningValue" v-if="tabIndex === 'log'" />
        </MtdTabPane>
        <MtdTabPane label="历史版本" value="history">
          <MlxPsHistory :id="id" v-if="tabIndex === 'history'" />
        </MtdTabPane>
      </MtdTabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {
  MLXPSAppRunningStore,
  MLXPSInfoStore,
  MLXPSResourceStore,
  MLXPSVersionsStore,
  StartMLXPSServiceStore,
  StopMLXPSServiceStore
} from '@/stores/service/mlxPS/mlxPS'
import {
  ServiceStatus,
  serviceStatusBtnFunc,
  serviceStatusLabelFunc,
  serviceStatusStyleFunc
} from '@/metaData/mlxPS'
import { ModelListStore } from '@/stores/model'
import DetailHeader from '../../../components/service/ServiceDetailHeader.vue'
import MlxPsInfo from './mlxPSInfo/MlxPsInfo.vue'
import MlxPsLog from './MlxPsLog.vue'
import MlxPsHistory from './MlxPsHistory.vue'
import StopPSModal from '@/components/service/mlxPS/StopPSModal.vue'
import BackNav from '@/components/BackNav.vue'
import EditItem from '@/components/editItem/EditItem.vue'
import { SUCCESS_CODE } from '@/metaData/common'

@Component({
  components: {
    StopPSModal,
    MlxPsHistory,
    MlxPsLog,
    MlxPsInfo,
    DetailHeader,
    BackNav,
    EditItem
  }
})
export default class MLXPS extends Vue {
  @Prop({
    type: Number,
    required: true
  })
  private id!: number
  @Prop({
    type: Number,
    required: true
  })
  private paramVersionId!: number

  private timer = 0
  private status = 0
  private psAppId = 0
  private versionId = 0
  private tabIndex = 'info'
  private isStopModalShow = false
  private isHistoryVersion = false
  private statusStyleFunc = serviceStatusStyleFunc
  private statusLabelFunc = serviceStatusLabelFunc
  private statusBtnFunc = serviceStatusBtnFunc

  private mlxPSInfoState = MLXPSInfoStore.state
  private mlxPSResourceState = MLXPSResourceStore.state
  private psAppRunningState = MLXPSAppRunningStore.state
  private runningStatus = [
    ServiceStatus.SUBMITTING,
    ServiceStatus.STARTING,
    ServiceStatus.RUNNING,
    ServiceStatus.STOPPING
  ]

  get editName() {
    return this.mlxPSInfoValue.name
  }

  get mlxPSInfoValue() {
    return this.mlxPSInfoState.value
  }

  get mlxPSResourceValue() {
    return this.mlxPSResourceState.value && this.mlxPSResourceState.value.id
      ? [this.mlxPSResourceState.value]
      : []
  }

  get psAppRunningValue() {
    return this.psAppRunningState.value
  }

  get serviceStatus() {
    return this.psAppRunningValue.status
  }

  get isServiceRunning() {
    return this.runningStatus.includes(this.psAppRunningValue.status)
  }

  get isNotShowBtn() {
    return ![ServiceStatus.SUBMITTING, ServiceStatus.STOPPING].includes(
      this.serviceStatus
    )
  }

  private handleBack() {
    this.$router.push({
      name: 'serviceList'
    })
  }

  private async handleSubmit() {
    if (!this.editName) {
      this.$mtd.message({
        type: 'warning',
        message: '名称不能为空'
      })
      return
    }

    await MLXPSInfoStore.rename(this.id, this.editName)
    await MLXPSInfoStore.request(this.id)
  }

  private async handleDelete() {
    try {
      await this.$mtd.confirm({
        type: 'warning',
        title: '删除',
        message: '确认删除吗？'
      })
      const value = await MLXPSInfoStore.delete(this.id)
      if (value.data.code === SUCCESS_CODE) {
        this.$mtd.message({
          message: '删除成功，即将返回到列表页',
          type: 'success'
        })
        await new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 2000)
        })
        this.handleBack()
      }
    } catch (e) {
      // tslint:disable-next-line
      console.error(e)
    }
  }

  private async handleServiceRunning() {
    const payload = {
      psId: this.id,
      psVersionId: this.mlxPSInfoValue.activeVersionId
    }
    if (this.isServiceRunning) {
      this.isStopModalShow = true
    } else {
      await StartMLXPSServiceStore.request(payload)
    }
    await this.getPSInfoAndResource()
  }

  private async handleStopService() {
    this.hideStopModal()
    const payload = {
      psId: this.id,
      psVersionId: this.mlxPSInfoValue.activeVersionId
    }
    await StopMLXPSServiceStore.request(payload)
    await this.getPSInfoAndResource()
  }

  private hideStopModal() {
    this.isStopModalShow = false
  }

  private cancelStopService() {
    this.hideStopModal()
    this.tabIndex = 'info'
  }

  private async getPSAppRunning() {
    const value = await MLXPSAppRunningStore.request(this.psAppId)
    this.status = value.status
  }

  private async pollingStatus() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    await this.getPSAppRunning()
    if (this.runningStatus.includes(this.status)) {
      this.timer = setInterval(async () => {
        await this.getPSAppRunning()
        await MLXPSVersionsStore.request(this.id)
        if (!this.runningStatus.includes(this.status)) {
          clearInterval(this.timer)
        }
      }, 2000)
    }
  }

  private async getPSInfoAndResource() {
    const activeVersionId = await MLXPSInfoStore.request(this.id)
    if (this.paramVersionId === 0) {
      this.isHistoryVersion = false
      this.versionId = activeVersionId
    } else {
      this.isHistoryVersion = this.paramVersionId !== activeVersionId
      this.versionId = this.paramVersionId
    }
    await MLXPSVersionsStore.request(this.id)
    if (this.versionId) {
      this.psAppId = await MLXPSResourceStore.request(this.versionId)
      if (this.psAppId) {
        await this.pollingStatus()
      }
    } else {
      MLXPSResourceStore.cleanState()
    }
  }

  private async created() {
    await this.getPSInfoAndResource()
  }

  private async mounted() {
    await ModelListStore.request({
      modelType: 'MLX'
    })
  }

  private beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    MLXPSInfoStore.cleanState()
    MLXPSVersionsStore.cleanState()
    MLXPSResourceStore.cleanState()
    MLXPSAppRunningStore.cleanState()
  }
}
</script>
