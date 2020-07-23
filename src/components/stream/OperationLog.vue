<template>
  <div>
    <mtd-table :data="list">
      <mtd-table-column prop="createTime" label="时间"></mtd-table-column>
      <mtd-table-column prop="operator" label="操作人"></mtd-table-column>
      <mtd-table-column prop="command" label="操作"></mtd-table-column>
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
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { OperationLogStore } from '@/stores/stream/detail'

@Component
export default class OperationLog extends Vue {
  private logState = OperationLogStore.state

  get list() {
    return this.logState.list
  }

  get page() {
    return this.logState.page
  }

  private change(page: number, size: number) {
    this.search({
      page: page ? page : 1,
      size
    })
  }

  private search(params: { size: number; page: number }) {
    const { taskId, jobId } = this.$route.params
    OperationLogStore.fetchLogList(params, {
      taskId,
      jobId
    })
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
