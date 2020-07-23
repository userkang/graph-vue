<template>
  <div>
    <div @keydown.capture.enter="search(true)" style="margin-bottom: 10px">
      <MtdInput v-model="query" placeholder="请输入以查询" style="width: 300px" />
    </div>
    <PageTable
      :data="clusterRecordState.value"
      :page="page"
      :size="size"
      :total="clusterRecordState.page.totalCount"
      :loadingStatus="clusterRecordState.loadingStatus"
      @pageChange="handlePageChange"
      @sortChange="handleSortChange"
      :isPageShow="clusterRecordState.page.totalCount > 20"
    >
      <template slot="columns">
        <MtdTableColumn label="模型名称" prop="modelName" />
        <MtdTableColumn label="推送至">
          <template slot-scope="scope">{{extractModelName(scope.row.federationDetailInfo)}}</template>
        </MtdTableColumn>
        <MtdTableColumn label="操作人" prop="operator" />
        <MtdTableColumn label="创建时间/推送时间" prop="submitTime" sortable="custom" />
        <MtdTableColumn label="结束时间" prop="finishTime" sortable="custom" />
        <MtdTableColumn label="状态" prop>
          <template slot-scope="scope">
            <span
              :class="styleFunc(scope.row.status)"
            >{{ scope.row.status === 0? '审核中' : labelFunc(scope.row.status)}}</span>
          </template>
        </MtdTableColumn>
        <MtdTableColumn label="操作">
          <template slot-scope="scope">
            <router-link
              :to="detailLink(scope.row.recordId)"
              class="highlight-text"
              style="margin-right: 15px"
            >查看详情</router-link>
            <a
              target="_blank"
              rel="noreferrer noopener"
              class="highlight-text"
              :href="mergeWorkflowURL(scope.row.workflow)"
            >查看审核</a>
          </template>
        </MtdTableColumn>
      </template>
    </PageTable>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import PageTable from '@/components/PageTable.vue'
import { MLXClusterPushRecordStore } from '@/stores/service/MLXCluster'
import { PageType, SortPayloadType } from '@/types/common'
import {
  serviceStatusLabelFunc,
  serviceStatusStyleFunc
} from '@/metaData/mlxPS'
import { mlTestHosts } from '@/metaData/common'

@Component({
  components: { PageTable }
})
export default class MLXClusterRecord extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private clusterId!: string

  private page = 1
  private size = 20
  private query = ''
  private sort = 'createTime'
  private order = 'desc'
  private styleFunc = serviceStatusStyleFunc
  private labelFunc = serviceStatusLabelFunc
  private clusterRecordState = MLXClusterPushRecordStore.state

  private extractModelName(federationDetail: string) {
    try {
      return (JSON.parse(federationDetail) as any).federationNameList.join(',')
    } catch (e) {
      // tslint:disable-next-line
      console.error(e)
    }
    return ''
  }

  private mergeWorkflowURL(workflowNumber: string) {
    let WXHost = 'http://data.sankuai.com'
    if (mlTestHosts.includes(location.host)) {
      WXHost = 'http://wanxiang.data.test.sankuai.com'
    }
    return `${WXHost}/approval/#/order/ml/${workflowNumber}`
  }

  private detailLink(recordId: number) {
    return {
      name: 'mlxClusterPushDetail',
      params: {
        id: this.clusterId,
        recordId
      }
    }
  }

  private async handlePageChange(payload: PageType) {
    ;({ page: this.page, size: this.size } = payload)
    await this.search()
  }

  private async handleSortChange(payload: SortPayloadType) {
    ;({ sort: this.sort, order: this.order } = payload)
    await this.search(true)
  }

  private async search(isResetPage = false) {
    if (isResetPage) {
      this.page = 1
    }
    await MLXClusterPushRecordStore.request({
      clusterId: this.clusterId,
      query: this.query,
      page: this.page,
      size: this.size,
      sort: `${this.sort},${this.order}`
    })
  }

  private async mounted() {
    await this.search()
  }
}
</script>

