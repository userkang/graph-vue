<template>
  <mtd-form-item required label="任务名称" prop="jobName" :rules="ruleCustom">
    <mtd-input
      v-model="formCustom.jobName"
      :placeholder="ruleMessage"
      class="form-item-sub-content"
    />
  </mtd-form-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IMapItem } from '@/types/createNode'

@Component
export default class XtJobNameFromItem extends Vue {
  @Prop({
    type: Object,
    default: () => ({
      jobName: ''
    })
  })
  private formCustom!: IMapItem

  private ruleMessage: string = '请输入任务名称'

  private ruleCustom = [
    {
      required: true,
      message: this.ruleMessage
    },
    {
      validator: (rule: any, value: string, callback: (e?: Error) => void) => {
        if (/^[a-zA-Z0-9_.-]+$/.test(value)) {
          return callback()
        }
        return callback(new Error('任务名只能为字母，数字，下划线，中划线'))
      }
    }
  ]
}
</script>

<style lang="scss" scoped></style>
