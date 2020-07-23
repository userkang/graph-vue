<template>
  <div>
    <CommonModal
      v-if="panelDisplay.isMachineShow"
      title="机器列表"
      placement="top"
      @close="handleClose('isMachineShow')"
      width="550px"
    >
      <MtdButton
        type="text"
        class="highlight-text"
        @click="checkResourceURL"
        style="text-align: right"
      >资源使用情况</MtdButton>
      <MtdTable :data="clusterMachineValue">
        <EmptyIcon slot="empty" />
        <MtdTableColumn label="序号" prop="seq" />
        <MtdTableColumn label="机器信息" width="220px">
          <template slot-scope="scope">
            <mtd-select
              v-model="modifyValue"
              size="small"
              v-if="isModify === scope.row.detailId"
              style="width: 200px"
            >
              <mtd-option
                v-for="item in machineList"
                :key="item.detailId"
                :label="item.name"
                :value="item.detailId"
              />
            </mtd-select>
            <div v-else>{{scope.row.name}}</div>
          </template>
        </MtdTableColumn>
        <MtdTableColumn label="操作">
          <template slot-scope="scope">
            <span
              style="padding-left:0px"
              v-if="isModify === scope.row.detailId"
              type="text"
              class="highlight-text table-link-btn"
              @click="handleModify(scope.row)"
            >确定</span>
            <span
              v-else
              type="text"
              class="highlight-text table-link-btn"
              @click="modifyInfo(scope.row)"
            >修改</span>
          </template>
        </MtdTableColumn>
      </MtdTable>

      <div class="handle-panel">
        <MtdButton type="text" @click="handleClose('isMachineShow')" class="highlight-text">确定</MtdButton>
      </div>
    </CommonModal>
    <CommonModal
      v-if="panelDisplay.isModelShow"
      title="模型列表"
      placement="top"
      width="900px"
      @close="handleClose('isModelShow')"
    >
      <MtdTextarea disabled :rows="20" style="width: 800px" v-model="clusterModelValue" />
    </CommonModal>

    <CommonModal
      v-if="panelDisplay.isDeleteModelShow"
      title="删除模型"
      placement="center"
      width="500px"
      @close="handleClose('isDeleteModelShow')"
    >
      <InfoItem label="模型名称">
        <MtdInput v-model="modelName" style="width: 300px" />
      </InfoItem>
      <div class="handle-panel has-top">
        <MtdButton
          class="submit-btn"
          :disabled="!modelName || isDeleting"
          @click="handleDeleteModel"
        >确定</MtdButton>
        <MtdButton class="cancel-btn gap" @click="handleClose('isDeleteModelShow')">取消</MtdButton>
      </div>
    </CommonModal>
  </div>
</template>

<style lang="scss" scoped>
.handle-panel {
  margin-top: 10px;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
  ClusterDisplayValue,
  ClusterPanelDisplayType,
  FederationVoType,
  ClusterMachineVoType
} from '@/types/mlxCluster'
import {
  DuplicationModelDeleteStore,
  MLXClusterMachineStore,
  MLXClusterModelStore,
  MLXClusterResourceURLStore,
  FederationUpdateDetailStore,
  MLXClusterMachineListStore
} from '@/stores/service/MLXCluster'
import CommonModal from '@/components/CommonModal.vue'
import InfoItem from '@/components/InfoItem.vue'
import EmptyIcon from '@/components/EmptyIcon.vue'

@Component({
  components: { EmptyIcon, InfoItem, CommonModal }
})
export default class MLXClusterHandlePanel extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private clusterId!: string

  @Prop({
    required: true
  })
  private duplication!: FederationVoType

  @Prop({
    required: true
  })
  private panelDisplay!: ClusterPanelDisplayType

  private modelName = ''
  private isDeleting = false
  private clusterMachineState = MLXClusterMachineStore.state
  private clusterModelState = MLXClusterModelStore.state
  private MLXClusterMachineListState = MLXClusterMachineListStore.state
  private isModify: string = ''
  private modifyValue: string = ''

  get machineList() {
    const list = this.MLXClusterMachineListState.list.filter(
      (item: ClusterMachineVoType) => {
        if (item.federationId) {
          if (item.detailId === this.isModify) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      }
    )
    return list
  }

  get clusterMachineValue() {
    return this.clusterMachineState.value
  }

  get clusterModelValue() {
    return this.clusterModelState.value
  }

  private async checkResourceURL() {
    const url = await MLXClusterResourceURLStore.request({
      clusterId: this.clusterId,
      federationId: this.duplication.federationId
    })
    if (url) {
      window.open(url)
    }
  }

  private async handleDeleteModel() {
    this.isDeleting = true
    await DuplicationModelDeleteStore.request({
      clusterId: this.clusterId,
      federationId: this.duplication.federationId,
      modelName: this.modelName
    })
    this.isDeleting = false
    this.handleClose('isDeleteModelShow')
  }

  private handleClose(modelType: ClusterDisplayValue) {
    if (modelType === 'isModelShow') {
      MLXClusterModelStore.cleanState()
    }
    this.isModify = ''
    this.$emit('close', modelType)
  }

  private modifyInfo(row: ClusterMachineVoType) {
    this.isModify = this.modifyValue = row.detailId
  }

  private async handleModify(row: ClusterMachineVoType) {
    let newRow: any = {}
    this.machineList.forEach((item: ClusterMachineVoType) => {
      if (item.detailId === this.modifyValue) {
        newRow = item
      }
    })

    newRow.clusterId = row.clusterId
    newRow.federationId = row.federationId
    newRow.seq = row.seq

    const value = await FederationUpdateDetailStore.request(newRow)
    this.isModify = ''
    this.$emit('refreshTable', this.duplication)
    MLXClusterMachineListStore.getMachineList(this.clusterId)
  }
}
</script>
