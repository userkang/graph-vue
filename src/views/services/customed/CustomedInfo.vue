<template>
  <div>
    <CustomedTemplateModal
      v-if="isShowCreateTemplate"
      :id="id"
      @close="isShowCreateTemplate = false"
      @refresh="handleRefreshTemplate"
    />
    <ServiceSectionTitle title="基础信息">
      <MtdButton size="small" class="delete-btn" @click="handleDeleteTask">删除</MtdButton>
    </ServiceSectionTitle>
    <section>
      <InfoItem label="服务类型">Custom Serving</InfoItem>
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
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ServiceSectionTitle from '@/components/service/ServiceSectionTitle.vue'
import InfoItem from '@/components/InfoItem.vue'
import EditTextItem from '@/components/editItem/EditTextItem.vue'
import EmptyAndLoading from '@/components/EmptyAndLoading.vue'
import { templateDetailLink } from '@/metaData/customed'
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
  MLXTFTemplateListStore
} from '@/stores/service/CustomService'
import CustomedTemplateModal from '@/components/service/customed/CustomedTemplateModal.vue'
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
    CustomedTemplateModal,
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

  private projectListState = ProjectListStore.state
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

  get templateLoading() {
    return this.mLXTFTemplateListState.loading
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
