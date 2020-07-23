<template>
  <section>
    <ServiceSectionTitle title="模型信息" isLeftAlign />
    <InfoItem v-for="(item, index) in initModels" :label="item.name" :key="item.id">
      <MtdForm :model="initMappings[index]" class="form-class">
        <MtdFormItem label="服务方式" v-if="initMappings[index]">
          <mtd-radio-group
            v-model="initMappings[index].autoUpgrade"
            @change="handleServiceTypeChange(index, 'autoUpgrade', getAutoUpgrade(index))"
          >
            <mtd-radio label="自动更新" :value="true" />
            <mtd-radio label="指定版本" :value="false" />
          </mtd-radio-group>
          <ToolTip style="margin-left: 15px">“指定版本”模式支持模型的灰度更新，“自动更新”模式不支持灰度更新</ToolTip>
        </MtdFormItem>
        <MtdFormItem label="模型版本" v-if="!getAutoUpgrade(index)">
          <MtdSelect
            v-model="initMappings[index].modelVersionIds"
            multiple
            filterable
            class="job-edit-form form-item"
          >
            <MtdOption
              v-for="version in getModelVersionsFromId(initMappings[index].modelId)"
              :key="version.id"
              :label="version.modelPath"
              :value="version.id"
            />
          </MtdSelect>
        </MtdFormItem>
        <MtdFormItem label="其他参数" v-if="initMappings[index]">
          <MtdTextarea v-model="initMappings[index].extra" class="job-edit-form form-item" />
        </MtdFormItem>
      </MtdForm>
    </InfoItem>
  </section>
</template>

<style lang="scss" scoped>
.form-class {
  background: #f2f5fb;
  border-radius: 1px;
  padding: 16px 20px;
  margin-bottom: 14px;

  .form-item {
    width: 300px;
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ServiceSectionTitle from '@/components/service/ServiceSectionTitle.vue'
import InfoItem from '@/components/InfoItem.vue'
import ToolTip from '@/components/ToolTip.vue'
import { MLXTFModelType, ServingModelMappingQueryType } from '@/types/mlxTF'
import {
  TemplateModelVersionListVoType,
  TemplateModelVersionVoType,
  MLXTFJobInfoStore,
  GetOnlineModelVersionsInJobStore
} from '@/stores/service/MLXTF'
import { processingStatus } from '@/metaData/mlxTF'

interface ModelVersionMap {
  [modelId: number]: TemplateModelVersionVoType[]
}

type ServiceFieldType = string | boolean | number[]

@Component({
  components: {
    InfoItem,
    ServiceSectionTitle,
    ToolTip
  }
})
export default class MLXTFJobModelForm extends Vue {
  @Prop({
    type: Array,
    required: true
  })
  private models!: MLXTFModelType[]

  @Prop({
    type: Array,
    required: true
  })
  private mappings!: ServingModelMappingQueryType[]

  @Prop({
    type: Array,
    required: true
  })
  private modelVersions!: TemplateModelVersionListVoType[]

  private initMappings: ServingModelMappingQueryType[] = []

  private initModels: MLXTFModelType[] = []

  private jobInfoState = MLXTFJobInfoStore.state

  private onlineModelVersionsInJobState = GetOnlineModelVersionsInJobStore.state

  private onlineVersions: {
    [key: number]: TemplateModelVersionVoType[]
  } = {}

  private firstChange: string[] = []

  get status() {
    return this.jobInfoState.value.status
  }

  get isProcessingStatus() {
    return processingStatus.includes(this.status)
  }

  get modelVersionsMap() {
    const map: ModelVersionMap = {}
    try {
      for (const item of this.modelVersions) {
        map[item.modelId] = item.versions
      }
      // tslint:disable-next-line
    } catch (e) {}
    return map
  }

  private getModelVersionsFromId(
    modelId: number
  ): TemplateModelVersionVoType[] {
    return this.modelVersionsMap[modelId]
  }

  private getOnlineVersionsFromId(modelId: number) {
    return this.onlineVersions[modelId]
  }

  private getAutoUpgrade(index: number) {
    try {
      return this.initMappings[index].autoUpgrade
      // tslint:disable-next-line
    } catch (e) {}
    return true
  }

  private async handleServiceTypeChange(
    index: number,
    field: string,
    value: ServiceFieldType
  ) {
    if (field === 'autoUpgrade' && value) {
      this.initMappings[index].modelVersionIds = []
    } else if (
      this.isProcessingStatus &&
      this.firstChange[index] === undefined
    ) {
      this.setOnlineDefaultVersion()
    }
    this.firstChange[index] = ''
  }

  private async created() {
    const mappings = [...this.mappings]
    const models = [...this.models]
    this.initMappings = mappings.sort((a, b) => a.modelId - b.modelId)
    this.initModels = models.sort((a, b) => a.id - b.id)
    this.setDefaultVersion()
    if (this.isProcessingStatus) {
      await this.getOnlineVersionList()
    }
  }

  private async getOnlineVersionList() {
    await GetOnlineModelVersionsInJobStore.request({
      jobId: String(this.$route.query.jobId),
      templateId: String(this.$route.query.templateId)
    })

    this.onlineModelVersionsInJobState.value.forEach(
      (item: TemplateModelVersionListVoType) => {
        const index = item.modelId
        this.onlineVersions[Number(index)] = item.versions
      }
    )
  }

  private setOnlineDefaultVersion() {
    this.initMappings.forEach((item, index) => {
      const versions: TemplateModelVersionVoType[] = this.getOnlineVersionsFromId(
        item.modelId
      )

      if (versions && versions.length) {
        // 先重置最新版的填充
        this.initMappings[index].modelVersionIds = []

        // 如果是运行中，将线上版本当成默认选项填充
        if (!this.initMappings[index].modelVersionIds.length) {
          versions.forEach(v => {
            this.initMappings[index].modelVersionIds.push(Number(v.id))
          })
        }
      }
    })
  }

  private setDefaultVersion() {
    setTimeout(() => {
      this.initMappings.forEach((item, index) => {
        const versions: TemplateModelVersionVoType[] = this.getModelVersionsFromId(
          item.modelId
        )
        if (versions && versions.length) {
          // 如果不是运行中，默认将最新版本填充
          const defautVersion: TemplateModelVersionVoType = versions[0]
          if (!this.initMappings[index].modelVersionIds.length) {
            this.initMappings[index].modelVersionIds.push(
              Number(defautVersion.id)
            )
          }
        }
      })
    }, 500)
  }

  @Watch('mappings', {
    immediate: true
  })
  private watchMappings() {
    const mappings = [...this.mappings]
    this.initMappings = mappings.sort((a, b) => a.modelId - b.modelId)
  }

  @Watch('models')
  private watchModels() {
    const models = [...this.models]
    this.initModels = models.sort((a, b) => a.id - b.id)
  }
}
</script>
