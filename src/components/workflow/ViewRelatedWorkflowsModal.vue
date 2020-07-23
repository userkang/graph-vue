<template>
  <CommonModal v-if="visible" width="900px" title="查看关联的工作流" @close="handleClose">
    <mtd-table
      class="table"
      :data="RelatedWorkflowsState.relatedWorkflows"
      :loading="RelatedWorkflowsState.loading"
      :sort-order.sync="orderData"
    >
      <mtd-table-column label="工作流名称">
        <template slot-scope="{ row }">
          <a
            :href="`#/workflow/${row.id}?name=${row.workflowName}`"
            target="_blank"
            style="text-decoration: none"
          >{{row.workflowName}}</a>
        </template>
      </mtd-table-column>
      <mtd-table-column label="负责人" prop="owner" sortable></mtd-table-column>
      <mtd-table-column label="所在目录" prop="groupName" sortable></mtd-table-column>
      <mtd-table-column label="创建时间" prop="createTime"></mtd-table-column>
      <mtd-table-column label="更新时间" prop="updateTime"></mtd-table-column>
    </mtd-table>
    <div class="handle-panel">
      <MtdButton class="submit-btn" @click="handleClose">确定</MtdButton>
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
import {
  GraphRequestStore,
  RelatedWorkflowsStore
} from '@/stores/workflow/graphVisual/GraphContent'
import { ActiveNodeExtraInfoStore } from '../../stores/workflow/graphVisual/activeNode'

@Component({
  components: {
    CommonModal
  }
})
export default class CantorTaskManageModal extends Vue {
  RelatedWorkflowsState = RelatedWorkflowsStore.state
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

  private orderData = {}

  @Watch('visible')
  onVisibleChange(val: boolean) {
    if (val) {
      RelatedWorkflowsStore.getRelatedWorkflows(this.nodeId)
    }
  }

  handleClose() {
    this.$emit('update:visible', false)
  }
}
</script>