<template>
  <mtd-form-item
    required
    label="目标数据"
    prop="destEngine"
    :rules="ruleCustom"
  >
    <mtd-select
      v-model="formCustom.destEngine"
      :placeholder="ruleMessage"
      class="form-item-sub-content"
      @change="handleChange"
    >
      <mtd-option
        v-for="item in dataTargetEngine"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </mtd-select>
  </mtd-form-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DataEngineStore } from '@/stores/workflow/createNode/dataEngine'
import { SyncTypeNoticeStore } from '@/stores/workflow/createNode/syncTypeNotice'
import { IMapItem } from '@/types/createNode'

@Component
export default class TargetEngineFormItem extends Vue {
  @Prop({
    type: Object,
    default: () => ({
      destEngine: ''
    })
  })
  private formCustom!: IMapItem

  private ruleMessage: string = '请选择目标数据'

  private ruleCustom = { required: true, message: this.ruleMessage }

  private dataEngineStoreState = DataEngineStore.state

  get dataTargetEngine() {
    return this.dataEngineStoreState.target
  }

  private handleChange(val: string) {
    SyncTypeNoticeStore.getTypeNotice(this.formCustom.sourceEngine + '2' + val)
  }
}
</script>

<style lang="scss" scoped></style>
