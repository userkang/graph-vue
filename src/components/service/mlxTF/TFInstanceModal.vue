<template>
  <mtd-modal v-model="localShow" title="运行实例数" :width="750">
    <mtd-table :data="instanceList" max-height="500">
      <EmptyAndLoading slot="empty" :loadingStatus="loadingStatus" />
      <mtd-table-column label="伸缩组" prop="name" />
      <mtd-table-column label="集群" prop="hdfsCluster" />
      <mtd-table-column label="队列" prop="queue" />
      <mtd-table-column label="host" prop="host" />
      <mtd-table-column label="端口" prop="port" />
      <mtd-table-column label="操作">
        <template slot-scope="scope">
          <span class="highlight-text table-link-btn" @click="linkToLog(scope.row)">查看日志</span>
        </template>
      </mtd-table-column>
    </mtd-table>
  </mtd-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ServingTemplateInstanceStore } from '@/stores/service/MLXTF'
import {
  SimplifiedModelVo,
  ScalingGroupGrayVo,
  ScalingGroupInstanceVo
} from '@/types/mlxTF'
import EmptyAndLoading from '../../../components/EmptyAndLoading.vue'

interface InstanceItem {
  scalingGroupId: number
  templateId: number
  jobId: number
  hdfsCluster: string
  queue: string
  host: string
  name: string
  port: string
}

@Component({
  components: {
    EmptyAndLoading
  }
})
export default class TFInstanceModal extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  show = false

  @Prop()
  id!: string

  @Prop()
  templateId!: string

  @Prop()
  modelDetail!: SimplifiedModelVo

  servingTemplateInstanceState = ServingTemplateInstanceStore.state

  get loadingStatus() {
    return this.servingTemplateInstanceState.loading
  }

  get instanceList() {
    const res: InstanceItem[] = []
    this.servingTemplateInstanceState.value.forEach(
      (item: ScalingGroupGrayVo) => {
        item.instanceVos.forEach((value: ScalingGroupInstanceVo) => {
          res.push({
            scalingGroupId: item.id,
            templateId: item.templateId,
            name: item.name,
            hdfsCluster: item.hdfsCluster,
            queue: item.queue,
            jobId: value.id,
            host: value.host,
            port: value.port
          })
        })
      }
    )
    return res
  }

  get localShow() {
    if (this.show) {
      this.init()
    }
    return this.show
  }

  set localShow(v: boolean) {
    this.$emit('update:show', v)
  }

  async init() {
    const params = {
      servingId: this.id,
      templateId: this.templateId,
      query: {
        modelId: this.modelDetail.id,
        realVersion: this.modelDetail.realVersion
      }
    }

    ServingTemplateInstanceStore.request(params)
  }

  private async linkToLog(v: InstanceItem) {
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