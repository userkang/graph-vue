<template>
  <div class="mlxps-service">
    <div class="loading-mask" v-if="isFetching">
      <LoadingIcon />
      <h6 style="text-align: center">接口请求中，请稍等...</h6>
    </div>
    <AddDuplicationModal
      v-if="isAddShow"
      :clusterId="clusterId"
      :shardNum="clusterDetail.shardNum"
      @close="isAddShow = false"
      @submit="addDuplication"
    />
    <EvalDuplicationModal
      v-if="isEvalShow"
      :clusterId="clusterId"
      :duplication="clusterDuplications"
      @close="isEvalShow = false"
    />
    <PredictorModal
      v-if="isPredictorShow"
      :clusterId="clusterId"
      :duplication="clusterDuplications"
      @close="isPredictorShow = false"
    />
    <BatchDelModal
      v-if="isBatchDelShow"
      :clusterId="clusterId"
      :duplication="clusterDuplications"
      @close="isBatchDelShow = false"
    />
    <MLXClusterHandlePanel
      :clusterId="clusterId"
      :duplication="currentDuplication"
      :panelDisplay="panelDisplay"
      @close="closePanelModal"
      @refreshTable="showMachineList"
    />
    <MLXClusterConfig
      :clusterId="clusterId"
      :duplication="currentDuplication"
      :panelDisplay="panelDisplay"
      @refreshList="refresh"
      @setDuplicationList="handleOnlineDuplicationList"
      @closeModal="closePanelModal"
    />
    <AddMachineModal
      v-if="isAddMachineShow"
      :clusterId="clusterId"
      @close="isAddMachineShow = false"
    />
    <GroupingModal
      v-if="isGroupingShow"
      :clusterId="clusterId"
      :shardNum="clusterDetail.shardNum"
      :machineNum="clusterMachineList.length"
      @close="isGroupingShow = false"
    />
    <ClusterDumpModal
      :show.sync="isClusterDumpShow"
      :clusterId="clusterId"
      :duplication="currentDuplication"
      @refresh="refresh"
      @close="isClusterDumpShow = false"
    />
    <ServiceSectionTitle title="基础信息" />
    <ul>
      <InfoItem label="appkey">{{clusterDetail.appkey}}</InfoItem>
      <InfoItem label="分片数">{{clusterDetail.shardNum}}</InfoItem>
      <InfoItem label="负责人">{{clusterDetail.creator}}</InfoItem>
      <InfoItem label="环境">{{clusterDetail.environment}}</InfoItem>
      <InfoItem label="创建时间">{{clusterDetail.createTime}}</InfoItem>
      <InfoItem label="描述">
        <EditTextItem
          compType="textarea"
          :text="clusterDetail.description"
          @submit="handleDescChange"
        />
      </InfoItem>
    </ul>
    <ServiceSectionTitle title="副本管理">
      <MtdButton size="small" type="primary" @click="isBatchDelShow = true">批量删除模版</MtdButton>
      <MtdButton
        size="small"
        type="primary"
        style="margin-right: 12px"
        @click="isAddShow = true"
      >添加副本</MtdButton>
      <MtdButton
        size="small"
        type="primary"
        style="margin-right: 12px"
        @click="isEvalShow = true"
      >eval副本</MtdButton>
      <MtdButton
        size="small"
        type="primary"
        style="margin-right: 12px"
        @click="isPredictorShow = true"
      >predictor配置</MtdButton>
    </ServiceSectionTitle>
    <MtdTable :data="clusterDuplications">
      <EmptyIcon slot="empty" />
      <MtdTableColumn label="副本名" prop="name" />
      <MtdTableColumn label="创建人" prop="owner" />
      <MtdTableColumn label="创建时间" prop="createTime" />
      <MtdTableColumn label="启用副本" prop="online">
        <template slot-scope="scope">
          <MtdSwitch
            size="small"
            class="table-link-btn"
            v-model="onlineDuplicationList[scope.$index]"
            @change="(value) => changeOnlineDuplicationhow(value, scope.row, scope.$index)"
          />
        </template>
      </MtdTableColumn>
      <MtdTableColumn label="操作" width="300px">
        <template slot-scope="scope">
          <MtdButton
            type="text"
            class="highlight-text table-link-btn"
            @click="showMachineList(scope.row)"
          >机器列表</MtdButton>
          <MtdDropdown trigger="click" style="vertical-align: top">
            <MtdButton type="text" class="highlight-text table-link-btn">模型操作</MtdButton>
            <MtdDropdownMenu slot="dropdown">
              <MtdDropdownMenuItem @click="showModelList(scope.row)">模型列表</MtdDropdownMenuItem>
              <MtdDropdownMenuItem @click="deleteModel(scope.row)">删除模型</MtdDropdownMenuItem>
              <MtdDropdownMenuItem @click="dumpDuplication(scope.row)">dump至本地</MtdDropdownMenuItem>
            </MtdDropdownMenu>
          </MtdDropdown>
          <MtdButton
            type="text"
            class="highlight-text table-link-btn"
            @click="deleteDuplication(scope.row)"
          >删除副本</MtdButton>
        </template>
      </MtdTableColumn>
    </MtdTable>
    <br />
    <ServiceSectionTitle title="机器资源">
      <MtdButton size="small" type="primary" @click="batchDeleteMachine">批量清除机器</MtdButton>
      <MtdTooltip
        v-if="clusterDuplications.length"
        content="当前服务下已有副本存在，不可一键分组。请在副本处直接添加机器！"
        placement="top"
      >
        <MtdButton size="small" class="disabled" type="primary" style="margin-right: 12px">一键分组</MtdButton>
      </MtdTooltip>
      <MtdButton
        v-else
        size="small"
        type="primary"
        style="margin-right: 12px"
        @click="isGroupingShow = true"
      >一键分组</MtdButton>
      <MtdButton
        size="small"
        type="primary"
        style="margin-right: 12px"
        @click="refreshMachineList"
      >拉取机器信息</MtdButton>
      <MtdButton
        size="small"
        type="primary"
        style="margin-right: 12px"
        @click="isAddMachineShow = true"
      >添加机器信息</MtdButton>
    </ServiceSectionTitle>
    <MtdTable :data="clusterMachineList" :checkboxable="checkboxable" :selection="selection">
      <EmptyIcon slot="empty" />
      <MtdTableColumn type="selection" />
      <MtdTableColumn label="机器名称" prop="name" />
      <MtdTableColumn label="ip" prop="host" />
      <MtdTableColumn label="端口" prop="port" />
      <MtdTableColumn label="所属副本" prop="federationName" />
      <MtdTableColumn label="shard" prop="seq" />
      <MtdTableColumn label="操作" width="300px">
        <template slot-scope="scope">
          <MtdTooltip
            v-if="!scope.row.deletable"
            content="自动拉取的机器信息和正在被副本使用的机器无法删除！"
            placement="top"
          >
            <MtdButton type="text" class="highlight-text table-link-btn mtd-btn-disabled">删除</MtdButton>
          </MtdTooltip>
          <MtdButton
            v-else
            type="text"
            class="highlight-text table-link-btn"
            @click="deleteMachine(scope.row)"
          >删除</MtdButton>
        </template>
      </MtdTableColumn>
    </MtdTable>
  </div>
