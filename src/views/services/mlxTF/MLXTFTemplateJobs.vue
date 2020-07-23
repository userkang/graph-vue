<template>
  <div>
    <ServiceSectionTitle title="发布任务" isLeftAlign>
      <MtdButton size="small" class="submit-btn" @click="handleAddOrEditJob('add')">
        <i
          class="iconfont icon-shenqingjiaruxiangmuzu"
          style="display: inline-block;margin-right: 6px"
        ></i>
        新建任务
      </MtdButton>
    </ServiceSectionTitle>
    <PageTable
      :page="page"
      :size="size"
      :data="templateJobsState.value"
      :loadingStatus="templateJobsState.loadingStatus"
      :total="templateJobsState.page.totalCount"
      :isPageShow="templateJobsState.page.totalCount > 20"
      @pageChange="handlePageChange"
      @sortChange="handleSortChange"
    >
      <template slot="columns">
        <MtdTableColumn label="任务名" prop="label">
          <template slot-scope="scope">
            <router-link
              class="highlight-text"
              :to="{
                      name: 'mlxTFJobView',
                      params: {
                          id
                      },
                      query: {
                          templateId,
                          jobId: scope.row.id
                      }
                    }"
            >{{scope.row.label}}</router-link>
          </template>
        </MtdTableColumn>
        <MtdTableColumn label="环境" prop="env" sortable="custom" width="100" />
        <MtdTableColumn label="模型">
          <template slot-scope="scope">
            <router-link
              class="highlight-text"
              v-for="model in scope.row.mappings"
              :key="model.modelId"
              :to="{
                      name: 'modelDetail',
                      params: {
                          id: model.modelId
                      }
                    }"
            >{{model.modelName + ' '}}</router-link>
          </template>
        </MtdTableColumn>
        <MtdTableColumn label="伸缩组" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-for="scale in scope.row.scalingGroups" :key="scale.id">{{scale.name + ' '}}</span>
          </template>
        </MtdTableColumn>
        <MtdTableColumn label="状态" width="100">
          <template slot-scope="scope">
            <span
              :class="`${statusMapping(scope.row.status).class}`"
            >{{statusMapping(scope.row.status).text}}</span>
          </template>
        </MtdTableColumn>
        <MtdTableColumn label="创建时间" prop="createTime" sortable="custom" />
        <MtdTableColumn label="操作">
          <template slot-scope="scope">
            <MtdButton
              type="text"
              size="small"
              class="highlight-text"
              @click="handleAddOrEditJob('edit', scope.row.id)"
            >编辑</MtdButton>
            <MtdButton
              v-if="!isJobProcessing(scope.row.status)"
              type="text"
              size="small"
              class="highlight-text"
              @click="handleDeleteJob(scope.row.id)"
            >删除</MtdButton>
          </template>
        </MtdTableColumn>
      </template>
    </PageTable>
  </div>
</template>

<style scoped lang="scss">
.env-tabs {
  display: flex;
  align-items: baseline;
  margin-bottom: 6px;
  justify-content: space-between;
  &-choose {
    display: flex;
  }
  .tooltip {
    margin-left: 10px;
    margin-top: 2px;
    .icon-dayi {
      color: #606be1;
    }
  }
}
.iconfont {
  font-size: 12px;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ServiceSectionTitle from '@/components/service/ServiceSectionTitle.vue'
import EmptyIcon from '@/components/EmptyIcon.vue'
import ToolTip from '@/components/ToolTip.vue'
import { tfStatusMapping, processingStatus, JOBStatus } from '@/metaData/mlxTF'
import {
  MLXTFJobDeleteStore,
  MLXTFTemplateJobsStore
} from '@/stores/service/MLXTF'
import PageTable from '@/components/PageTable.vue'
import { PageType, SortPayloadType } from '@/types/common'

@Component({
  components: {
    PageTable,
    EmptyIcon,
    ServiceSectionTitle,
    ToolTip
  }
})
export default class MLXTFTemplateJobs extends Vue {
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

  private page = 1
  private size = 20
  private sort = 'createTime'
  private order = 'desc'
  private INIT_STATUS = JOBStatus.INIT
  private statusMapping = tfStatusMapping
  private templateJobsState = MLXTFTemplateJobsStore.state

  private isJobProcessing(status: number) {
    return processingStatus.includes(status)
  }

  private async handlePageChange(payload: PageType) {
    this.page = payload.page
    this.size = payload.size
    await this.search()
  }

  private async handleSortChange(payload: SortPayloadType) {
    this.sort = payload.sort
    this.order = payload.order
    await this.search(true)
  }

  private handleAddOrEditJob(type: string, jobId?: string) {
    let query: { [key: string]: string } = {
      templateId: this.templateId
    }
    if (type === 'edit') {
      query = { ...query, jobId: jobId as string, from: 'template' }
    }
    this.$router.push({
      name: 'mlxTFJobEdit',
      params: {
        id: this.id
      },
      query
    })
  }

  private async handleDeleteJob(jobId: number) {
    try {
      await this.$mtd.confirm({
        title: '删除任务',
        message: '您确定要删除该任务吗？'
      })
      await MLXTFJobDeleteStore.request({
        id: this.id,
        templateId: this.templateId,
        jobId
      })
      await this.search()
      // tslint:disable-next-line
    } catch (e) {}
  }

  private async search(isReset = false) {
    if (isReset) {
      this.page = 1
    }
    await MLXTFTemplateJobsStore.request({
      id: this.id,
      templateId: this.templateId,
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
