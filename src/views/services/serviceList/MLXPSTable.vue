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
      <MtdTableColumn label="类型" width="80px">
        <template slot-scope="scope">{{psTypeMap[scope.row.type]}}</template>
      </MtdTableColumn>
      <MtdTableColumn label="状态" width="80px">
        <template slot-scope="scope">
          <span
            :class="statusStyleFunc(scope.row.status)"
            style="font-size: 12px"
          >{{statusLabelFunc(scope.row.status)}}</span>
        </template>
      </MtdTableColumn>
      <MtdTableColumn label="负责人" prop="creator" width="180px" />
      <MtdTableColumn label="开始时间" prop="createTime" width="180px" sortable="custom" />
      <MtdTableColumn label="更新时间" prop="updateTime" width="180px" sortable="custom" />
    </template>
  </PageTable>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import PageTable from '@/components/PageTable.vue'
import { PageType, SortPayloadType } from '@/types/common'
import { MLXServiceListStore } from '@/stores/service/ServiceList'
import { PSVoType } from '@/types/mlxPs'
import {
  serviceStatusLabelFunc,
  serviceStatusStyleFunc,
  psTypeMap
} from '@/metaData/mlxPS'

@Component({
  components: {
    PageTable
  }
})
export default class MLXPSTable extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private query!: string
  @Prop()
  private status!: number
  @Prop()
  private psType!: number

  private page = 1
  private size = 20
  private sort = 'createTime'
  private order = 'desc'
  private psTypeMap = psTypeMap
  private mlxServiceListState = MLXServiceListStore.state
  private statusLabelFunc = serviceStatusLabelFunc
  private statusStyleFunc = serviceStatusStyleFunc

  get serviceListValue() {
    return this.mlxServiceListState.value
  }

  get serviceListPage() {
    return this.mlxServiceListState.page
  }

  get loadingStatus() {
    return this.mlxServiceListState.loadingStatus
  }

  private serviceDetailLink(row: PSVoType) {
    return {
      name: 'mlxpsDetail',
      params: {
        id: row.id,
        versionId: 0
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
    await MLXServiceListStore.request({
      status: this.status,
      psType: this.psType,
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
