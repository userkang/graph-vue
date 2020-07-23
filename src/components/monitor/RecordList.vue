<template>
  <div>
    <mtd-row :gutter="20">
      <mtd-col :span="7" class="flex-v-center">
        <div class="label">监控指标</div>
        <mtd-select v-model="alarmForm.indexKey" size="small" @change="search">
          <mtd-option
            v-for="(item,index) in keyList"
            :value="item.indexKey"
            :key="index"
            :label="item.name"
          ></mtd-option>
        </mtd-select>
      </mtd-col>
      <mtd-col :span="7" class="flex-v-center">
        <div class="label">告警级别</div>
        <mtd-select v-model="alarmForm.level" size="small" @change="search">
          <mtd-option
            v-for="item in alarmLevelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></mtd-option>
        </mtd-select>
      </mtd-col>
      <mtd-col :span="7" class="flex-v-center">
        <div class="label">状态</div>
        <mtd-select v-model="alarmForm.status" size="small" @change="search">
          <mtd-option
            v-for="item in alarmStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></mtd-option>
        </mtd-select>
      </mtd-col>
    </mtd-row>

    <mtd-row :gutter="20" style="margin-top: 18px">
      <mtd-col :span="8">
        <mtd-input
          v-model.trim="query"
          placeholder="输入服务appkey、接收人misid"
          @keyup.enter="search"
          suffix-icon="mtdicon mtdicon-search"
          style="width: 100%;"
        ></mtd-input>
      </mtd-col>
      <mtd-col :span="10" class="flex-v-center">
        <div class="label">告警时间</div>
        <mtd-date-picker
          type="daterange"
          placeholder="选择时间"
          style="width: 250px"
          @change="dateChange"
        ></mtd-date-picker>
      </mtd-col>
    </mtd-row>

    <div class="table-wrapper">
      <PageTable
        :data="listData"
        :page="page"
        :size="size"
        :total="listPage.totalCount"
        :loadingStatus="loading"
        @pageChange="handlePageChange"
        @sortChange="handleSortChange"
        :isPageShow="listPage.totalCount > 20"
      >
        <template slot="columns">
          <mtd-table-column label="服务appkey" width="180px" prop="appkey" />
          <mtd-table-column label="监控指标" prop="alarmIndexVo.name" />
          <mtd-table-column label="异常值">
            <template
              slot-scope="scope"
              v-if="scope.row.value"
            >{{scope.row.value + scope.row.alarmIndexVo.unit}}</template>
          </mtd-table-column>
          <mtd-table-column label="告警级别">
            <template slot-scope="scope">{{alarmLevel[scope.row.level]}}</template>
          </mtd-table-column>
          <mtd-table-column label="告警开始时间" prop="startTime" sortable="custom" />
          <mtd-table-column label="状态">
            <template slot-scope="scope">
              <span :class="`status-${scope.row.status}`"></span>
              {{alarmStatus[scope.row.status]}}
            </template>
          </mtd-table-column>
          <mtd-table-column label="接受人" prop="receiver" />
          <mtd-table-column label="操作" width="190px">
            <template slot-scope="scope">
              <span
                class="highlight-text table-link-btn"
                style="margin-right: 15px"
                @click="handleAlarm(scope.row.id)"
              >处理</span>
              <span
                class="highlight-text table-link-btn"
                style="margin-right: 15px"
                @click="goDetail(scope.row.templateId)"
              >查看监控配置</span>
              <span class="highlight-text table-link-btn" @click="stopMessage(scope.row.id)">停止</span>
            </template>
          </mtd-table-column>
        </template>
      </PageTable>
    </div>
  </div>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { RecordStore } from '@/stores/monitor/record'
import { PageType, SortPayloadType } from '@/types/common'
import PageTable from '@/components/PageTable.vue'
import { alarmLevelOptions, alarmStatusOptions } from '@/metaData/monitor'
import { parsePreciseTime } from '@/common/utils'
import { alarmStatus, alarmLevel } from '@/metaData/monitor'

@Component({
  components: {
    PageTable
  }
})
export default class RecordList extends Vue {
  page = 1
  size = 20
  sort = 'desc'
  query = ''
  state = RecordStore.state
  alarmLevelOptions = alarmLevelOptions
  alarmStatusOptions = alarmStatusOptions
  alarmStatus = alarmStatus
  alarmLevel = alarmLevel

  alarmForm = {
    indexKey: '',
    level: '',
    status: '',
    fromStartTime: '',
    toStartTime: ''
  }

  get keyList() {
    ;(this.state.keyList as any).unshift({
      indexKey: '',
      name: '全部'
    })

    return this.state.keyList
  }

  get listData() {
    return this.state.list
  }

  get loading() {
    return this.state.loading
  }

  get listPage() {
    return this.state.page
  }

  async handleAlarm(id: string) {
    const url = await RecordStore.handleAlarm(id)
    window.open(url, '_blank')
  }

  goDetail(id: string) {
    this.$router.push({
      params: {
        templateId: id
      },
      name: 'MonitorDetail'
    })
  }

  handlePageChange(value: PageType) {
    ;({ page: this.page, size: this.size } = value)
    this.search()
  }

  handleSortChange(value: SortPayloadType) {
    this.sort = value.order
    this.search(true)
  }

  async stopMessage(id: number) {
    const code = await RecordStore.stopAlarm(id)
    if (code === 0) {
      this.$mtd.message({ message: '停止成功', type: 'success' })
    }
  }

  dateChange(v: string) {
    this.alarmForm.fromStartTime = parsePreciseTime(v[0] as any)
    this.alarmForm.toStartTime = parsePreciseTime(v[1] as any)
    this.search(true)
  }

  async search(isResetPage = false) {
    if (isResetPage) {
      this.page = 1
    }
    await RecordStore.getRecordList({
      page: this.page,
      size: this.size,
      sort: this.sort,
      query: this.query,
      indexKey: this.alarmForm.indexKey,
      level: this.alarmForm.level,
      status: this.alarmForm.status,
      fromStartTime: this.alarmForm.fromStartTime,
      toStartTime: this.alarmForm.toStartTime
    })
  }

  async mounted() {
    this.search()
    RecordStore.getKeyList()
  }
}
</script>

<style lang="scss" scoped>
.table-wrapper {
  margin: 18px 10px;
}
.label {
  margin-right: 20px;
}
.status-20,
.status-10 {
  display: inline-block;
  height: 10px;
  width: 10px;
  border-radius: 2px;
}
.status-10 {
  background: #11a9ed;
}
.status-20 {
  background: #fabc14;
}
</style>