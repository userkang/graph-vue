<template>
  <mtd-form-item required label="任务关联" prop="createType">
    <mtd-radio-group @input="change" v-model="formCustom.createType">
      <mtd-radio
        v-for="item in nodeCreateTypeList"
        :value="item.value"
        :key="item.value"
      >{{ item.label }}</mtd-radio>
    </mtd-radio-group>
  </mtd-form-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ISelectOptionItem, IMapItem } from '@/types/createNode'

@Component
export default class CreateTypeFromItem extends Vue {
  @Prop({
    type: Object,
    default: () => ({
      createType: 'relate'
    })
  })
  private formCustom!: IMapItem

  private nodeCreateTypeList: ISelectOptionItem[] = [
    {
      label: '关联已有任务',
      value: 'relate'
    },
    {
      label: '新建任务',
      value: 'create'
    }
  ]

  private change() {
    this.$emit('change')
  }
}
</script>

<style lang="scss" scoped></style>
