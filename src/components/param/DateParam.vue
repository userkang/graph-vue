<template>
  <MtdDatePicker
    v-model="localValue"
    placement="bottom-end"
    size="small"
    type="daterange"
    placeholder="选择时间"
    :disabled="disabled"
    @input="handleValueChange"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { parseTime } from '../../common/utils'

@Component
export default class DateParam extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private value!: string

  @Prop({
    type: Boolean,
    required: true
  })
  private disabled!: boolean

  private localValue: Date[] = []

  private isDateChange(value: Array<Date | string>): boolean | string {
    const isAllEmpty = value.every(item => item === '')
    if (isAllEmpty) {
      return false
    }
    const dateString = (value as Date[]).map(item => parseTime(item)).join(',')
    return dateString !== this.value ? dateString : false
  }

  private transformStringToDate(value: string) {
    this.localValue = value
      .split(',')
      .map(item => item.trim())
      .filter(item => !!item)
      .map(item => Date.parse(item))
      .map(item => new Date(item))
  }

  private handleValueChange(value: Array<string | Date>) {
    const dateString = this.isDateChange(value)
    if (dateString) {
      this.$emit('input', dateString)
    }
  }

  private mounted() {
    this.transformStringToDate(this.value)
  }

  @Watch('value')
  private watchValue(value: string) {
    if (value) {
      this.transformStringToDate(value)
    }
  }
}
</script>
