<template>
  <div>
    <mtd-modal
      class="schedule-modal"
      v-model="show"
      @close="closeSchedule"
      mask-closable
      title="调度配置"
      width="820px"
      minHeight="550px"
    >
      <span class="msg-text">（配置后，调度任务将切换到当前实验版本）</span>
      <div>
        <p class="second-name">基础属性</p>
        <div class="base-item">
          <p v-if="!task.taskName" class="msg-name">标识</p>
          <p v-if="task.taskName" class="msg-name">调度名称</p>
          <mtd-input
            v-if="!task.taskName"
            class="msg-value"
            type="text"
            v-model="task.userDef"
            placeholder="仅限英文、数字、下划线，可为空"
          ></mtd-input>
          <p v-if="task.taskName" class="msg-value">{{task.taskName}}</p>
        </div>

        <div class="base-item">
          <p class="msg-name">负责人</p>
          <p class="msg-value">{{task.owner}}</p>
        </div>

        <div class="base-item">
          <p class="msg-name">项目组</p>
          <p class="msg-value">{{task.projName}}</p>
        </div>

        <div class="base-item">
          <p class="msg-name">调度版本</p>
          <p v-if="!task.regId" class="msg-value-gray">未注册调度</p>
          <p v-if="task.regId" class="msg-value">{{task.regId}}</p>
        </div>

        <div class="base-item">
          <p class="msg-name">描述</p>
          <mtd-input class="msg-value" type="text" v-model="task.comment" placeholder="请输入描述信息"></mtd-input>
        </div>
      </div>

      <div>
        <p class="second-name">生产计划</p>
        <div class="base-item">
          <p class="msg-name-long">调度方式</p>
          <mtd-select class="value-select" v-model="queueName">
            <mtd-option
              class="msg-value-short"
              v-for="item in scheduleTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </mtd-select>
        </div>

        <div class="base-item" v-show="queueName === 'hour'">
          <p class="msg-name-long">指定小时</p>
          <mtd-input
            class="msg-value-short"
            v-model="task.execHours"
            type="text"
            placeholder="请输入时间"
          ></mtd-input>
          <mtd-tooltip content="从小到大逗号隔开" theme="light" placement="top">
            <i class="mtdicon mtdicon-question-circle-o" style="cursor: pointer;"></i>
          </mtd-tooltip>
        </div>

        <div class="base-item" v-show="queueName === 'weekly' || queueName === 'daily'">
          <p class="msg-name-long">就绪时间</p>
          <!-- <mtd-input 
            class='msg-value-short' 
            type="text" 
            v-model="task.readyTime"
            placeholder="格式如 09:30">
          </mtd-input>-->
          <mtd-time-picker
            v-model="task.readyTime"
            class="value-select"
            style="width: 180px"
            value-format="HH:mm"
            format="HH:mm"
          />
        </div>

        <div class="base-item" v-show="queueName === 'weekly'">
          <p class="msg-name-long">选择时间</p>
          <mtd-select class="value-select" v-model="task.execDay">
            <mtd-option
              class="msg-value-short"
              v-for="item in weekDayList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </mtd-select>
        </div>

        <div class="base-item" v-show="queueName === 'crontab'">
          <p class="msg-name-long">crontab表达式</p>
          <mtd-input
            class="msg-value-short"
            v-model="task.crontabExpr"
            type="text"
            placeholder="输入crontab"
          ></mtd-input>
        </div>

        <div class="base-item">
          <p class="msg-name-long">超时时间</p>
          <mtd-input
            class="msg-value-short"
            type="text"
            v-model="task.timeout"
            placeholder="请输入超时时间"
          ></mtd-input>s
        </div>

        <div class="base-item">
          <p class="msg-name-long">重试次错</p>
          <mtd-select class="value-select" v-model="task.maxRetryTimes">
            <mtd-option
              class="msg-value-short"
              v-for="item in maxRetryTimesTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </mtd-select>
        </div>

        <div class="base-item">
          <p class="msg-name-long" style="float: left;">调度依赖</p>
          <div class="relation-content">
            <mtd-button type="primary" v-if="task.relations.length === 0" @click="addRealtion">添加依赖</mtd-button>
            <div class="select-relation" v-for="(ele, index) in task.relations" :key="getUID(ele)">
              <div class="select-relation-item">
                <p class="select-relation-item-name" style="margin-top: 8px;">依赖来源</p>
                <mtd-select
                  v-model="ele.dependPlatform"
                  class="relation-from-select"
                  @change="changeDependPlatform(ele)"
                >
                  <mtd-option
                    v-for="item in relationWaysOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </mtd-select>
              </div>
              <div class="select-relation-item">
                <p class="select-relation-item-name">依赖对象</p>
                <mtd-select
                  class="relation-object-select"
                  v-model="ele.taskName"
                  placeholder="请选择实验"
                  remote
                  filterable
                  :remote-method="query => throttleHandleRemoteSerach(ele, query)"
                  :loading="dependencyLoadingStatus[getUID(ele)]"
                  @click.native="handleSelectClick(ele)"
                  @change="handleSelectChange(row)"
                >
                  <mtd-option
                    v-for="item in dependencyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </mtd-select>
              </div>
              <div class="select-relation-item relation-type">
                <p class="select-relation-item-name">依赖类型</p>
                <mtd-radio-group v-model="ele.dependType">
                  <mtd-radio :value="1">强</mtd-radio>
                  <mtd-radio :value="0">弱</mtd-radio>
                </mtd-radio-group>
              </div>
              <span class="add-relation">
                <i
                  class="mtdicon mtdicon-add-thick"
                  style="margin-right: 12px;"
                  @click="addOrRemoveRelation(ele, index, 'add')"
                ></i>
                <i
                  class="mtdicon mtdicon-delete-o"
                  @click="addOrRemoveRelation(ele, index, 'remove')"
                ></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div slot="footer" class="demo-modal-footer">
        <mtd-button @click="closeSchedule">关闭</mtd-button>
        <mtd-button :disabled="isLoading" type="primary" @click="saveOrEdit">保存调度</mtd-button>
        <mtd-button
          :disabled="isLoading"
          v-if="task.status && task.taskId"
          type="primary"
          @click="online"
        >上线调度</mtd-button>
        <mtd-button
          :disabled="isLoading"
          v-if="!task.status && task.taskId"
          type="danger"
          @click="offline"
        >下线调度</mtd-button>
      </div>
    </mtd-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import {
  ScheduleStore,
  FieldListStore,
  Option
} from '@/stores/graph/graphVisual/GraphVisual'
import {
  GraphVisualStore,
  GraphRequestStore
} from '../../stores/graph/graphVisual/GraphContent'
import { FieldSubmitItemVo } from '@/types/graph'
import * as _ from 'lodash'
import Axios from 'axios'
let uid = 0

