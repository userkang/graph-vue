<template>
  <mtd-form-item required label="Git仓库" prop="repos" :rules="ruleCustom">
    <mtd-input
      v-model="formCustom.repos"
      class="form-item-sub-content"
      :placeholder="ruleMessage"
    />
  </mtd-form-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IMapItem } from '@/types/createNode'

@Component
export default class GitReposFormItem extends Vue {
  @Prop({
    type: Object,
    default: () => ({
      repos: ''
    })
  })
  private formCustom!: IMapItem

  private ruleMessage: string = '请输入git仓库地址'

  private ruleCustom = { required: true, message: this.ruleMessage }
}
</script>

<style lang="scss" scoped></style>
