<template>
  <section>
    <PSMachineInfoModal
      v-if="isMachineInfoShow"
      :psMachineValue="psMachineValue"
      :psMachineText="psMachineText"
      @close="isMachineInfoShow = false"
    />
    <PSCollectorInfoModal
      v-if="isCollectorInfoShow"
      :psCollectorValue="psCollectorValue"
      :psCollectorText="psCollectorText"
      @close="handleCollector"
    />
    <AddPSModelModal
      v-if="isAddModelShow"
      :id="id"
      :appId="appId"
      :modelList="modelListValue"
      @close="isAddModelShow = false"
      @refreshModel="refreshModel"
    />
    <EvalPSModelModal
      v-if="isEvalModelShow"
      :id="id"
      :appId="appId"
      @close="isEvalModelShow = false"
    />
    <ListPSModelModal
      v-if="isListModelShow"
      :psList="listPSModelValue"
      @close="isListModelShow = false"
      @lookupMlx="lookupMlx"
    />
    <DropPSModelModal
      v-if="isDropModelShow"
      :psId="id"
      :psAppId="appId"
      @refreshModel="refreshModel"
      @close="isDropModelShow = false"
    />
    <ServiceSectionTitle title="模型管理">
      <MtdDropdown trigger="click">
        <DropDownBtn title="信息查看" />
        <MtdDropdownMenu slot="dropdown">
          <MtdDropdownMenuItem @click="showMachineInfo">机器信息</MtdDropdownMenuItem>
          <MtdDropdownMenuItem @click="showResourceInfo">资源信息</MtdDropdownMenuItem>
          <MtdDropdownMenuItem @click="showCollectorInfo">collector信息</MtdDropdownMenuItem>
        </MtdDropdownMenu>
      </MtdDropdown>
      <MtdDropdown trigger="click" v-if="!isHistoryService">
        <DropDownBtn title="操作模型" style="margin-right: 10px" />
        <MtdDropdownMenu slot="dropdown">
          <MtdDropdownMenuItem @click="isAddModelShow = true">load模型</MtdDropdownMenuItem>
          <MtdDropdownMenuItem @click="isEvalModelShow = true">eval模型</MtdDropdownMenuItem>
          <MtdDropdownMenuItem @click="handleListService">list模型</MtdDropdownMenuItem>
          <MtdDropdownMenuItem v-if="!isLocal" @click="isDropModelShow = true">drop模型</MtdDropdownMenuItem>
        </MtdDropdownMenu>
      </MtdDropdown>
    </ServiceSectionTitle>
    <ModalMetric :queryCategory="queryCategory" :show.sync="isShowMlx" :chartParams="chartParams" />
  </section>
</template>

