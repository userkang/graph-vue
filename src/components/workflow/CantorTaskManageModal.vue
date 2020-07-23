<template>
  <CommonModal v-if="visible" width="900px" title="切换调度任务" @close="handleClose">
    <mtd-table
      class="table"
      :data="CantorTasksState.cantorTasks"
      :loading="CantorTasksState.loading"
      :selection="selection"
      @select="handleSelect"
    >
      <mtd-table-column type="selection" :width="60"></mtd-table-column>
      <mtd-table-column label="调度名称" prop="cantorName" :width="350"></mtd-table-column>
      <mtd-table-column label="创建时间" prop="createTime"></mtd-table-column>
      <mtd-table-column label="创建人" prop="creator"></mtd-table-column>
    </mtd-table>
    <div class="handle-panel">
      <MtdButton
        class="submit-btn"
        @click="handleConfirm"
        :disabled="!currentSelection"
        :loading="CantorTasksState.postLoading"
      >确定</MtdButton>
      <MtdButton class="cancel-btn gap" @click="handleClose">取消</MtdButton>
    </div>
  </CommonModal>
</template>

<style lang="scss" scoped>
.table {
  margin-bottom: 20px;
  ::v-deep {
    th.mtd-table-column-selection .mtd-checkbox {
      display: none;
    }
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { CantorTasksStore } from '@/stores/workflow/graphVisual/cantorTasks'
import CommonModal from '@/components/CommonModal.vue'
import { GraphRequestStore } from '@/stores/workflow/graphVisual/GraphContent'
import { ActiveNodeExtraInfoStore } from '../../stores/workflow/graphVisual/activeNode'
import eventBus from '@/common/bus'

@Component({
  components: {
    CommonModal
  }
})
export default class CantorTaskManageModal extends Vue {
  CantorTasksState = CantorTasksStore.state
  currentSelection?: Workflow.MspCantorTaskVo | null = null

  @Prop({
    type: Number,
    default: () => 0
  })
  private workflowId!: number

  @Prop({
    type: Number,
    default: () => 0
  })
  private nodeId!: number

  @Prop({
    type: Boolean,
    default: () => false
  })
  private visible!: boolean

  get selection() {
    // 写成filter形式ts检测有问题
    return this.currentSelection ? [this.currentSelection] : []
  }

  @Watch('CantorTasksState.cantorTasks', { immediate: true })
  onCantorTasksChange(val: Workflow.MspCantorTaskVo[]) {
    if (val.length) {
      // cantorTask中可能会有已经关联的调度，体现在status字段
      this.currentSelection = val.filter(v => !!v.status)?.pop()
    }
  }

  @Watch('visible')
  onVisibleChange(val: boolean) {
    if (val) {
      CantorTasksStore.update(this.workflowId, this.nodeId)
    }
  }

  handleClose() {
    this.$emit('update:visible', false)
  }

  async handleConfirm() {
    if (!this.currentSelection) {
      return
    }
    const cantorName = this.currentSelection.cantorName
    try {
      await CantorTasksStore.postMspChangeCantorTask(
        this.workflowId,
        this.nodeId,
        cantorName
      )
      this.$mtd.message({
        type: 'success',
        message: '切换关联调度任务成功'
      })
      this.handleClose()
      GraphRequestStore.request(this.workflowId)
      eventBus.$emit('refresh-form-panel')
    } catch (error) {
      console.error(error)
    }
  }

  handleSelect(selections: Workflow.MspCantorTaskVo[]) {
    this.currentSelection = selections[selections.length - 1]
  }
}
</script>