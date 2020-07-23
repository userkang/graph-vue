<template>
  <div>
    <AddMonitorIndicator
      :show.sync="showAddMonitorIndicator"
      :title="modalTitle"
      :editData="editData"
    />

    <InfoTitle title="监控指标">
      <div slot="content">
        <div class="flex-justify-v-center">
          <div class="warning-wrapper" style="margin-left: 10px">
            <i class="mtdicon mtdicon-warning-circle-o warning-icon"></i>
            <span class="warning-text">满足以下任何一项监控指标便会触发警报</span>
          </div>
          <div>
            <mtd-button v-if="isConfig" type="primary" size="small" @click="addIndicator">新建监控指标</mtd-button>
          </div>
        </div>
      </div>
    </InfoTitle>

    <mtd-table :data="alarmIndices">
      <EmptyAndLoading slot="empty" :loadingStatus="loadingStatus" />
      <mtd-table-column label="监控指标名" width="180px" prop="name" />
      <mtd-table-column label="监控规则" prop="rules">
        <template slot-scope="scope">
          <div v-for="item in scope.row.rules" :key="item.id">{{item.operator}} {{item.threshold}}</div>
        </template>
      </mtd-table-column>
      <mtd-table-column label="告警级别">
        <template slot-scope="scope">{{alarmLevel[scope.row.level]}}</template>
      </mtd-table-column>
      <mtd-table-column label="告警方式">
        <template slot-scope="scope">{{alarmChannel[scope.row.channel]}}</template>
      </mtd-table-column>
      <mtd-table-column label="是否开启" prop="valid">
        <template slot-scope="scope">
          <mtd-switch
            size="small"
            :actived="scope.row.valid"
            @change="((value) => switchIndex(value, scope.row.id, scope.$index))"
          ></mtd-switch>
        </template>
      </mtd-table-column>

      <mtd-table-column label="操作">
        <template slot-scope="scope" v-if="isConfig && !scope.row.valid">
          <i
            class="mtdicon mtdicon-edit-o icon-theme"
            style="margin-right: 15px"
            @click="editIndicator(scope.row)"
          ></i>
          <i class="mtdicon mtdicon-delete-o icon-theme" @click="deleteIndicator(scope.row)"></i>
        </template>
      </mtd-table-column>
    </mtd-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import InfoTitle from '@/components/InfoTitle.vue'
import EmptyAndLoading from '@/components/EmptyAndLoading.vue'
import { DetailStore } from '@/stores/monitor/detail'
import AddMonitorIndicator from '@/components/monitor/modal/AddMonitorIndicator.vue'
import { AlarmIndexVo } from '@/types/monitor'
import { alarmLevel, alarmChannel } from '@/metaData/monitor'

@Component({
  components: {
    InfoTitle,
    EmptyAndLoading,
    AddMonitorIndicator
  }
})
export default class Indicator extends Vue {
  DetailState = DetailStore.state
  showAddMonitorIndicator = false
  modalTitle = ''
  editData: object | null = {}
  switching = ''
  alarmLevel = alarmLevel
  alarmChannel = alarmChannel

  get loadingStatus() {
    return this.DetailState.loading
  }

  get alarmIndices() {
    return this.DetailState.detail.alarmIndices
  }

  get isConfig() {
    return (
      this.DetailState.detail.type && this.DetailState.detail.type !== 'DEFAULT'
    )
  }

  addIndicator() {
    this.showAddMonitorIndicator = true
    this.modalTitle = '新增'
    this.editData = null
  }

  editIndicator(row: AlarmIndexVo) {
    this.showAddMonitorIndicator = true
    this.modalTitle = '修改'
    this.editData = row
  }

  async switchIndex(value: boolean, id: string, index: number) {
    const templateId = this.$route.params.templateId

    if (value) {
      await this.$mtd.confirm({
        title: '确认开启所有关联服务的监控指标？',
        showCancelButton: true,
        okButtonText: '开启'
      })
      this.switching = id
      const code = await DetailStore.openIndex(templateId, id)
      // tslint:disable-next-line
      code === 0 && this.$mtd.message({ message: '开启成功', type: 'success' })
    } else {
      await this.$mtd.confirm({
        title: '确认关闭所有关联服务的监控指标？',
        showCancelButton: true,
        okButtonText: '关闭',
        okButtonProps: {
          type: 'warning'
        }
      })
      this.switching = id
      const code = await DetailStore.closeIndex(templateId, id)
      // tslint:disable-next-line
      code === 0 && this.$mtd.message({ message: '关闭成功', type: 'success' })
    }

    this.switching = ''

    this.alarmIndices[index].valid = value
    await DetailStore.getTemplate(templateId)
  }

  async deleteIndicator(row: AlarmIndexVo) {
    await this.$mtd.confirm({
      title: '删除监控指标',
      message: `确定要删除【${row.name}】监控指标吗？`,
      type: 'warning',
      showCancelButton: true,
      okButtonText: '删除',
      okButtonProps: {
        type: 'danger'
      }
    })

    const templateId = this.$route.params.templateId
    await DetailStore.deleteIndex(templateId, String(row.id))
    await DetailStore.getTemplate(templateId)
  }
}
</script>

<style lang="scss" scoped>
.icon-theme {
  color: #606be1;
  font-size: 14px;
  cursor: pointer;
}
.warning-wrapper {
  padding: 3px 5px;
  font-size: 12px;
  color: #ff9801;
  background: #fff6e5;
}

.warning-text {
  margin-left: 5px;
  font-size: 12px;
  font-weight: 400;
  color: #464646;
  line-height: 1;
}
</style>