<style lang="scss" scoped>
.head-panel {
  display: flex;
  flex-direction: row-reverse;
  font-size: 12px;
  i {
    font-size: 12px;
  }
}
.machine-table-wrap {
  max-height: 80vh;
  min-height: 400px;
  overflow-y: auto;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ServiceSectionTitle from '@/components/service/ServiceSectionTitle.vue'
import DropDownBtn from '@/components/service/mlxPS/DropDownBtn.vue'
import CommonModal from '@/components/CommonModal.vue'
import EmptyIcon from '@/components/EmptyIcon.vue'
import PSMachineInfoModal from '@/components/service/mlxPS/PSMachineInfoModal.vue'
import PSCollectorInfoModal from '@/components/service/mlxPS/PSCollectorInfoModal.vue'
import AddPSModelModal from '@/components/service/mlxPS/AddPSModelModal.vue'
import EvalPSModelModal from '@/components/service/mlxPS/EvalPSModelModal.vue'
import ListPSModelModal from '@/components/service/mlxPS/ListPSModelModal.vue'
import DropPSModelModal from '@/components/service/mlxPS/DropPSModelModal.vue'
import ModalMetric from '@/components/metric/ModalMetric.vue'
import { ChartCompParamsType } from '@/types/metric'

import {
  ListPSModelStore,
  PSMachineListStore,
  PSMachineResourceInfoStore,
  PSCollectorStore
} from '@/stores/service/mlxPS/mlxPSModelPanel'
import { ModelListStore } from '@/stores/model'

@Component({
  components: {
    DropPSModelModal,
    ListPSModelModal,
    EvalPSModelModal,
    AddPSModelModal,
    PSMachineInfoModal,
    PSCollectorInfoModal,
    EmptyIcon,
    CommonModal,
    DropDownBtn,
    ServiceSectionTitle,
    ModalMetric
  }
})
export default class PSModelPanel extends Vue {
  @Prop({
    type: Number,
    required: true
  })
  private id!: number

  @Prop({
    type: Number,
    required: true
  })
  private appId!: number

  @Prop({
    type: Boolean,
    required: true
  })
  private isLocal!: boolean

  @Prop({
    type: Boolean,
    required: true
  })
  private isHistoryService!: boolean

  private isMachineInfoShow = false
  private isCollectorInfoShow = false
  private isAddModelShow = false
  private isEvalModelShow = false
  private isListModelShow = false
  private isDropModelShow = false
  private modeListState = ModelListStore.state
  private psMachineState = PSMachineListStore.state
  private psCollectorState = PSCollectorStore.state
  private listPSModelState = ListPSModelStore.state

  private isShowMlx = false
  private chartParams: ChartCompParamsType = {
    psId: '',
    modelName: ''
  }

  private lookupMlx(data: any) {
    this.isShowMlx = true
    this.chartParams = {
      modelName: data.modelName,
      psId: this.$route.params.id
    }
  }

  get queryCategory() {
    return this.isShowMlx ? 'psModelName' : ''
  }

  get psMachineValue() {
    return this.psMachineState.value
  }

  get psMachineText() {
    if (this.psMachineValue.length > 0) {
      // 近线
      if (this.isLocal) {
        const ipText = this.psMachineValue
          .map(machine => machine.host)
          .join(';')
        const portText = this.psMachineValue
          .map(machine => machine.port)
          .join(';')
        return `-ps_hosts "${ipText}"  -ps_ports "${portText}"`
      } else {
        let ipText = 'ps_hosts:\n'
        let portText = 'ps_ports:\n'
        this.psMachineValue.forEach(machine => {
          ipText = `${ipText} - "${machine.host}"\n`
          portText = `${portText} - ${machine.port}\n`
        })
        return `${ipText}${portText}`
      }
    }
    return ''
  }

  get psCollectorValue() {
    return this.psCollectorState.value
  }

  get psCollectorText() {
    if (this.psCollectorValue.length > 0) {
      const data = this.psCollectorValue[0]
      return `collector_host: "${data.host}"\ncollector_port: ${data.port}`
    }
    return ''
  }

  get listPSModelValue() {
    return this.listPSModelState.value
  }

  get modelListValue() {
    return this.modeListState.value
  }

  private refreshModel() {
    this.$emit('refreshModel')
  }

  private async showMachineInfo() {
    await PSMachineListStore.request({
      psId: this.id,
      psAppId: this.appId
    })
    this.isMachineInfoShow = true
  }

  private async showCollectorInfo() {
    await PSCollectorStore.request({
      psId: this.id
    })
    this.isCollectorInfoShow = true
  }

  private async showResourceInfo() {
    const url = await PSMachineResourceInfoStore.request({
      psId: this.id,
      psAppId: this.appId
    })
    if (url) {
      window.open(url)
    }
  }

  private async handleListService() {
    this.isListModelShow = true
    if (this.appId) {
      await ListPSModelStore.request({
        psId: this.id,
        psAppId: this.appId
      })
    } else {
      this.$mtd.message('appId 不存在')
    }
  }

  private handleCollector() {
    this.isCollectorInfoShow = false
    PSCollectorStore.reset()
  }
}
</script>
