<template>
  <mtd-form-item required label="节点类型" prop="nodeType" :rules="ruleCustom">
    <mtd-select
      v-model="formCustom.nodeType"
      :placeholder="ruleMessage"
      class="form-item-sub-content"
      @change="handleChange"
    >
      <mtd-option
        v-for="item in nodeTypeList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </mtd-select>
  </mtd-form-item>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ISelectOptionItem, IMapItem } from '@/types/createNode'
import { ComponentListStore } from '@/stores/workflow/graphVisual/ComponentList'

@Component
export default class NodeTypeFromItem extends Vue {
  @Prop({
    type: String,
    default: ''
  })
  private toolType!: string

  @Prop({
    type: Object,
    default: () => ({
      jobNamePrefix: '',
      nodeType: ''
    })
  })
  private formCustom!: IMapItem

  private componentListState = ComponentListStore.state

  get nodeTypeList() {
    if (!this.componentListState.list.length) {
      return []
    }
    const list: Workflow.WorkflowComponentCategoryVo[] = this.componentListState.list.filter(
      item => {
        return item.categoryType === this.toolType
      }
    )

    if (!list.length) {
      return []
    }
    const newlist: ISelectOptionItem[] = list[0].components.map(item => {
      return {
        label: item.componentName,
        value: item.componentType
      }
    })
    return newlist
  }

  private ruleMessage: string = '请选择节点类型'

  private ruleCustom = { required: true, message: this.ruleMessage }

  handleChange() {
    this.$emit('change')
  }
}
</script>

<style lang="scss" scoped></style>