const Row2UIDMap = new WeakMap<any, number>()

@Component
export default class ScheduleModel extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private isShowSchedule!: boolean

  @Prop(Number)
  private execId!: number

  @Prop(Number)
  private graphId!: number

  private relationWaysOptions = [
    {
      label: 'cantor',
      value: 20
    },
    {
      label: '可视化建模',
      value: 10
    }
  ]

  private weekDayList = [
    { name: '周一', value: '1' },
    { name: '周二', value: '2' },
    { name: '周三', value: '3' },
    { name: '周四', value: '4' },
    { name: '周五', value: '5' },
    { name: '周六', value: '6' },
    { name: '周天', value: '7' }
  ]

  private scheduleTypeList = [
    { name: '按小时调度', value: 'hour' },
    { name: '按天调度', value: 'daily' },
    { name: '按周调度', value: 'weekly' },
    { name: '定时调度', value: 'crontab' }
  ]

  private maxRetryTimesTypeList = [
    { name: '0次', value: 0 },
    { name: '1次', value: 1 },
    { name: '2次', value: 2 },
    { name: '3次', value: 3 },
    { name: '4次', value: 4 },
    { name: '5次', value: 5 }
  ]

  private ScheduleState = ScheduleStore.state

  private graphContentState = GraphVisualStore.state

  private dependencyList: Option[] = []
  private dependencyListWeakMap = new WeakMap<any, Option[]>()
  private dependencyLoadingStatus = {} as { [key in number]: boolean } // vue2不支持map
  private throttleHandleRemoteSerach = _.throttle(this.handleRemoteSearch, 500)

  get task() {
    return (
      this.graphContentState.value.task || {
        taskId: 0,
        bindId: 0,
        regId: 0,
        type: '',
        taskName: '',
        queueName: '',
        userDef: '',
        owner: '',
        projName: '',
        comment: '',
        maxRetryTimes: 2,
        relations: [
          {
            dependPlatform: 20,
            taskName: '',
            dependType: 1
          }
        ]
      }
    )
  }

  get taskId() {
    return this.task ? this.task.taskId || 0 : 0
  }

  private get queueName() {
    return this.task.queueName || 'hour'
  }

  private set queueName(val) {
    this.task.queueName = val
  }

  private get isLoading() {
    return this.ScheduleState.loading
  }

  private get show() {
    return this.isShowSchedule
  }
  private set show(v: boolean) {
    this.$emit('close-schedule')
  }

  private addRealtion() {
    this.task.relations.push({
      dependPlatform: 20,
      taskName: '',
      dependType: 1
    })
  }

  private addOrRemoveRelation(
    ele: {
      dependPlatform: number
      taskName: string
      dependType: number
    },
    index: number,
    playload: string
  ) {
    if (playload === 'add') {
      this.task.relations.splice(index + 1, 0, {
        dependPlatform: 20,
        taskName: '',
        dependType: 1
      })
    }
    if (playload === 'remove') {
      this.task.relations.splice(index, 1)
    }
  }

  private changeDependPlatform(ele: {
    dependPlatform: number
    taskName: string
    dependType: number
  }) {
    ele.taskName = ''
  }

  private closeSchedule() {
    this.$emit('close-schedule')
  }

  private async offline() {
    await ScheduleStore.offlineSchedule(this.taskId)
    await GraphRequestStore.request({
      graphId: this.graphId,
      execId: this.execId
    })
    this.closeSchedule()
  }

  private async online() {
    await ScheduleStore.onlineSchedule(this.taskId)
    await GraphRequestStore.request({
      graphId: this.graphId,
      execId: this.execId
    })
    this.closeSchedule()
  }

  private async saveOrEdit() {
    this.task.planType = this.task.queueName === 'crontab' ? 1 : 0
    let result
    if (this.taskId) {
      result = await ScheduleStore.editSchedule(
        this.graphId,
        this.execId,
        this.taskId,
        'dag',
        this.task
      )
    } else {
      result = await ScheduleStore.submitSchedule(
        this.graphId,
        this.execId,
        'dag',
        this.task
      )
    }
    if (result && result.taskId) {
      await GraphRequestStore.request({
        graphId: this.graphId,
        execId: this.execId
      })
    }
    this.closeSchedule()
  }

  private getUID(row: any) {
    const persistedUID = Row2UIDMap.get(row)
    if (!persistedUID) {
      Row2UIDMap.set(row, ++uid)
      return uid
    }
    return persistedUID
  }

  private async handleRemoteSearch(row: any, query: string) {
    const rowId = this.getUID(row)
    this.$set(this.dependencyLoadingStatus, rowId, true)
    this.dependencyList = await ScheduleStore.getScheduleOptions(
      row.dependPlatform!,
      query
    )
    // NOTE: 不要用finally包这一行，这里是故意在cancel的时候不执行的
    this.$set(this.dependencyLoadingStatus, rowId, false)
  }

  private handleSelectChange(row: any) {
    // 因为select不允许allow-create, 所以只有当用户真的选了select项的时候，才去存起来；而不是在handleRemoteSearch每次搜索都存一次。
    this.dependencyListWeakMap.set(row, this.dependencyList)
  }

  // 因为我们只是用了一个options源数据，即dependencyList。但我们却有多行row，多个select
  // 为了解决这里的矛盾，使用了一个dependencyListWeakMap来维护不同的select的options源数据
  private handleSelectClick(row: any) {
    if (this.dependencyListWeakMap.get(row)) {
      this.dependencyList = this.dependencyListWeakMap.get(row)!
    } else {
      this.dependencyList = []
      // HACK: Select组件会在row.taskName为空时，自动触发handleRemoteSearch(row, '')，但是row.taskName不为空时则不会
      // 这里加一行判断，统一逻辑
      if (!!row.taskName) {
        this.handleRemoteSearch(row, '')
      }
    }
  }

  private async created() {
    await ScheduleStore.getSchedule(this.taskId)
  }
}
</script>

