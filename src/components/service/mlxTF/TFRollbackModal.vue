<template>
  <CommonModal
    width="800px"
    title="版本选择"
    :show.sync="show"
    @close="handleClose"
  >
    <div slot="title">
      <span class="modal-title">版本选择</span>
      <ToolTip>将回滚到指定发布任务发布完成后的状态</ToolTip>
    </div>
    <mtd-table
      :data="recordList"
      size="small"
      :selection="selection"
      @selection-change="selctionChange"
      class="table"
    >
      <EmptyAndLoading slot="empty" :loadingStatus="loadingStatus" />
      <mtd-table-column label="ID" prop="id" :width="80"></mtd-table-column>
      <mtd-table-column label="发布类型" :width="80">
        <template slot-scope="scope">{{deployType[scope.row.deployType]}}</template>
      </mtd-table-column>
      <mtd-table-column label="模型信息" width="110" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-for="model in scope.row.updateModels" :key="model.modelVersionId">{{model.name + ' '}}</span>
        </template>
      </mtd-table-column>
      <mtd-table-column width="30" class="select-wrap" type="expand">
        <template slot-scope="props">
          <mtd-table :data="props.row.updateModels" :show-header="false">
            <mtd-table-column :width="10" />
            <mtd-table-column>
              <template slot-scope="scope">{{`模型：${scope.row.name}`}}</template>
            </mtd-table-column>
            <mtd-table-column>
              <template slot-scope="scope">{{`版本：${scope.row.realVersion}`}}</template>
            </mtd-table-column>
            <mtd-table-column>
              <template slot-scope="scope">{{`实例数：${scope.row.instanceNum}`}}</template>
            </mtd-table-column>
          </mtd-table>
        </template>
      </mtd-table-column>
      <mtd-table-column label="发布后实例分布" width="110" prop="finalInstanceNum"></mtd-table-column>
      <mtd-table-column label="启动时间" prop="startTime"></mtd-table-column>
      <mtd-table-column label="完成时间" prop="finishTime"></mtd-table-column>
      <mtd-table-column type="selection" width="34"></mtd-table-column>
    </mtd-table>

    <div class="handle-panel has-top">
      <MtdButton type="primary" :disabled="!selection.length" @click="handleSubmit">回滚</MtdButton>
      <MtdButton class="cancel-btn gap" @click="handleClose">取消</MtdButton>
    </div>
  </CommonModal>
</template>

<style lang="scss" scoped>
.modal-title {
  margin-right: 5px;
  vertical-align: top;
}
::v-deep .table thead .mtd-checkbox {
  display: none;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import {
  ServingHistoryListStore,
  RollBackJobStore
} from '@/stores/service/MLXTF'
import { deployType } from '@/metaData/mlxTF'
import EmptyAndLoading from '@/components/EmptyAndLoading.vue'
import ToolTip from '@/components/ToolTip.vue'
import { ServingDeployRecordVo } from '@/types/mlxTF'

@Component({
  components: { CommonModal, EmptyAndLoading, ToolTip }
})
export default class TFRollbackModal extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private id!: string

  @Prop({
    type: String,
    required: true
  })
  private templateId!: string

  @Prop({
    type: Number,
    required: true
  })
  private jobId!: number

  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean

  private selectJobId = ''
  private deployType = deployType
  private selection: ServingDeployRecordVo[] = []

  private servingHistoryListState = ServingHistoryListStore.state

  get recordList() {
    return this.servingHistoryListState.value
  }

  get loadingStatus() {
    return this.servingHistoryListState.loading
  }

  private handleClose() {
    this.$emit('close')
  }

  private handleSubmit() {
    RollBackJobStore.request({
      jobId: this.jobId,
      recordId: (this.selection[0] as ServingDeployRecordVo).id
    })

    this.handleClose()
  }

  private selctionChange(selection: number[]) {
    if (this.selection.length > 1) {
      this.selection.splice(0, 1)
    }
  }
}
</script>
