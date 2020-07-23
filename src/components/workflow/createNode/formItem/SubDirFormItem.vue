<template>
  <mtd-form-item required label="Git子路径" prop="subDir" :rules="ruleCustom">
    <mtd-input
      v-model="formCustom.subDir"
      :placeholder="ruleMessage"
      class="form-item-sub-content"
    />
  </mtd-form-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IMapItem } from '@/types/createNode'

@Component
export default class SubDirFormItem extends Vue {
  @Prop({
    type: Object,
    default: () => ({
      subDir: ''
    })
  })
  private formCustom!: IMapItem

  private ruleMessage: string = '请输入脚本所在路径'

  private ruleCustom = { required: true, message: this.ruleMessage }
}
</script>

<style lang="scss" scoped></style>