<style lang="scss" scoped>
.schedule-modal {
  position: relative;
  ::v-deep .mtd-modal-header {
    padding: 30px;
    .mtd-modal-title {
      color: #333;
      font-size: 18px;
    }
  }
  .msg-text {
    position: absolute;
    top: 34px;
    left: 110px;
    font-size: 12px;
  }
}
.second-name {
  color: #141414;
  font-weight: bold;
  margin-bottom: 15px;
}
.base-item {
  font-size: 13px;
  margin-bottom: 15px;
  .relation-content {
    float: left;
    width: 300px;
  }
  .msg-name {
    display: inline-block;
    width: 60px;
    text-align: left;
    color: #878787;
  }
  .msg-name-long {
    @extend .msg-name;
    width: 100px;
  }
  .msg-value {
    display: inline-block;
    width: 390px;
    color: #2c2c2c;
    font-weight: bold;
    ::v-deep .mtd-input {
      border-left: none;
      border-top: none;
      border-right: none;
      border-radius: 0;
    }
  }
  .msg-value-gray {
    @extend .msg-value;
    color: #aaa;
    font-weight: normal;
  }
  .msg-value-short {
    ::v-deep .mtd-input {
      border-left: none;
      border-top: none;
      border-right: none;
      border-radius: 0;
    }
  }
  .value-select {
    ::v-deep .mtd-input {
      border-left: none;
      border-top: none;
      border-right: none;
      border-radius: 0;
    }
  }
}
.select-relation {
  width: 660px;
  .select-relation-item {
    font-size: 13px;
    margin-bottom: 15px;
    display: inline-block;
    .select-relation-item-name {
      display: inline-block;
      width: 62px;
      text-align: left;
      color: #878787;
    }
    .relation-from-select {
      width: 120px;
      margin-right: 14px;
    }
    .relation-object-input {
      width: 160px;
    }
    .relation-object-select {
      width: 160px;
      vertical-align: baseline;
    }
  }
  .relation-type {
    margin: 8px 14px 0 14px;
  }
  .add-relation {
    display: inline-block;
    width: 40px;
    height: 20px;
    text-align: center;
    cursor: pointer;
  }
}
</style>