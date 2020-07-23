<template>
  <PageTable
    :page="page"
    :size="size"
    :total="serviceListPage.totalCount"
    :data="serviceListValue"
    :loadingStatus="loadingStatus"
    :isPageShow="serviceListPage.totalCount > 20"
    @pageChange="handlePageChange"
    @sortChange="handleSortChange"
  >
    <template slot="columns">
      <MtdTableColumn label="服务名" prop="name">
        <template slot-scope="scope">
          <router-link class="highlight-text" :to="serviceDetailLink(scope.row)">{{scope.row.name}}</router-link>
        </template>
      </MtdTableColumn>
      <MtdTableColumn label="appkey" prop="appkey">
        <template slot-scope="scope">{{scope.row.type === 3 ? '--' : scope.row.appkey}}</template>
      </MtdTableColumn>
      <MtdTableColumn label="环境" prop="environment" width="80px" />
      <MtdTableColumn label="分片数" prop="shardNum" width="80px" />
      <MtdTableColumn label="创建人" prop="creator" width="180px" />
      <MtdTableColumn label="开始时间" prop="createTime" width="180px" sortable="custom" />
    </template>
  </PageTable>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import PageTable from '@/components/PageTable.vue'
import { PageType, SortPayloadType } from '@/types/common'
import { MLXClusterListStore } from '@/stores/service/ServiceList'
import {
  serviceStatusLabelFunc,
  serviceStatusStyleFunc,
  psTypeMap
} from '@/metaData/mlxPS'
import { ClusterVoType } from '@/types/mlxCluster'

@Component({
  components: {
    PageTable
  }
})
export default class MLXClusterTable extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private query!: string

  private page = 1
  private size = 20
  private sort = 'createTime'
  private order = 'desc'
  private psTypeMap = psTypeMap
  private mlxClusterListState = MLXClusterListStore.state
  private statusLabelFunc = serviceStatusLabelFunc
  private statusStyleFunc = serviceStatusStyleFunc

  get serviceListValue() {
    return this.mlxClusterListState.value
  }

  get serviceListPage() {
    return this.mlxClusterListState.page
  }

  get loadingStatus() {
    return this.mlxClusterListState.loadingStatus
  }

  get routeName() {
    return this.$route.name
  }

  private serviceDetailLink(row: ClusterVoType) {
    return {
      name: 'mlxClusterDetail',
      params: {
        id: row.clusterId
      }
    }
  }

  private async handlePageChange(value: PageType) {
    ;({ page: this.page, size: this.size } = value)
    await this.search()
  }

  private async handleSortChange(value: SortPayloadType) {
    ;({ sort: this.sort, order: this.order } = value)
    await this.search(true)
  }

  private async search(isResetPage = false) {
    if (isResetPage) {
      this.page = 1
    }
    await MLXClusterListStore.request({
      page: this.page,
      size: this.size,
      sort: `${this.sort},${this.order}`,
      query: this.query
    })
  }

  private async mounted() {
    await this.search(true)
  }
}
</script>
