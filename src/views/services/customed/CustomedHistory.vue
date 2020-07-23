<template>
  <div>
    <HistoryDetail :show.sync="showHistoryDetail" />
    <PageTable
      :page="page"
      :size="size"
      :total="historyListState.page.totalCount"
      :data="historyListState.value"
      :loadingStatus="historyListState.loadingStatus"
      :isPageShow="historyListState.page.totalCount > 20"
      @pageChange="handlePageChange"
      @sortChange="handleSortChange"
    >
      <template slot="columns">
        <MtdTableColumn label="ID" prop="id" />
        <MtdTableColumn label="模板">
          <template slot-scope="scope">
            <router-link
              class="highlight-text"
              :to="templateDetailLink(scope.row.servingJob.template.servingId, scope.row.servingJob.template.id)"
            >{{scope.row.servingJob.template.name}}</router-link>
          </template>
        </MtdTableColumn>
        <MtdTableColumn label="发布任务" prop="label">
          <template slot-scope="scope">
            <router-link
              :to="jobViewDetailLink(
                    {
                        id: scope.row.servingJob.template.servingId,
                        templateId: scope.row.servingJob.template.id,
                        jobId: scope.row.servingJob.id
                    })"
              class="highlight-text"
            >{{scope.row.servingJob.label}}</router-link>
          </template>
        </MtdTableColumn>
        <MtdTableColumn label="环境" prop="servingJob.env" />
        <MtdTableColumn label="状态" width="105">
          <template slot-scope="scope">
            <span
              :class="tsStatusMapping(scope.row.status).class"
              style="font-size: 12px"
            >{{tsStatusMapping(scope.row.status).text}}</span>
          </template>
        </MtdTableColumn>
        <MtdTableColumn label="发布类型">
          <template slot-scope="scope">
            <span>{{deployType[scope.row.deployType]}}</span>
          </template>
        </MtdTableColumn>
        <MtdTableColumn label="创建人" prop="operator" />
        <MtdTableColumn label="启动时间" prop="startTime" width="180px" />
        <MtdTableColumn label="完成时间" prop="finishTime" width="180px" />
        <MtdTableColumn label="操作">
          <template slot-scope="scope">
            <div class="highlight-text table-link-btn" @click="goDetail(scope.row.id)">查看详情</div>
            <div
              style="margin-top: 5px"
              v-if="isShowStopUpdate(scope.row)"
              class="highlight-text table-link-btn"
              @click="stopUpdate(scope.row)"
            >停止更新</div>
          </template>
        </MtdTableColumn>
      </template>
    </PageTable>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import PageTable from '@/components/PageTable.vue'
import { PageType, SortPayloadType } from '@/types/common'
import {
  templateDetailLink,
  versionDetailLink,
  tfStatusMapping,
  jobViewDetailLink,
  JOBStatus
} from '@/metaData/mlxTF'
import {
  MLXTFHistoryListStore,
  ServingRecordStore,
  ShutdownAutoUpdateStore
} from '@/stores/service/MLXTF'
import { escapeHtml } from '@/common/utils'
import { Route } from 'vue-router'
import { deployType } from '@/metaData/mlxTF'
import HistoryDetail from '@/components/service/mlxTF/HistoryDetail.vue'
import { ServingDeployRecordVo } from '@/types/mlxTF'

@Component({
  components: {
    PageTable,
    HistoryDetail
  }
})
export default class MLXTFHistory extends Vue {
  private id = ''
  private page = 1
  private size = 20
  private sort = 'startTime'
  private order = 'desc'
  private tsStatusMapping = tfStatusMapping
  private templateDetailLink = templateDetailLink
  private versionDetailLink = versionDetailLink
  private jobViewDetailLink = jobViewDetailLink
  private historyListState = MLXTFHistoryListStore.state
  private deployType = deployType
  private showHistoryDetail = false

  private async handlePageChange(value: PageType) {
    ;({ page: this.page, size: this.size } = value)
    await this.search()
  }

  private async handleSortChange(value: SortPayloadType) {
    ;({ sort: this.sort, order: this.order } = value)
    await this.search(true)
  }

  private async search(isReset = false) {
    await MLXTFHistoryListStore.request({
      id: this.id,
      page: this.page,
      size: this.size,
      sort: `${this.sort},${this.order}`
    })
  }

  private goDetail(recordId: string) {
    ServingRecordStore.request(this.id, recordId)
    this.showHistoryDetail = true
  }

  private async mounted() {
    this.id = escapeHtml(this.$route.params.id)
    await this.search(true)
  }

  private isShowStopUpdate(row: ServingDeployRecordVo) {
    return row.status === JOBStatus.UPDATING && row.deployType === 1
  }

  private async stopUpdate(row: ServingDeployRecordVo) {
    const res = await ShutdownAutoUpdateStore.request(row.id, row.servingJob.id)
    if (res.code === 0) {
      await this.$mtd.message({
        type: 'success',
        message: res.message
      })
      setTimeout(() => {
        this.search(true)
      }, 3000)
    } else {
      await this.$mtd.message({
        type: 'warning',
        message: res.message
      })
    }
  }
}
</script>
