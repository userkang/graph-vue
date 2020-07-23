<template>
  <div>
    <ServiceSectionTitle title="基础信息" />
    <ul>
      <InfoItem label="版本ID">{{psRunningLogValue.versionId || ''}}</InfoItem>
      <InfoItem label="APP ID">{{psRunningLogValue.appid || ''}}</InfoItem>
      <InfoItem label="运行状态">{{statusLabelFunc(psRunningLogValue.status)}}</InfoItem>
      <InfoItem label="更新时间">{{psRunningLogValue.finishTime}}</InfoItem>
      <InfoItem label="创建时间">{{psRunningLogValue.startTime}}</InfoItem>
      <InfoItem label="启动命令">{{psRunningLogValue.command}}</InfoItem>
      <InfoItem label="服务日志" v-if="psRunningLogValue.appid">
        <MtdButton
          type="text"
          style="margin-top: -10px"
          class="highlight-text mini-btn"
          @click="openServiceLog"
        >点击查看</MtdButton>
      </InfoItem>
    </ul>
    <ServiceSectionTitle title="提交日志" />
    <CodeEditor height="800px" :value="psRunningLogValue.log" />
  </div>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { PSLogVoType } from '@/types/mlxPs'
import { serviceStatusLabelFunc } from '@/metaData/mlxPS'
import ServiceSectionTitle from '@/components/service/ServiceSectionTitle.vue'
import InfoItem from '@/components/InfoItem.vue'
import CodeEditor from '@/components/CodeEditor.vue'
import { MLXPSServiceLogStore } from '@/stores/service/mlxPS/mlxPS'

@Component({
  components: {
    CodeEditor,
    InfoItem,
    ServiceSectionTitle
  }
})
export default class MlxPsLog extends Vue {
  @Prop({
    required: true
  })
  private psRunningLogValue!: PSLogVoType

  private statusLabelFunc = serviceStatusLabelFunc

  private async openServiceLog() {
    if (this.psRunningLogValue && this.psRunningLogValue.appid) {
      const url = await MLXPSServiceLogStore.request(
        this.psRunningLogValue.appid
      )
      if (url) {
        window.open(url)
      }
    }
  }
}
</script>
