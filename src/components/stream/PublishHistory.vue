<template>
  <div>
    <mtd-table :data="list">
      <mtd-table-column prop="startTime" label="时间"></mtd-table-column>
      <mtd-table-column prop="commit" label="版本commit"></mtd-table-column>
      <mtd-table-column prop="publisher" label="发布人"></mtd-table-column>
      <mtd-table-column label="发布结果">
        <template slot-scope="scope">
          <PublishStatusTag :status="scope.row.publishStatus" />
        </template>
      </mtd-table-column>
      <mtd-table-column prop="description" label="描述"></mtd-table-column>
      <mtd-table-column prop="description" label="操作">
        <template slot-scope="scope">
          <mtd-button type="text-primary" @click="showDetail(scope.row)">详细信息</mtd-button>
          <mtd-button type="text-primary" @click="showLog(scope.row)">执行日志</mtd-button>
        </template>
      </mtd-table-column>
    </mtd-table>
    <mtd-pagination
      show-size-changer
      show-total
      @change="change"
      :total="page.totalCount"
      :current-page="page.currentPageNo"
      :page-size="page.pageSize"
      class="pager"
    ></mtd-pagination>
    <PublishDetailModal :show.sync="isShowDetialModal" :publishInfo="publishData" />
    <ExecutionLogModal
      :show.sync="isShowLogModal"
      :s3LogKey="s3LogKey"
      :taskId="$route.params.taskId"
      :jobId="$route.params.jobId"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import PublishStatusTag from './detail/PublishStatusTag.vue'
import PublishDetailModal from './detail/PublishDetailModal.vue'
import ExecutionLogModal from './detail/ExecutionLogModal.vue'
import { PublishHistoryStore } from '@/stores/stream/detail'
import { StreamJobHistoryVo } from '@/types/stream'

@Component({
  components: {
    PublishDetailModal,
    PublishStatusTag,
    ExecutionLogModal
  }
})
export default class PublishHistory extends Vue {
  private publishState = PublishHistoryStore.state
  private isShowDetialModal = false
  private isShowLogModal = false
  private publishData = {}
  private s3LogKey = ''

  get list() {
    return this.publishState.list
  }

  get page() {
    return this.publishState.page
  }

  private change(page: number, size: number) {
    this.search({
      page: page ? page : 1,
      size
    })
  }

  private search(params: { size: number; page: number }) {
    const { taskId, jobId } = this.$route.params
    PublishHistoryStore.fetchPublishList(params, {
      taskId,
      jobId
    })
  }

  private showDetail(detail: StreamJobHistoryVo) {
    this.isShowDetialModal = true
    this.publishData = detail
  }

  private showLog(detail: StreamJobHistoryVo) {
    this.isShowLogModal = true
    this.s3LogKey = detail.s3LogKey
  }

  private mounted() {
    this.search({
      size: this.page.pageSize,
      page: 1
    })
  }
}
</script>

<style lang="scss" scoped>
.pager {
  margin-top: 20px;
  text-align: right;
}
</style>
