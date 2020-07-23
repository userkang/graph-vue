<template>
  <mtd-drawer v-model="localShow" :width="650">
    <div v-if="loading" class="loading">
      <mtd-loading type="line-scale" message="正在加载中"></mtd-loading>
    </div>

    <div v-else>
      <div class="title">基础信息</div>
      <InfoItem labelWidth="60px" label="模版名称">{{recordDetail.servingJob.template.name}}</InfoItem>
      <InfoItem labelWidth="60px" label="发布任务">{{recordDetail.servingJob.label}}</InfoItem>
      <InfoItem labelWidth="60px" label="发布类型">{{deployType[recordDetail.deployType]}}</InfoItem>
      <InfoItem labelWidth="60px" label="启动时间">{{recordDetail.startTime}}</InfoItem>
      <InfoItem labelWidth="60px" label="完成时间">{{recordDetail.finishTime}}</InfoItem>
      <div style="height: 15px;"></div>

      <div class="title">原版本</div>
      <mtd-table :data="recordDetail.originModels">
        <mtd-table-column label="模型" prop="name"></mtd-table-column>
        <mtd-table-column label="模型路径" prop="modelPath"></mtd-table-column>
        <mtd-table-column label="版本" prop="realVersion"></mtd-table-column>
        <mtd-table-column label="实例数" prop="instanceNum"></mtd-table-column>
      </mtd-table>
      <div style="height: 20px;"></div>

      <div class="title">发布版本</div>
      <mtd-table :data="recordDetail.updateModels">
        <mtd-table-column label="模型" prop="name"></mtd-table-column>
        <mtd-table-column label="模型路径" prop="modelPath"></mtd-table-column>
        <mtd-table-column label="版本" prop="realVersion"></mtd-table-column>
        <mtd-table-column label="实例数" prop="instanceNum"></mtd-table-column>
      </mtd-table>
      <div style="height: 20px;"></div>

      <div class="title">发布实例</div>
      <mtd-table :data="recordDetail.updateDetail">
        <mtd-table-column type="expand">
          <template slot-scope="props">
            <mtd-table :data="props.row.instanceVos" :show-header="false" size="small">
              <mtd-table-column width="50" />
              <mtd-table-column>
                <template slot-scope="scope">{{scope.row.host + ':' + scope.row.port}}</template>
              </mtd-table-column>
            </mtd-table>
          </template>
        </mtd-table-column>
        <mtd-table-column label="伸缩组" prop="name"></mtd-table-column>
        <mtd-table-column label="serving集群" prop="hdfsCluster"></mtd-table-column>
        <mtd-table-column label="运行队列" prop="queue"></mtd-table-column>
        <mtd-table-column label="worker个数">
          <template slot-scope="scope">{{scope.row.resource | resourceFilter(1)}}</template>
        </mtd-table-column>
        <mtd-table-column label="worker内存">
          <template slot-scope="scope">{{scope.row.resource | resourceFilter(2)}}</template>
        </mtd-table-column>
        <mtd-table-column label="CPU个数">
          <template slot-scope="scope">{{scope.row.resource | resourceFilter(3)}}</template>
        </mtd-table-column>
        <mtd-table-column label="GPU个数">
          <template slot-scope="scope">{{scope.row.resource | resourceFilter(4)}}</template>
        </mtd-table-column>
      </mtd-table>
      <div style="height: 20px;"></div>

      <div class="title">发布日志</div>
      <CodeEditor v-model="recordDetail.log" height="400px" :readOnly="true" />
    </div>
  </mtd-drawer>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import InfoItem from '@/components/InfoItem.vue'
import { ServingRecordStore } from '@/stores/service/MLXTF'
import { deployType } from '@/metaData/mlxTF'
import CodeEditor from '@/components/CodeEditor.vue'

@Component({
  components: { InfoItem, CodeEditor },
  filters: {
    resourceFilter(value: string, num: number) {
      const match = value.match(
        /-Dworkers=(\d+) -Dworker.memory=(\d+) -Dworker.vcore=(\d+) -Dworker.g.*=(\d+)/
      )

      if (num === 2) {
        const memory = match ? match[2] : ''
        return Number(memory) / 1024 + 'G'
      }

      return match ? match[num] : ''
    }
  }
})
export default class HistoryDetail extends Vue {
  @Prop({
    default: true,
    type: Boolean
  })
  show!: boolean

  servingRecordState = ServingRecordStore.state
  deployType = deployType

  get recordDetail() {
    return this.servingRecordState.value
  }

  get loading() {
    return this.servingRecordState.loading
  }

  get localShow() {
    return this.show
  }

  set localShow(v: boolean) {
    this.$emit('update:show', v)
  }
}
</script>

<style lang="scss" scoped>
.loading {
  padding-top: 50px;
}
.title {
  font-weight: 800;
  margin-bottom: 15px;
}
</style>