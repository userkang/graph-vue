<template>
  <mtd-form-item required label="main函数" prop="mainFunc" :rules="ruleCustom">
    <mtd-input
      v-model="formCustom.mainFunc"
      :placeholder="ruleMessage"
      class="form-item-sub-content"
    />
  </mtd-form-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IMapItem } from '@/types/createNode'

@Component
export default class MainFuncFormItem extends Vue {
  @Prop({
    type: Object,
    default: () => ({
      mainFunc: ''
    })
  })
  private formCustom!: IMapItem

  private ruleMessage: string = '请指定main函数'

  private ruleCustom = { required: true, message: this.ruleMessage }
}
</script>

<style lang="scss" scoped></style>
