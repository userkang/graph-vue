<template>
  <mtd-modal v-model="localShow" :title="`${title}监控指标`" :destroy-on-close="true">
    <mtd-form :model="form" :rules="rules" ref="form" :label-width="120">
      <mtd-form-item label="监控指标" prop="indexKey" required>
        <mtd-select size="small" v-model="form.indexKey">
          <mtd-option
            v-for="item in keyList"
            :value="item.indexKey"
            :key="item.indexKey"
            :label="item.name"
          ></mtd-option>
        </mtd-select>
      </mtd-form-item>
      <mtd-form-item label="监控规则" prop="rules" required>
        <mtd-table :data="indexRules">
          <mtd-table-column label="规则" prop="operator" width="120">
            <template slot-scope="scope">
              <mtd-select
                :invalid="scope.row.id + '1' == inValidId"
                size="small"
                v-model="scope.row.operator"
                style="width: 80px"
              >
                <mtd-option v-for="item in operatorList" :value="item" :key="item" :label="item"></mtd-option>
              </mtd-select>
            </template>
          </mtd-table-column>
          <mtd-table-column label="阀值" prop="threshold" width="120">
            <template slot-scope="scope">
              <mtd-input
                :invalid="scope.row.id + '2' == inValidId"
                type="number"
                size="small"
                v-model="scope.row.threshold"
                style="width: 80px"
              ></mtd-input>
            </template>
          </mtd-table-column>
          <mtd-table-column label="单位">
            <template slot-scope="scope">{{indexUnit}}</template>
          </mtd-table-column>
          <mtd-table-column prop="triggerNum" width="140">
            <template slot="header" slot-scope="scope">
              触发次数
              <mtd-tooltip size="small" content="连续触发监控规则达到该次数后，开始告警" placement="top">
                <i class="mtdicon mtdicon-question-circle-o" style="color: #4E73FF"></i>
              </mtd-tooltip>
            </template>

            <template slot-scope="scope">
              >=
              <mtd-input
                :invalid="scope.row.id + '3' == inValidId"
                size="small"
                v-model="scope.row.triggerNum"
                style="width: 80px"
                type="number"
                min="1"
              ></mtd-input>
            </template>
          </mtd-table-column>
          <mtd-table-column label="操作">
            <template slot-scope="scope">
              <i class="mtdicon mtdicon-delete-o icon-theme" @click="deleteIndex(scope.$index)"></i>
            </template>
          </mtd-table-column>
        </mtd-table>
        <mtd-button
          @click="addIndex"
          size="small"
          type="text-primary"
          icon="mtdicon mtdicon-add-thick"
          v-if="!editData"
        >添加</mtd-button>
      </mtd-form-item>
      <mtd-form-item prop="level">
        <span slot="label">
          <mtd-tooltip
            placement="top"
            size="small"
            content="P0为最高告警级别，P2为最低告警级别。不同告警级别由不同公众号告警分级区分"
          >
            <i class="mtdicon mtdicon-question-circle-o" style="color: #4E73FF"></i>
          </mtd-tooltip>报警级别
        </span>
        <mtd-radio-group v-model="form.level" size="small">
          <mtd-radio :value="0">P0</mtd-radio>
          <mtd-radio :value="1">P1</mtd-radio>
          <mtd-radio :value="2">P2</mtd-radio>
        </mtd-radio-group>
      </mtd-form-item>
      <mtd-form-item label="告警方式">大象</mtd-form-item>
    </mtd-form>

    <div slot="footer" class="demo-modal-footer">
      <mtd-button @click="close">取消</mtd-button>
      <mtd-button type="primary" @click="submitModal">确定</mtd-button>
    </div>
  </mtd-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { DetailStore } from '@/stores/monitor/detail'
import { AlarmIndexQuery, AlarmRuleQuery, AlarmIndexVo } from '@/types/monitor'
import { operatorList } from '@/metaData/monitor'

@Component({
  components: {}
})
export default class AddMonitorIndicator extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  show = false

  @Prop({
    type: String,
    default: '新增'
  })
  title?: string

  @Prop({
    type: Object,
    default: null
  })
  editData?: AlarmIndexVo

  inValidId = ''
  operatorList = operatorList

  form: AlarmIndexQuery = {
    id: 0,
    templateId: 0,
    indexKey: '',
    level: 2,
    rules: []
  }

  indexRules: AlarmRuleQuery[] = []

  rules = {
    indexKey: {
      required: true,
      message: '请选择监控指标'
    },
    rules: {
      required: true,
      validator: this.validatorRules
    }
  }

  detailState = DetailStore.state

  indexUnit = ''

  get keyList() {
    return this.detailState.keyList
  }

  get localShow() {
    if (this.show) {
      this.init()
    }
    return this.show
  }

  set localShow(v: boolean) {
    this.indexRules = []
    ;(this.$refs.form as any).resetFields()
    this.$emit('update:show', v)
  }

  validatorRules(rule: string, value: [], cb: (msg?: string) => void) {
    if (!this.indexRules.length) {
      cb('监控规则不能为空')
    }

    this.indexRules.forEach((item: AlarmRuleQuery) => {
      if (!item.operator) {
        this.inValidId = item.id + '1'
        cb('请选择规则')
      } else if ((item.threshold as any) === '') {
        this.inValidId = item.id + '2'
        cb('阀值不能为空')
      } else if (item.triggerNum < 1) {
        this.inValidId = item.id + '3'
        cb('触发次数不能小于1')
      } else {
        this.inValidId = ''
      }
    })
    cb()
  }

  addIndex() {
    this.indexRules.push({
      id: this.indexRules.length + 1,
      operator: '',
      threshold: 0,
      triggerNum: 1
    })
  }

  deleteIndex(index: number) {
    this.indexRules.splice(index, 1)
  }

  close() {
    this.localShow = false
  }

  @Watch('form.indexKey')
  changeUnit() {
    this.keyList.forEach(item => {
      if (item.indexKey === this.form.indexKey) {
        this.indexUnit = item.unit
      }
    })
  }

  async submitModal() {
    await (this.$refs.form as any).validate()
    const templateId = this.$route.params.templateId
    this.form.templateId = Number(templateId)
    this.form.rules = this.indexRules
    if (this.editData) {
      await DetailStore.modifyIndex(templateId, this.form.id, this.form)
    } else {
      await DetailStore.addIndex(this.form)
    }
    await DetailStore.getTemplate(templateId)
    this.close()
  }

  async init() {
    await DetailStore.getKeyList()
    this.form = {
      id: 0,
      templateId: 0,
      indexKey: '',
      level: 2,
      rules: []
    }
    if (this.editData) {
      this.form.id = this.editData.id
      this.form.indexKey = this.editData.indexKey
      this.form.level = Number(this.editData.level)
      this.indexRules = this.editData.rules
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-theme {
  color: #606be1;
  font-size: 14px;
  cursor: pointer;
}
</style>