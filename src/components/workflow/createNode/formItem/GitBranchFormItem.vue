<template>
  <mtd-form-item required label="Git分支" prop="branch" :rules="ruleCustom">
    <mtd-input
      v-model="formCustom.branch"
      :placeholder="ruleMessage"
      class="form-item-sub-content"
    />
  </mtd-form-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IMapItem } from '@/types/createNode'
@Component
export default class GitBranchFormItem extends Vue {
  @Prop({
    type: Object,
    default: () => ({
      branch: ''
    })
  })
  private formCustom!: IMapItem

  private ruleMessage: string = '请指定分支'

  private ruleCustom = { required: true, message: this.ruleMessage }
}
</script>

<style lang="scss" scoped></style>
