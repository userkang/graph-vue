<template>
  <mtd-modal v-model="localShow" title="添加关联服务" :destroy-on-close="true">
    <mtd-form :model="form" :rules="rules" ref="form" :label-width="120">
      <mtd-form-item prop="id" label="服务appkey" required v-if="isAdd">
        <mtd-select
          :loading="appKeyLoading"
          filterable
          remote
          :debounce="300"
          :remote-method="getAppKeyList"
          v-model="serving"
          style="width: 245px"
        >
          <mtd-option
            v-for="item in servingList"
            :value="{id: item.id, type: item.type}"
            :key="item.id"
            :label="item.appkey"
          ></mtd-option>
        </mtd-select>
      </mtd-form-item>
      <mtd-form-item prop="receiver" required>
        <span slot="label">
          <mtd-tooltip placement="top" size="small" content="默认为服务负责人，最多可设置两位">
            <i class="mtdicon mtdicon-question-circle-o" style="color: #4E73FF"></i>
          </mtd-tooltip>告警接收人
        </span>
        <mtd-select
          :loading="userLoading"
          filterable
          remote
          multiple
          :debounce="300"
          :remote-method="getUserList"
          v-model="receiver"
          style="width: 245px"
        >
          <mtd-option v-for="item in userList" :value="item" :key="item" :label="item"></mtd-option>
        </mtd-select>
      </mtd-form-item>
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
import {
  AlarmServingTemplateMappingQuery,
  AlarmServingTemplateMappingVo
} from '@/types/monitor'

@Component({
  components: {}
})
export default class AddServing extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  show = false

  @Prop({
    type: Boolean,
    default: true
  })
  isAdd?: boolean

  @Prop({
    type: Object,
    default: null
  })
  editData?: AlarmServingTemplateMappingVo

  appKeyLoading = false
  userLoading = false
  servingType = 'tf_serving'
  receiver: string[] = []
  serving = ''
  detailState = DetailStore.state

  form: AlarmServingTemplateMappingQuery = {
    templateId: 0,
    servingId: 0,
    type: '',
    receiver: ''
  }

  rules = {
    id: {
      required: true,
      validator: this.validateServing
    },
    receiver: {
      required: true,
      validator: this.validateReceiver
    }
  }

  get servingList() {
    return this.detailState.servingList
  }

  get userList() {
    return this.detailState.userList
  }

  get localShow() {
    if (this.show) {
      this.init()
    }
    return this.show
  }

  set localShow(v: boolean) {
    this.receiver = []
    this.serving = ''
    ;(this.$refs.form as any).resetFields()
    this.$emit('update:show', v)
  }

  async getAppKeyList(query: string) {
    this.appKeyLoading = true
    // 目前只有 tf_serving 这一种类型，所以写死，后面可能会加
    await DetailStore.getServingList(this.servingType, query)
    this.appKeyLoading = false
  }

  async getUserList(query: string) {
    this.userLoading = true
    await DetailStore.getUserList(query)
    this.userLoading = false
  }

  close() {
    this.localShow = false
  }

  validateServing(rule: string, value: {}, cb: (msg?: string) => void) {
    if (!Object.keys(this.serving).length) {
      cb('不能为空')
    } else {
      cb()
    }
  }

  validateReceiver(rule: string, value: {}, cb: (msg?: string) => void) {
    if (!this.receiver.length) {
      cb('不能为空')
    } else {
      cb()
    }
  }

  @Watch('receiver')
  handleReceiver() {
    if (this.receiver.length > 2) {
      this.receiver.length = 2
    }
    this.form.receiver = this.receiver.join()
  }

  @Watch('serving')
  handleServingId() {
    this.form.servingId = (this.serving as any).id
    this.form.type = (this.serving as any).type
  }

  async submitModal() {
    await (this.$refs.form as any).validate()
    const templateId = this.$route.params.templateId
    this.form.templateId = Number(templateId)

    if (this.isAdd) {
      await DetailStore.addServing(this.form)
    } else {
      await DetailStore.modifyReceiver(
        (this.editData as AlarmServingTemplateMappingVo).id,
        this.form
      )
    }

    await DetailStore.getTemplate(templateId)
    this.close()
  }

  async init() {
    if (!this.isAdd && this.editData) {
      this.receiver = this.editData.receiver.split(',')
      this.form.type = this.editData.type
      this.form.servingId = this.editData.servingId
    } else {
      await DetailStore.getServingList(this.servingType)
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