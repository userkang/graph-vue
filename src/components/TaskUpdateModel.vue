<template>
  <CommonModal v-if="true" :title="title" placement="center" width="530px" @close="cancel">
    <MtdForm :model="taskForm">
      <MtdFormItem label="任务名" prop="userDef">
        <MtdInput readonly="true" v-model="taskForm.userDef" style="width: 300px" />
      </MtdFormItem>
      <MtdFormItem required label="调度类型" prop="planType">
        <MtdSelect v-model="taskForm.planType" style="width: 300px">
          <MtdOption
            v-for="planItem in taskPlanTypeList"
            :key="planItem.value"
            :value="planItem.value"
            :label="planItem.label"
          />
        </MtdSelect>
      </MtdFormItem>
      <MtdFormItem v-if="taskForm.planType === 0" label="就绪时间" prop="readyTime">
        <mtd-time-picker
          v-model="taskForm.readyTime"
          style="width: 300px"
          value-format="HH:mm"
          format="HH:mm"
        />
      </MtdFormItem>
      <MtdFormItem v-else label="crontab:" prop="crontabExpr">
        <MtdInput v-model="taskForm.crontabExpr" style="width: 300px" placeholder="crontab表达式" />
      </MtdFormItem>
      <MtdFormItem label="依赖任务名" prop="taskNames">
        <MtdInput
          v-model="taskForm.taskNames"
          style="width: 300px"
          placeholder="该调度任务依赖的任务，如果有多个，使用逗号分隔"
        />
      </MtdFormItem>
      <MtdFormItem label="备注" prop="comment">
        <MtdInput v-model="taskForm.comment" style="width: 300px" />
      </MtdFormItem>
      <MtdFormItem class="handle-panel">
        <MtdButton class="cancel-btn gap" @click="cancel">取消</MtdButton>
        <MtdButton class="submit-btn" @click="submit">提交</MtdButton>
      </MtdFormItem>
    </MtdForm>
  </CommonModal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import {
  planTypeList,
  defaultTaskMock,
  defaultTaskUpdateForm
} from '@/stores/graph/graphVisual/GraphVisual'

@Component({
  components: { CommonModal }
})
export default class TaskForm extends Vue {
  private taskForm = defaultTaskUpdateForm
  private taskPlanTypeList = planTypeList

  get title() {
    return '更新调度任务'
  }

  private cancel() {
    this.$emit('cancel')
  }

  private submit() {
    this.$emit('submit', this.taskForm)
  }
}
</script>

<style lang="scss" scoped>
$red-color: #ff6d7e;
.modal-wrap {
  display: flex;

  .modal-left {
    text-align: right;
    width: 80px;
    margin-right: 20px;

    label {
      display: block;
    }

    i {
      font-style: normal;
      color: $red-color;
    }
  }

  .modal-main {
    flex: 1;
    text-align: left;

    label {
      display: block;
      color: $red-color;
    }
  }
}
</style>