</template>

<style lang="scss" scoped>
.mlxps-service {
  position: relative;
  .loading-mask {
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import DetailHeader from '../../../components/service/ServiceDetailHeader.vue'
import MlxPsInfo from '@/views/services/mlxPs/mlxPSInfo/MlxPsInfo.vue'
import MlxPSModelConfig from '@/views/services/mlxPs/mlxPSInfo/MlxPSModelConfig.vue'
import MlxPsLog from '@/views/services/mlxPs/MlxPsLog.vue'
import MlxPsHistory from '@/views/services/mlxPs/MlxPsHistory.vue'
import ServiceSectionTitle from '@/components/service/ServiceSectionTitle.vue'
import InfoItem from '@/components/InfoItem.vue'
import EmptyIcon from '@/components/EmptyIcon.vue'
import EditItem from '@/components/editItem/EditItem.vue'
import {
  ClusterDisplayValue,
  ClusterPanelDisplayType,
  ClusterVoType,
  FederationVoType
} from '@/types/mlxCluster'
import {
  MLXClusterDuplicationDeleteStore,
  MLXClusterDescUpdateStore,
  MLXClusterMachineStore,
  MLXClusterModelStore,
  MLXClusterDumpStore,
  MLXClusterMachineListStore
} from '@/stores/service/MLXCluster'
import AddDuplicationModal from '@/components/service/mlxCluster/AddDuplicationModal.vue'
import AddMachineModal from '@/components/service/mlxCluster/AddMachineModal.vue'
import GroupingModal from '@/components/service/mlxCluster/GroupingModal.vue'
import EvalDuplicationModal from '@/components/service/mlxCluster/EvalDuplicationModal.vue'
import BatchDelModal from '@/components/service/mlxCluster/BatchDelModal.vue'
import MLXClusterHandlePanel from '@/views/services/mlxCluster/MLXClusterHandlePanel.vue'
import MLXClusterConfig from '@/views/services/mlxCluster/MLXClusterConfig.vue'
import {
  defaultFederationMock,
  defaultClusterPanelDisplayType
} from '@/mock/service'
import LoadingIcon from '@/components/LoadingIcon.vue'
import PredictorModal from '@/components/service/mlxCluster/PredictorModal.vue'
import EditTextItem from '@/components/editItem/EditTextItem.vue'
import CommonModal from '@/components/CommonModal.vue'
import ClusterDumpModal from '@/components/service/mlxCluster/ClusterDumpModal.vue'

@Component({
  components: {
    EditTextItem,
    PredictorModal,
    LoadingIcon,
    MLXClusterHandlePanel,
    MLXClusterConfig,
    EvalDuplicationModal,
    AddDuplicationModal,
    BatchDelModal,
    EditItem,
    EmptyIcon,
    InfoItem,
    ServiceSectionTitle,
    MlxPsHistory,
    MlxPsLog,
    MlxPsInfo,
    DetailHeader,
    AddMachineModal,
    GroupingModal,
    CommonModal,
    ClusterDumpModal
  }
})
export default class MLXClusterBasic extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private clusterId!: string

  @Prop({
    required: true
  })
  private clusterDetail!: ClusterVoType

  @Prop({
    required: true,
    type: Array
  })
  private clusterDuplications!: FederationVoType[]

  @Prop({
    required: true,
    type: Array
  })
  private clusterMachineList!: []

  private isAddShow = false
  private isEvalShow = false
  private isPredictorShow = false
  private isBatchDelShow = false
  private isFetching = false
  private panelDisplay: ClusterPanelDisplayType = defaultClusterPanelDisplayType()
  private onlineDuplicationList: boolean[] = []
  private currentDuplication: FederationVoType = defaultFederationMock()
  private currentDuplicationIndex = 0
  private selection: [] = []
  private isAddMachineShow = false
  private isGroupingShow = false
  private isClusterDumpShow = false

  private async handleDescChange(desc: string) {
    await MLXClusterDescUpdateStore.request({
      clusterId: this.clusterId,
      description: desc
    })
  }

  private async addDuplication() {
    this.isAddShow = false
    this.refresh()
  }

  private closePanelModal(modelType: ClusterDisplayValue) {
    this.panelDisplay[modelType] = false
  }

  private async showMachineList(value: FederationVoType) {
    this.currentDuplication = value
    await MLXClusterMachineStore.request({
      clusterId: this.clusterId,
      federationId: value.federationId
    })
    this.panelDisplay.isMachineShow = true
  }

  private async showModelList(value: FederationVoType) {
    try {
      this.isFetching = true
      this.currentDuplication = value
      await MLXClusterModelStore.request({
        clusterId: this.clusterId,
        federationId: value.federationId
      })
      this.panelDisplay.isModelShow = true
    } catch (e) {
      // tslint:disable-next-line
      console.error(e)
    }
    this.isFetching = false
  }

  private deleteModel(value: FederationVoType) {
    this.currentDuplication = value
    this.panelDisplay.isDeleteModelShow = true
  }

  private async dumpDuplication(value: FederationVoType) {
    this.currentDuplication = value
    this.isClusterDumpShow = true
  }

  private async deleteDuplication(value: FederationVoType) {
    try {
      this.currentDuplication = value
      await this.$mtd.confirm({
        type: 'error',
        title: '删除副本',
        message: `确认删除【${value.name}】吗?`
      })
      await MLXClusterDuplicationDeleteStore.request({
        clusterId: this.clusterId,
        federationId: value.federationId
      })
      // tslint:disable-next-line
    } catch (e) {}
    MLXClusterMachineListStore.getMachineList(this.clusterId)
    this.refresh()
  }

  // 刷新副本列表
  private refresh() {
    this.$emit('refresh')
  }

  private async changeOnlineDuplicationhow(
    value: boolean,
    row: FederationVoType,
    index: number
  ) {
    if (value) {
      this.panelDisplay.isOnlineDuplicationShow = true
    } else {
      this.panelDisplay.isOfflineDuplicationShow = true
    }
    this.currentDuplication = row
    this.currentDuplicationIndex = index
  }

  private handleOnlineDuplicationList(value: boolean) {
    const statusList = [...this.onlineDuplicationList]
    statusList[this.currentDuplicationIndex] = value
    this.onlineDuplicationList = statusList
  }

  // 刷新机器列表
  private async refreshMachineList() {
    const res = await MLXClusterMachineListStore.getMachineList(this.clusterId)
    if (res.code === 0) {
      this.$mtd.message({
        message: '机器信息拉取成功',
        type: 'success'
      })
    } else {
      this.$mtd.message({
        message: '机器信息拉取失败！',
        type: 'error',
        showClose: true
      })
    }
  }

  // 删除机器
  private async deleteMachine(row: object) {
    if (!(row as any).deletable) {
      return
    }

    await this.$mtd.confirm({
      title: '提示',
      type: 'warning',
      message: '确认删除该机器资源吗?',
      showCancelButton: true,
      okButtonText: '删除'
    })

    const detailId: [] | any = [(row as any).detailId]

    await MLXClusterMachineListStore.deleteMachine(this.clusterId, detailId)
    await MLXClusterMachineListStore.getMachineList(this.clusterId)
  }

  // 批量删除
  private async batchDeleteMachine() {
    if (!this.selection.length) {
      this.$mtd.message({
        message: '请先勾选需要清除的机器！',
        type: 'warning'
      })
      return
    }

    await this.$mtd.confirm({
      title: '提示',
      type: 'warning',
      message: '是否确认清除已勾选的机器资源?',
      showCancelButton: true,
      okButtonText: '删除'
    })

    const selection: any = this.selection.map(item => {
      return (item as any).detailId
    })

    await MLXClusterMachineListStore.deleteMachine(this.clusterId, selection)
    await MLXClusterMachineListStore.getMachineList(this.clusterId)
  }

  // 是否可选
  private checkboxable(row: object) {
    if ((row as any).deletable) {
      return true
    } else {
      return false
    }
  }

  @Watch('clusterDuplications', { deep: true })
  private watchDuplications(value: FederationVoType[]) {
    if (value.length > 0) {
      this.onlineDuplicationList = []
      value.forEach(item => {
        this.onlineDuplicationList.push(item.online)
      })
    }
  }
}
</script>
