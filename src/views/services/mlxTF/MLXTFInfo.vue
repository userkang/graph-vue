<template>
  <div>
    <TFTemplateModal
      v-if="isShowCreateTemplate"
      :id="id"
      @close="isShowCreateTemplate = false"
      @refresh="handleRefreshTemplate"
    />
    <ServiceSectionTitle title="基础信息">
      <MtdButton size="small" class="delete-btn" @click="handleDeleteTask">删除</MtdButton>
    </ServiceSectionTitle>
    <section>
      <InfoItem label="服务类型">TF Serving</InfoItem>
      <InfoItem label="appkey">{{mlxTFInfo.appkey}}</InfoItem>
      <InfoItem label="负责人">{{mlxTFInfo.creator}}</InfoItem>
      <InfoItem label="创建时间">{{mlxTFInfo.createTime}}</InfoItem>
      <InfoItem label="更新时间">{{mlxTFInfo.updateTime}}</InfoItem>
      <InfoItem label="项目组">
        <EditSelectItem
          :text="mlxTFInfo.wxProject"
          :options="projectListValue"
          @valueChange="(value) => editDetail('projectName', value)"
        />
      </InfoItem>
      <InfoItem label="描述">
        <EditTextItem
          :text="mlxTFInfo.description"
          @submit="(value) => editDetail('description', value)"
        />
      </InfoItem>
    </section>
    <ServiceSectionTitle title="模板">
      <MtdButton size="small" class="submit-btn" @click="isShowCreateTemplate = true">
        <i
          class="iconfont icon-shenqingjiaruxiangmuzu"
          style="display: inline-block; margin-right: 10px"
        ></i>新建模板
      </MtdButton>
    </ServiceSectionTitle>
    <section>
      <MtdTable :data="mlxTFTemplate">
        <EmptyAndLoading slot="empty" :loadingStatus="templateLoading" />
        <MtdTableColumn label="模板名" prop>
          <template slot-scope="scope">
            <router-link
              class="highlight-text"
              :to="templateDetailLink(id, scope.row.id)"
            >{{scope.row.name}}</router-link>
          </template>
        </MtdTableColumn>
        <MtdTableColumn label="包含模型">
          <template slot-scope="scope">
            <router-link
              v-for="model in scope.row.models"
              :key="model.id"
              :to="{
                            name: 'modelDetail',
                            params: {
                                id: model.id
                            }
                        }"
              class="highlight-text"
              style="margin-right: 8px; display: inline-block"
            >{{model.name}}</router-link>
          </template>
        </MtdTableColumn>
        <MtdTableColumn label="状态">
          <template slot-scope="scope">
            <span
              :class="[statusStyleFunc(scope.row.status)]"
              style="font-size: 12px"
            >{{statusLabelFunc(scope.row.status)}}</span>
          </template>
        </MtdTableColumn>
        <MtdTableColumn label="创建人" prop="creator" />
        <MtdTableColumn label="创建时间" prop="createTime" />
      </MtdTable>
    </section>
    <div style="height: 18px"></div>
    <ServiceSectionTitle title="机器资源" />
    <div class="flex-v-center machine-info">
      <div class="machine-info-item">当前实例数：{{mlxTFInstance.instanceNum}}</div>
      <div class="machine-info-item">运行中伸缩组数： {{mlxTFInstance.runningNum}}</div>
      <div class="machine-info-search">
        <mtd-input
          size="small"
          v-model.trim="query"
          placeholder="请输入要查询的实例"
          @keyup.enter="search"
          class="search-input"
        ></mtd-input>
        <mtd-button class="search-btn submit-btn" size="small" @click="search">查询</mtd-button>
      </div>
    </div>
    <section>
      <MtdTable :data="instanceList">
        <EmptyAndLoading slot="empty" :loadingStatus="instanceLoading" />
        <MtdTableColumn label="实例" prop="host" />
        <MtdTableColumn label="端口" prop="port" width="120" />
        <MtdTableColumn label="伸缩组" prop="name" />
        <MtdTableColumn label="操作" width="90">
          <template slot-scope="scope">
            <span class="highlight-text table-link-btn" @click="linkToLog(scope.row)">查看日志</span>
          </template>
        </MtdTableColumn>
      </MtdTable>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ServiceSectionTitle from '@/components/service/ServiceSectionTitle.vue'
