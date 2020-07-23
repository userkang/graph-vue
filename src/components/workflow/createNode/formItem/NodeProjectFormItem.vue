<template>
  <mtd-form-item required label="项目组" prop="nodeProject" :rules="ruleCustom">
    <mtd-select
      v-model="formCustom.nodeProject"
      :placeholder="ruleMessage"
      class="form-item-sub-content"
      @change="getTaskList"
    >
      <mtd-option
        v-for="item in projectList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </mtd-select>
  </mtd-form-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IMapItem } from '@/types/createNode'
import { ProjectListStore } from '@/stores/graph/GraphList'
import { TaskQueueStore } from '@/stores/workflow/createNode/taskQueue'

@Component
export default class NodeProjectFromItem extends Vue {
  @Prop({
    type: Object,
    default: () => ({
      nodeProject: ''
    })
  })
  private formCustom!: IMapItem

  private ruleMessage: string = '请选择项目组'

  private ruleCustom = { required: true, message: this.ruleMessage }

  private projectListStoreState = ProjectListStore.state

  get projectList() {
    return this.projectListStoreState.value.map((item: any) => {
      return {
        label: item.name,
        value: item.name // String(item.id)
      }
    })
  }

  getTaskList() {
    this.$emit('change')
    if (this.formCustom.toolType === 'MSP') {
      TaskQueueStore.getTaskQueue(this.formCustom.nodeProject)
    }
  }
}
</script>

<style lang="scss" scoped></style>
