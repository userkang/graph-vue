<template>
  <mtd-form-item required label="节点名称" prop="nodeName" :rules="ruleCustom">
    <mtd-input
      v-model="formCustom.nodeName"
      :placeholder="ruleMessage"
      class="form-item-sub-content"
    />
  </mtd-form-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class NodeNameFormItem extends Vue {
  @Prop({
    type: Object,
    default: () => ({
      nodeName: ''
    })
  })
  private formCustom!: object

  private ruleMessage: string = '请输入节点名称'

  private ruleCustom: object = { required: true, message: this.ruleMessage }
}
</script>

<style lang="scss" scoped></style>
