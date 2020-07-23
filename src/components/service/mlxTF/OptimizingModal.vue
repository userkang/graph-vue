<template>
  <mtd-modal v-model="localShow" :width="850" @open="init">
    <div slot="title">
      <span class="modal-title">模型优化选择</span>
    </div>
    <div class="title">模型选择</div>
    <InfoItem label="模型" label-width="58px">
      <mtd-select v-model="testModel" size="small" style="width:220px">
        <mtd-option v-for="item in modelList" :key="item.id" :value="item" :label="item.modelName"></mtd-option>
      </mtd-select>
    </InfoItem>

    <InfoItem label-width="58px" label="模型路径">{{testModel.modelPrefixPath}}</InfoItem>

    <div v-if="testModel">
      <InfoItem label-width="58px" label="版本">
        <mtd-select v-model="modelVersion" size="small" style="width:220px">
          <mtd-option
            v-for="item in versionList"
            :key="item.id"
            :value="item"
            :label="item.modelPath"
          ></mtd-option>
        </mtd-select>
      </InfoItem>
      <InfoItem label-width="58px" label="版本路径">{{modelVersion.modelPath}}</InfoItem>
    </div>

    <div slot="footer">
      <mtd-button @click="localShow = false">取消</mtd-button>
      <mtd-button
        type="primary"
        v-if="optimizingConfig && optimizingConfig.optimizing"
        :disabled="!testEnable"
        @click="submitTest"
      >开始测试</mtd-button>
      <mtd-button type="primary" :disabled="!logEnable" @click="goToLog">查看日志</mtd-button>
    </div>
  </mtd-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import {
  MLXTFJobInfoStore,
  MLXTFModelVersionsStore,
  TemplateModelVersionListVoType,
  MLXTFOptimizingStore
} from '@/stores/service/MLXTF'
import {
  ServingModelMappingVoType,
  JobModelOptimizingUpdateQuery
} from '@/types/mlxTF'
import { ModelVersionVoType } from '@/types/model'
import EmptyAndLoading from '../../../components/EmptyAndLoading.vue'
import InfoItem from '@/components/InfoItem.vue'
import ToolTip from '@/components/ToolTip.vue'

@Component({
  components: {
    EmptyAndLoading,
    InfoItem,
    ToolTip
  }
})
export default class OptimizingModal extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  show = false

  @Prop({
    required: false
  })
  optimizingConfig!: JobModelOptimizingUpdateQuery

  @Prop()
  id!: string

  @Prop()
  jobId!: string

  @Prop()
  templateId!: string

  jobInfoState = MLXTFJobInfoStore.state
  modelVersionsState = MLXTFModelVersionsStore.state
  testModel: ServingModelMappingVoType | string = ''
  modelVersion: ModelVersionVoType | string = ''
  versionIds: string[] = []

  get modelList() {
    return this.jobInfoState.value.mappings
  }

  get modelId() {
    return (this.testModel as ServingModelMappingVoType).modelId
  }

  get modelVersionId() {
    return (this.modelVersion as ModelVersionVoType).id || 0
  }

  get modelVersionsValue() {
    return this.modelVersionsState.value
  }

  get versionList() {
    const res: TemplateModelVersionListVoType[] = this.modelVersionsValue.filter(
      item => {
        if (item.modelId === this.modelId) {
          return true
        }
      }
    )
    return res.length ? (res[0] as any).versions : []
  }

  get localShow() {
    return this.show
  }

  set localShow(v: boolean) {
    this.$emit('update:show', v)
  }

  get testEnable() {
    return this.testModel && this.modelVersion
  }

  get logEnable() {
    return this.testModel
  }

  async init() {
    this.testModel = ''
    this.modelVersion = ''
  }

  async mounted() {
    await MLXTFModelVersionsStore.request({
      id: this.id,
      templateId: this.templateId
    })
  }

  async submitTest() {
    const code = await MLXTFOptimizingStore.startupModelOptimizingJob(
      {
        jobId: this.jobId,
        modelId: this.modelId,
        modelVersionId: this.modelVersionId
      },
      this.optimizingConfig
    )
    if (code === 0) {
      this.goToLog()
      this.localShow = false
    }
  }

  async goToLog() {
    const res = await MLXTFOptimizingStore.jobOptimizeResultByJobId({
      jobId: this.jobId,
      modelId: this.modelId,
      modelVersionId: this.modelVersionId
    })

    if (res.code !== 0) {
      this.$mtd.message({
        type: 'warning',
        message: res.message
      })
      return
    }

    this.$router.push({
      name: 'OptimizingResult',
      params: {
        id: this.id,
        modelId: String(this.modelId),
        modelVersionId: String(this.modelVersionId)
      },
      query: {
        name: (this.testModel as ServingModelMappingVoType).modelName,
        jobId: this.jobId,
        templateId: this.templateId,
        config: JSON.stringify(this.optimizingConfig)
      }
    })
    this.localShow = false
  }
}
</script>

<style lang="scss" scoped>
.modal-title {
  margin-right: 5px;
  vertical-align: top;
}
.title {
  font-weight: 800;
  margin-bottom: 15px;
}
.info-item {
  margin-bottom: 20px;
}
.table-info {
  margin: 10px 0 10px 0;
  font-size: 12px;
  color: #666;
  .table-info-item {
    display: inline-block;
    margin-right: 30px;
  }
}
</style>