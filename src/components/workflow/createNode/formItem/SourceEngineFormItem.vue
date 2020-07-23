<template>
  <mtd-form-item
    required
    label="数据来源"
    prop="sourceEngine"
    :rules="ruleCustom"
  >
    <mtd-select
      v-model="formCustom.sourceEngine"
      :placeholder="ruleMessage"
      class="form-item-sub-content"
      @change="handleEngineChange"
    >
      <mtd-option
        v-for="item in dataSourceEngine"
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

import { ISelectOptionItem, IMapItem } from '@/types/createNode'

@Component
export default class SourceEngineFormItem extends Vue {
  @Prop({
    type: Object,
    default: () => ({
      sourceEngine: ''
    })
  })
  private formCustom!: IMapItem

  private ruleMessage: string = '请选择数据来源'

  private ruleCustom = { required: true, message: this.ruleMessage }

  private dataEngineStoreState = DataEngineStore.state

  get dataSourceEngine() {
    return this.dataEngineStoreState.source
  }

  private handleEngineChange(val: string) {
    DataEngineStore.getTargetEngine(val)
  }
}
</script>

<style lang="scss" scoped></style>
