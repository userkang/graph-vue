<template>
  <div>
    <!-- 新建监控modal -->
    <AddMonitorTemplate :show.sync="showAddMonitorTemplate" @refresh="search" />

    <mtd-row :gutter="20">
      <mtd-col :span="9">
        <mtd-input
          v-model.trim="query"
          placeholder="输入配置名、关联服务appkey、配置人misid"
          @keyup.enter="search"
          suffix-icon="mtdicon mtdicon-search"
          style="width: 100%;"
        ></mtd-input>
      </mtd-col>
      <mtd-col :span="8">
        <div class="flex-v-center" style="height: 34px">
          <div style="margin-right: 20px">是否开启</div>
          <mtd-checkbox-group @change="filterSearch" v-model="validValue" class="flex-v-center">
            <mtd-checkbox value="1">是</mtd-checkbox>
            <mtd-checkbox value="0">否</mtd-checkbox>
          </mtd-checkbox-group>
        </div>
      </mtd-col>
      <mtd-col :span="7" style="text-align: right">
        <mtd-button type="primary" @click="showAddMonitorTemplate = true">新建监控</mtd-button>
      </mtd-col>
    </mtd-row>

    <div class="table-wrapper">
      <PageTable
        :data="listData"
        :page="page"
        :size="size"
        :total="listPage.totalCount"
        :loadingStatus="loading"
        @pageChange="handlePageChange"
        @sortChange="handleSortChange"
        :isPageShow="listPage.totalCount > 20"
      >
        <template slot="columns">
          <mtd-table-column label="监控模版">
            <template slot-scope="scope">
              {{scope.row.name}}
              <span class="tag" v-if="scope.row.type == 'DEFAULT'">默认</span>
            </template>
          </mtd-table-column>
          <mtd-table-column label="关联服务appkey" prop="appkey[0]" />
          <mtd-table-column label="创建人" prop="creator" />
          <mtd-table-column label="最新配置时间" prop="createTime" sortable="custom" />
          <mtd-table-column label="是否开启" width="100px">
            <template slot-scope="scope">
              <mtd-switch
                size="small"
                :actived="scope.row.valid"
                :loading="switching === scope.row.id"
                @change="((value) => switchTemplate(value, scope.row.id, scope.$index))"
              ></mtd-switch>
            </template>
          </mtd-table-column>
          <mtd-table-column label="描述" prop="description" />
          <mtd-table-column label="操作">
            <template slot-scope="scope">
              <span
                class="highlight-text table-link-btn"
                style="margin-right: 15px"
                @click="editTemplate(scope.row.id)"
              >编辑</span>
              <span
                class="highlight-text table-link-btn"
                v-if="scope.row.type !== 'DEFAULT'"
                @click="deleteTemplate(scope.row)"
              >删除</span>
            </template>
          </mtd-table-column>
        </template>
      </PageTable>
    </div>
  </div>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { TemplateStore } from '@/stores/monitor/template'
import { PageType, SortPayloadType } from '@/types/common'
import { AlarmTemplateVo } from '@/types/monitor'
import PageTable from '@/components/PageTable.vue'
import AddMonitorTemplate from '@/components/monitor/modal/AddMonitorTemplate.vue'

@Component({
  components: {
    PageTable,
    AddMonitorTemplate
  }
})
export default class TemplateList extends Vue {
  page = 1
  size = 20
  sort = 'desc'
  query = ''
  valid = ''
  validValue = []
  state = TemplateStore.state
  showAddMonitorTemplate = false
  switching = ''

  get listData() {
    return this.state.list
  }

  get loading() {
    return this.state.loading
  }

  get listPage() {
    return this.state.page
  }

  filterSearch() {
    if (this.validValue.length === 1) {
      this.valid = this.validValue[0]
    } else {
      this.valid = ''
    }

    this.search(true)
  }

  handlePageChange(value: PageType) {
    ;({ page: this.page, size: this.size } = value)
    this.search()
  }

  handleSortChange(value: SortPayloadType) {
    this.sort = value.order
    this.search(true)
  }

  editTemplate(id: string) {
    this.$router.push({
      params: {
        templateId: id
      },
      name: 'MonitorDetail'
    })
  }

  async search(isResetPage = false) {
    if (isResetPage) {
      this.page = 1
    }
    await TemplateStore.getTemplateList({
      page: this.page,
      size: this.size,
      sort: this.sort,
      query: this.query,
      valid: this.valid
    })
  }

  async switchTemplate(value: boolean, id: string, index: number) {
    if (value) {
      await this.$mtd.confirm({
        title: '确认开启监控？',
        showCancelButton: true,
        okButtonText: '开启'
      })
      this.switching = id
      const code = await TemplateStore.openTemplate(id)
      // tslint:disable-next-line
      code === 0 && this.$mtd.message({ message: '开启成功', type: 'success' })
    } else {
      await this.$mtd.confirm({
        title: '确认关闭此监控？',
        message: '关闭模版监控后，监控指标将会联动关闭。',
        showCancelButton: true,
        okButtonText: '关闭',
        okButtonProps: {
          type: 'warning'
        }
      })
      this.switching = id
      const code = await TemplateStore.closeTemplate(id)
      // tslint:disable-next-line
      code === 0 && this.$mtd.message({ message: '关闭成功', type: 'success' })
    }
    this.switching = ''
    this.state.list[index].valid = value
    await this.search()
  }

  async deleteTemplate(row: AlarmTemplateVo) {
    if (row.valid) {
      await this.$mtd.message({
        message: '请先关闭监控模版再删除',
        type: 'warning',
        showClose: true
      })
      return
    }

    await this.$mtd.confirm({
      title: '删除监控模版',
      message: `确定要删除【${row.name}】模版吗？`,
      type: 'warning',
      showCancelButton: true,
      okButtonText: '删除',
      okButtonProps: {
        type: 'danger'
      }
    })

    await TemplateStore.deleteTemplate(String(row.id))
    await this.search()
  }

  async mounted() {
    this.search()
  }
}
</script>

<style lang="scss" scoped>
.table-wrapper {
  margin: 18px 10px;
}
.tag {
  display: inline-block;
  background: #5abb3c;
  color: #fff;
  font-size: 10px;
  padding: 3px 3px;
  text-align: center;
  border-radius: 2px;
  line-height: 1;
}
</style>