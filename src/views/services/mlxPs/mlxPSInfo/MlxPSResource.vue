<template>
  <section style="margin-bottom: 40px">
    <PSResourceConfigModal
      v-if="isConfigShow"
      :isLocal="isLocal"
      :initForm="defaultForm"
      :isEditResource="isEditResource"
      @close="isConfigShow = false"
      @submit="handleAddResource"
    />
    <ServiceSectionTitle title="资源信息">
      <MtdButton v-if="psResource.length === 0" class="primary-btn" @click="showAddResource">配置资源</MtdButton>
    </ServiceSectionTitle>
    <MtdTable :data="psArgsResource">
      <EmptyIcon slot="empty" />
      <MtdTableColumn label="队列" prop="afoQueue" />
      <MtdTableColumn label="内存" prop="-DworkerMem" width="80px" />
      <MtdTableColumn label="PS个数" prop="-DworkerNum" width="80px" />
      <MtdTableColumn label="PS版本" prop="psVersion" />
      <MtdTableColumn label="其他参数" prop="config" />
      <MtdTableColumn label="操作" width="120px" v-if="!isHistoryService">
        <template slot-scope="scope">
          <div class="resource-handle-panel">
            <template v-if="!isServiceRunning">
              <i
                class="iconfont icon-Dashboard-mingchengbianji highlight-text"
                @click="showEditResource"
              ></i>
              <i
                class="iconfont icon-Dashboard-shanchu highlight-text"
                @click="handleRemoveResource"
              ></i>
            </template>
            <template v-else>
              <MtdTooltip content="需先停止服务才能更改" placement="top">
                <i class="iconfont icon-Dashboard-mingchengbianji"></i>
              </MtdTooltip>
              <MtdTooltip content="需先停止服务才能更改" placement="top">
                <i class="iconfont icon-Dashboard-shanchu"></i>
              </MtdTooltip>
            </template>
          </div>
        </template>
      </MtdTableColumn>
    </MtdTable>
  </section>
</template>

<style lang="scss" scoped>
.resource-handle-panel {
  i {
    font-size: 14px;
    display: inline-block;
    margin-right: 20px;
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ServiceSectionTitle from '@/components/service/ServiceSectionTitle.vue'
import EmptyIcon from '@/components/EmptyIcon.vue'
import { PSResourcePayloadType, PSResourceVoType } from '@/types/mlxPs'
import PSResourceConfigModal from '@/components/service/mlxPS/PSResourceConfigModal.vue'
import { PSConfigResourcePayload } from '@/stores/service/mlxPS/mlxPSResource'
import {
  PSConfigResourceStore,
  RemovePSResourceStore
} from '@/stores/service/mlxPS/mlxPSResource'

@Component({
  components: {
    PSResourceConfigModal,
    EmptyIcon,
    ServiceSectionTitle
  }
})
export default class MlxPSResource extends Vue {
  @Prop({
    required: true,
    type: Number
  })
  private id!: number

  @Prop({
    required: true,
    type: Array
  })
  private psResource!: PSResourceVoType[]

  @Prop({
    required: true,
    type: Number
  })
  private versionId!: number

  @Prop({
    required: true,
    type: String
  })
  private serviceName!: string

  @Prop({
    required: true,
    type: Boolean
  })
  private isServiceRunning!: boolean

  @Prop({
    required: true,
    type: Boolean
  })
  private isHistoryService!: boolean

  @Prop({
    type: Boolean,
    required: true
  })
  private isLocal!: boolean

  private isConfigShow = false

  private isEditResource = false

  private defaultForm: PSResourcePayloadType = {
    serviceName: '',
    runQueue: '',
    psMemory: 0,
    psCPU: 1,
    psNum: 0,
    psVersion: '',
    otherArgs: ''
  }

  get psArgsResource() {
    return this.psResource.map(item => ({
      ...item,
      ...this.extractPSArgs(item.afoResource)
    }))
  }

  private extractPSArgs(args: string) {
    let argMap = {}
    args
      .split(' ')
      .map(item => item.split('='))
      .map(item => ({ [item[0]]: item[1] }))
      .forEach(item => {
        argMap = { ...argMap, ...item }
      })
    return argMap
  }

  private repullResource() {
    this.$emit('repullResource')
  }

  private showAddResource() {
    this.isEditResource = false
    this.isConfigShow = true
  }

  private async showEditResource() {
    this.isEditResource = true
    this.defaultForm = {
      serviceName: this.serviceName,
      runQueue: this.psArgsResource[0].afoQueue,
      // @ts-ignore
      psMemory: this.psArgsResource[0]['-DworkerMem'],
      // @ts-ignore
      psCPU: this.psArgsResource[0]['-DcpuNum'] || 1,
      psVersion: this.psArgsResource[0].psVersion,
      // @ts-ignore
      psNum: this.psArgsResource[0]['-DworkerNum'],
      otherArgs: this.psArgsResource[0].config
    }
    this.isConfigShow = true
  }

  private async handleAddResource(payload: PSConfigResourcePayload) {
    this.isConfigShow = false
    const { type } = payload
    await PSConfigResourceStore.request({
      ...payload,
      id: type === 'edit' ? this.versionId : this.id
    })
    this.repullResource()
  }

  private async handleRemoveResource() {
    try {
      await this.$mtd.confirm({
        type: 'error',
        title: '警告',
        message: '确认删除吗？'
      })
      await RemovePSResourceStore.request(this.versionId)
      this.repullResource()
      // tslint:disable-next-line
    } catch (e) {}
  }
}
</script>
