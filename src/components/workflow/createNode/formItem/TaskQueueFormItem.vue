<template>
  <mtd-form-item required label="运行队列" prop="queue" :rules="ruleCustom">
    <mtd-select
      v-model="formCustom.queue"
      :placeholder="ruleMessage"
      class="form-item-sub-content"
    >
      <mtd-option
        v-for="item in runTaskQueue"
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
import { TaskQueueStore } from '@/stores/workflow/createNode/taskQueue'

@Component
export default class TaskQueueFromItem extends Vue {
  @Prop({
    type: Object,
    default: () => ({
      queue: ''
    })
  })
  private formCustom!: IMapItem

  private ruleMessage: string = '请选择任务执行队列'

  private ruleCustom = { required: true, message: this.ruleMessage }

  private taskQueueStoreState = TaskQueueStore.state

  get runTaskQueue() {
    return this.taskQueueStoreState.value.taskQueue
  }
}
</script>

<style lang="scss" scoped></style>
