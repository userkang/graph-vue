<template>
  <section>
    <MlxPSModelConfig
      :psConfigModalDisplay="psConfigModalDisplay"
      :currentModel="currentModel"
      :appKey="appKey"
      :isLocal="isLocal"
      :id="id"
      :appId="appId"
      @refreshModel="refreshModel"
      @closeModal="handleCloseConfigModal"
      @setDumpList="handleChangeDumpList"
      @setPushList="handleChangePushList"
    />
    <PSPushConfig v-if="isLocal" />
    <PSModelPanel
      :id="id"
      :appId="appId"
      :isLocal="isLocal"
      :isHistoryService="isHistoryService"
      @refreshModel="refreshModel"
    />
    <MtdTable :data="psModel">
      <EmptyIcon slot="empty" />
      <MtdTableColumn label="模型" prop="name" />
      <MtdTableColumn label="路径" prop="modelVersionPath" />
      <MtdTableColumn v-if="isLocal" label="流式训练" width="200px">
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.hasStream"
            :to="{
                    name: 'streamDetail',
                    params: {
                        taskId: scope.row.taskId,
                        jobId: scope.row.jobId
                    }
                 }"
          >去查看</router-link>
          <router-link
            v-else
            :to="{
                            name: 'streamList'
                        }"
          >去创建</router-link>
        </template>
      </MtdTableColumn>
      <MtdTableColumn label="自动dump" v-if="isLocal" width="100px">
        <template slot-scope="scope">
          <MtdSwitch
            size="small"
            class="table-link-btn"
            :disabled="isHistoryService"
            v-model="autoDumpList[scope.$index]"
            @change="(value) => changeAutoDumpShow(value, scope.row, scope.$index)"
          />
        </template>
      </MtdTableColumn>
      <MtdTableColumn label="推送" v-if="isLocal" width="80px">
        <template slot-scope="scope">
          <MtdSwitch
            size="small"
            class="table-link-btn"
            :disabled="isHistoryService"
            v-model="autoPushList[scope.$index]"
            @change="(value) => changeAutoPushShow(value, scope.row, scope.$index)"
          />
        </template>
      </MtdTableColumn>
      <MtdTableColumn label="操作" v-if="!isHistoryService" width="280px">
        <template slot-scope="scope">
          <MtdButton
            size="small"
            type="text"
            v-if="scope.row.metricOperator"
            class="highlight-text table-link-btn"
            @click="lookupMLX(scope.row)"
          >查看指标</MtdButton>
          <MtdButton
            size="small"
            type="text"
            v-else
            class="highlight-text table-link-btn"
            disabled
          >查看指标</MtdButton>
          <MtdButton
            size="small"
            type="text"
            class="highlight-text table-link-btn"
            @click="showSaveModel(scope.row)"
          >dump</MtdButton>
          <MtdButton
            size="small"
            type="text"
            class="highlight-text table-link-btn"
            @click="showSaveAsModel(scope.row)"
          >dumpAs</MtdButton>
          <MtdButton
            size="small"
            type="text"
            class="highlight-text table-link-btn"
            @click="showRemoveModal(scope.row)"
          >移除</MtdButton>
        </template>
      </MtdTableColumn>
    </MtdTable>
    <ModalMetric :show.sync="isShowMlx" :queryCategory="queryCategory" :chartParams="chartParams" />
  </section>
</template>

<style lang="scss" scoped>
.model-save-item {
  font-size: 14px;
  color: #666666;
  margin-bottom: 30px;
  font-weight: normal;

  label {
    display: inline-block;
    width: 100px;
    text-align: right;
  }

  .save-as-item {
    margin-left: 20px;
    width: 300px;
  }
}

