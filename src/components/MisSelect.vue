<template>
  <mtd-select
    :loading="userLoading"
    filterable
    remote
    multiple
    :debounce="300"
    :remote-method="getUserList"
    v-model="modelValue"
    :style="`width: ${width}px`"
    placeholder="输入mis号搜索"
  >
    <mtd-option v-for="item in userList" :value="item" :key="item" :label="item"></mtd-option>
  </mtd-select>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { DetailStore } from '@/stores/monitor/detail'

@Component({
  components: {}
})
export default class MisSelect extends Vue {
  @Prop({
    type: Number,
    default: 350
  })
  width!: number

  @Prop({ type: String })
  value!: string

  detailState = DetailStore.state
  receiver: string[] = []
  userLoading = false

  get modelValue() {
    return this.value.split(',').filter(Boolean)
  }

  set modelValue(val: string[]) {
    this.$emit('input', val.join(','))
  }

  get userList() {
    return this.detailState.userList
  }

  async getUserList(query: string) {
    this.userLoading = true
    await DetailStore.getUserList(query)
    this.userLoading = false
  }
}
</script>