import InfoItem from '@/components/InfoItem.vue'
import EditTextItem from '@/components/editItem/EditTextItem.vue'
import EmptyAndLoading from '@/components/EmptyAndLoading.vue'
import { templateDetailLink } from '@/metaData/mlxTF'
import {
  ServingTemplateVoType,
  ServingVoType,
  ScalingGroupGrayVo,
  ServingInstanceVo,
  ScalingGroupInstanceVo
} from '@/types/mlxTF'
import {
  MLXTFDescUpdateStore,
  MLXTFDeleteStore,
  MLXTFInfoStore,
  ServingInstanceStore,
  MLXTFTemplateListStore
} from '@/stores/service/MLXTF'
import TFTemplateModal from '@/components/service/mlxTF/TFTemplateModal.vue'
import { promiseTimeout } from '@/common/utils'
import EditSelectItem from '@/components/editItem/EditSelectItem.vue'
import { ProjectListStore } from '@/stores/graph/GraphList'
import {
  serviceStatusLabelFunc,
  serviceStatusStyleFunc
} from '@/metaData/mlxPS'

interface Instance {
  scalingGroupId: number
  templateId: number
  jobId: number
  host: string
  name: string
  port: string
}

@Component({
  components: {
    EditSelectItem,
    TFTemplateModal,
    EmptyAndLoading,
    EditTextItem,
    InfoItem,
    ServiceSectionTitle
  }
})
export default class MLXTFInfo extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private id!: string
  @Prop({
    required: true
  })
  private mlxTFInfo!: ServingVoType

  @Prop({
    required: true
  })
  private mlxTFTemplate!: ServingTemplateVoType[]

  @Prop({
    required: true
  })
  private mlxTFInstance!: ServingInstanceVo

  private projectListState = ProjectListStore.state
  private servingInstanceState = ServingInstanceStore.state
  private mLXTFTemplateListState = MLXTFTemplateListStore.state
  private isShowCreateTemplate = false
  private templateDetailLink = templateDetailLink
  private statusStyleFunc = serviceStatusStyleFunc
  private statusLabelFunc = serviceStatusLabelFunc
  private query = ''

  get projectListValue() {
    return this.projectListState.value.map(item => ({
      label: item.name,
      value: item.name
    }))
  }

  get instanceList() {
    const res: Instance[] = []
    this.mlxTFInstance.scalingGroups.forEach((item: ScalingGroupGrayVo) => {
      item.instanceVos.forEach((value: ScalingGroupInstanceVo) => {
        res.push({
          scalingGroupId: item.id,
          templateId: item.templateId,
          name: item.name,
          jobId: item.servingVersionId,
          host: value.host,
          port: value.port
        })
      })
    })
    return res
  }

  get templateLoading() {
    return this.mLXTFTemplateListState.loading
  }

  get instanceLoading() {
    return this.servingInstanceState.loading
  }

  private async search() {
    await ServingInstanceStore.request(this.id, this.query)
  }

  private async handleDeleteTask() {
    try {
      await this.$mtd.confirm({
        title: '删除任务',
        type: 'warning',
        message: '您确认删除该任务吗？'
      })
      const isSuccess = await MLXTFDeleteStore.request(this.id)
      if (isSuccess) {
        this.$mtd.message('删除成功，即将返回')
        await promiseTimeout(3000)
        this.$router.push({
          name: 'serviceList',
          query: {
            modelType: 'tf_serving'
          }
        })
      }
    } catch (e) {
      // tslint:disable-next-line
      console.error(e)
    }
  }

  private handleRefreshTemplate() {
    this.isShowCreateTemplate = false
    this.$emit('refresh')
  }

  private async editDetail(field: string, value: string) {
    const projectName =
      field === 'projectName' ? value : this.mlxTFInfo.wxProject
    const description =
      field === 'description' ? value : this.mlxTFInfo.description
    await MLXTFDescUpdateStore.request({
      servingId: this.id,
      description,
      wxProject: projectName
    })
    await MLXTFInfoStore.resetState()
    this.$emit('refresh')
  }

  private async linkToLog(v: Instance) {
    this.$router.push({
      name: 'mlxTFJobApp',
      params: {
        id: String(this.id),
        scalingGroupId: String(v.scalingGroupId)
      },
      query: {
        templateId: String(v.templateId),
        jobId: String(v.jobId)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.iconfont {
  font-size: 12px;
}
.machine-info {
  margin: 5px 0 10px 0;
}
.machine-info-item {
  flex: 1;
  font-size: 12px;
  color: #555;
}
.machine-info-search {
  flex: 3;
  text-align: right;
  .search-input {
    width: 150px;
    margin-right: 10px;
    vertical-align: top;
  }
  .search-btn {
    width: 75px;
    vertical-align: top;
  }
}
</style>