.handle-panel {
  display: flex;
  flex-direction: row-reverse;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ServiceSectionTitle from '@/components/service/ServiceSectionTitle.vue'
import EmptyIcon from '@/components/EmptyIcon.vue'
import { PSModelVoType } from '@/types/mlxPs'
import { defaultPSModelMock } from '@/mock/service'
import PullDownBtn from '@/components/service/mlxPS/DropDownBtn.vue'
import PSModelPanel from '@/views/services/mlxPs/mlxPSInfo/MlxPSModelPanel.vue'
import PSPushConfig from '@/views/services/mlxPs/mlxPSInfo/MlxPSPushCfg.vue'
import DangerDialog from '@/components/service/DangerDialog.vue'
import CommonModal from '@/components/CommonModal.vue'
import ModalMetric from '@/components/metric/ModalMetric.vue'
import OpenAutoPushModal from '@/components/service/mlxPS/OpenAutoPushModal.vue'
import MlxPSModelConfig from '@/views/services/mlxPs/mlxPSInfo/MlxPSModelConfig.vue'
import { PSConfigModalDisplayType, PSConfigModalName } from '@/types/service'
import { defaultPSConfigModalDisplay } from '@/mock/service'
import { ChartCompParamsType } from '@/types/metric'
import { PSPushConfigFetchStore } from '@/stores/service/mlxPS/mlxPSModelPanel'
import { MLXPSAutoPushStore } from '@/stores/service/mlxPS/mlxPSModel'

@Component({
  components: {
    MlxPSModelConfig,
    OpenAutoPushModal,
    CommonModal,
    DangerDialog,
    PSModelPanel,
    PullDownBtn,
    EmptyIcon,
    ServiceSectionTitle,
    ModalMetric,
    PSPushConfig
  }
})
export default class MlxPSModel extends Vue {
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

  @Prop({
    required: true,
    type: Boolean
  })
  private isLocal!: boolean

  @Prop({
    required: true,
    type: Array
  })
  private psModel!: PSModelVoType[]

  @Prop({
    required: true,
    type: String
  })
  private appKey!: string

  @Prop({
    required: true,
    type: Boolean
  })
  private isHistoryService!: boolean

  private autoDumpList: boolean[] = []
  private autoPushList: boolean[] = []

  private currentModel: PSModelVoType = defaultPSModelMock()
  private currentModelIndex = 0
  private psConfigModalDisplay: PSConfigModalDisplayType = defaultPSConfigModalDisplay()

  private isShowMlx = false
  // private psId = '';
  // private mappingId = '';
  private chartParams: ChartCompParamsType = {
    psId: '',
    mappingId: ''
  }

  get queryCategory() {
    return this.isShowMlx ? 'psMapping' : ''
  }

  private refreshModel() {
    this.$emit('refresh')
  }

  private async changeAutoDumpShow(
    value: boolean,
    row: PSModelVoType,
    index: number
  ) {
    if (value) {
      this.psConfigModalDisplay.isOpenDumpShow = true
    } else {
      this.psConfigModalDisplay.isCloseDumpShow = true
    }
    this.currentModel = row
    this.currentModelIndex = index
  }

  private async changeAutoPushShow(
    value: boolean,
    row: PSModelVoType,
    index: number
  ) {
    if (value) {
      // this.psConfigModalDisplay.isOpenPushShow = true;
      const data = await PSPushConfigFetchStore.request(this.appKey)
      await MLXPSAutoPushStore.request({
        type: 'open',
        mappingId: row.id,
        ...data
      })
      this.refreshModel()
    } else {
      this.psConfigModalDisplay.isClosePushShow = true
    }
    this.currentModel = row
    this.currentModelIndex = index
  }

  private handleCloseConfigModal(modelType: PSConfigModalName) {
    this.psConfigModalDisplay[modelType] = false
  }

  private handleChangeDumpList(value: boolean) {
    const autoDumpList = [...this.autoDumpList]
    autoDumpList[this.currentModelIndex] = value
    this.autoDumpList = autoDumpList
  }

  private handleChangePushList(value: boolean) {
    const autoPushList = [...this.autoPushList]
    autoPushList[this.currentModelIndex] = value
    this.autoPushList = autoPushList
  }

  private showRemoveModal(row: PSModelVoType) {
    this.currentModel = row
    this.psConfigModalDisplay.isRemoveShow = true
  }

  private lookupMLX(info: any) {
    this.isShowMlx = true
    this.chartParams = {
      psId: info.psId,
      mappingId: info.id
    }
  }

  private showSaveModel(row: PSModelVoType) {
    this.currentModel = row
    this.psConfigModalDisplay.isSaveShow = true
  }

  private showSaveAsModel(row: PSModelVoType) {
    this.currentModel = row
    this.psConfigModalDisplay.isSaveAsShow = true
  }

  @Watch('psModel', { deep: true })
  private watchPSModel(value: PSModelVoType[]) {
    if (this.isLocal && value.length > 0) {
      this.autoDumpList = []
      this.autoPushList = []
      value.forEach(item => {
        this.autoDumpList.push(item.autoDump)
        this.autoPushList.push(item.autoPush)
      })
    }
  }
}
</script>