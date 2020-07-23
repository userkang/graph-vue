<template>
  <PageTable
    :page="page"
    :size="size"
    :total="tfListState.page.totalCount"
    :data="tfListState.value"
    :loadingStatus="tfListState.loadingStatus"
    :isPageShow="tfListState.page.totalCount > 20"
    @pageChange="handlePageChange"
    @sortChange="handleSortChange"
  >
    <template slot="columns">
      <MtdTableColumn label="服务名">
        <template slot-scope="scope">
          <router-link class="highlight-text" :to="serviceDetailLink(scope.row.id)">{{scope.row.id}}</router-link>
        </template>
      </MtdTableColumn>
      <MtdTableColumn label="appkey" prop="appkey" />
      <MtdTableColumn label="状态">
        <template slot-scope="scope">
          <span
            :class="statusStyleFunc(scope.row.status)"
            style="font-size: 12px"
          >{{statusLabelFunc(scope.row.status)}}</span>
        </template>
      </MtdTableColumn>
      <MtdTableColumn label="项目组" prop="wxProject" />
      <MtdTableColumn label="创建人" prop="creator" width="180px" />
      <MtdTableColumn label="开始时间" prop="createTime" width="180px" sortable="custom" />
      <MtdTableColumn label="更新时间" prop="updateTime" width="180px" sortable="custom" />
    </template>
  </PageTable>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import PageTable from '@/components/PageTable.vue'
import { PageType, SortPayloadType } from '@/types/common'
import {
  serviceStatusLabelFunc,
  serviceStatusStyleFunc
} from '@/metaData/mlxPS'
import { MLXTFListStore } from '@/stores/service/MLXTF'
import { admins } from '@/metaData/common'
import { UserStore } from '@/stores/common'

@Component({
  components: {
    PageTable
  }
})
export default class MLXTFTable extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private query!: string
  @Prop()
  private status!: number
  @Prop()
  private isOwnServing!: boolean

  @Prop({
    default: 'tf_serving'
  })
  private type!: string

  private page = 1
  private size = 20
  private sort = 'createTime'
  private order = 'desc'
  private admins = admins
  private statusStyleFunc = serviceStatusStyleFunc
  private statusLabelFunc = serviceStatusLabelFunc
  private tfListState = MLXTFListStore.state
  private userInfoState = UserStore.state

  get isAdmin() {
    return admins.includes(this.userInfoState.value.misID)
  }

  private serviceDetailLink(id: string) {
    return {
      name: this.type === 'tf_serving' ? 'mlxTFDetail' : 'customedDetail',
      params: {
        id
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

  private async search(isReset = false) {
    if (isReset) {
      this.page = 1
    }
    await MLXTFListStore.request({
      status: this.status,
      query: this.query,
      page: this.page,
      size: this.size,
      sort: `${this.sort},${this.order}`,
      type: this.type,
      isOwnServing: this.isOwnServing
    })
  }

  private async mounted() {
    await this.search(true)
  }
}
</script>
