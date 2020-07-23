<template>
  <mtd-form-item required label="功能描述" prop="nodeDesc" :rules="ruleCustom">
    <mtd-textarea
      class="form-item-sub-content"
      :placeholder="ruleMessage"
      v-model="formCustom.nodeDesc"
      rows="3"
    />
  </mtd-form-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IMapItem } from '@/types/createNode'

@Component
export default class NodeDescFromItem extends Vue {
  @Prop({
    type: Object,
    default: () => ({
      nodeDesc: ''
    })
  })
  private formCustom!: IMapItem

  private ruleMessage: string = '请输入业务功能和描述信息'

  private ruleCustom = { required: true, message: this.ruleMessage }
}
</script>

<style lang="scss" scoped></style>
