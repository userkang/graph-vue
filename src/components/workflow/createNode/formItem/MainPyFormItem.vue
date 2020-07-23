<template>
  <mtd-form-item required label="python文件" prop="mainPy" :rules="ruleCustom">
    <mtd-input
      v-model="formCustom.mainPy"
      :placeholder="ruleMessage"
      class="form-item-sub-content"
    />
  </mtd-form-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IMapItem } from '@/types/createNode'

@Component
export default class MainPyFormItem extends Vue {
  @Prop({
    type: Object,
    default: () => ({
      mainPy: ''
    })
  })
  private formCustom!: IMapItem

  private ruleMessage: string = '请指定main python文件基于git子路径的相对路径'

  private ruleCustom = { required: true, message: this.ruleMessage }
}
</script>

<style lang="scss" scoped></style>
