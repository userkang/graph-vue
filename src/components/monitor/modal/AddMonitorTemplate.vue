<template>
  <mtd-modal v-model="localShow" title="新建监控">
    <mtd-form :model="form" :rules="rules" ref="form" :label-width="120">
      <mtd-form-item label="监控模版名" prop="name" required>
        <mtd-input placeholder="中文字符、字母、数字、下划线" v-model="form.name" style="width: 300px;"></mtd-input>
      </mtd-form-item>
      <mtd-form-item label="描述" prop="description">
        <mtd-textarea
          placeholder="仅限50个字符"
          v-model="form.description"
          rows="3"
          style="width: 300px;"
        />
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
import { TemplateStore } from '@/stores/monitor/template'

@Component({
  components: {}
})
export default class AddMonitorTemplate extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  show = false

  get localShow() {
    return this.show
  }

  set localShow(v: boolean) {
    ;(this.$refs.form as any).resetFields()
    this.$emit('update:show', v)
  }

  form = {
    name: '',
    description: ''
  }

  rules = {
    name: {
      required: true,
      validator: this.validatorName
    },
    description: {
      max: 50,
      message: '不能大于50字符'
    }
  }

  validatorName(rule: string, value: string, cb: (msg?: string) => void) {
    if (!value) {
      cb('不能为空')
    } else if (!/^[\u4e00-\u9fa5A-Za-z0-9_]+$/.test(value)) {
      cb('含有非法字符')
    } else {
      cb()
    }
  }

  close() {
    this.localShow = false
  }

  async submitModal() {
    await (this.$refs.form as any).validate()
    await TemplateStore.addTemplate(this.form)
    this.$emit('refresh')
    this.close()
  }
}
</script>