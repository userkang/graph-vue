<template>
  <dmc-modal
    v-model="localVisible"
    title="工作流自动扩充"
    width="680px"
    destroy-on-close
    @close="handleClose"
  >
    <mtd-form
      ref="autoExtendForm"
      :model="formCustom"
      :label-width="130"
      :rules="ruleCustom"
    >
      <mtd-form-item
        required
        label="任务类型"
        prop="taskType"
      >
        <mtd-checkbox-group v-model="formCustom.taskType">
          <mtd-checkbox
            v-for="item in taskTypeList"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}</mtd-checkbox>
        </mtd-checkbox-group>
      </mtd-form-item>
      <mtd-form-item>
        <mtd-button
          class="mr8"
          @click="handleSelectAll(true)"
        >全选</mtd-button>
        <mtd-button @click="handleSelectAll(false)">全不选</mtd-button>
      </mtd-form-item>
      <mtd-form-item
        label="向上扩充层级"
        required
        prop="upLevel"
      >
        <mtd-input-number
          v-model="formCustom.upLevel"
          :max="maxCount"
          :min="minCount"
        />
      </mtd-form-item>
      <mtd-form-item
        label="向下扩充层级"
        required
        prop="downLevel"
      >
        <mtd-input-number
          v-model="formCustom.downLevel"
          :max="maxCount"
          :min="minCount"
        />
      </mtd-form-item>
    </mtd-form>

    <div
      slot="footer"
      class="modal-footer-wrapper"
    >
      <mtd-button @click="handleClose">取消</mtd-button>
      <mtd-button
        @click="handleSubmit"
        type="primary"
        :loading="isSubmiting"
      >扩充</mtd-button>
    </div>
  </dmc-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { AutoExtendStore } from '@/stores/workflow/graphVisual/autoExtend'
import { GraphRequestStore } from '@/stores/workflow/graphVisual/GraphContent'

@Component
export default class AutoExtendModal extends Vue {
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

  private isSubmiting: boolean = false

  private maxCount: number = 5

  private minCount: number = 0

  private selectedTaskType: string[] = []

  private ruleCustom = {
    taskType: [
      {
        required: true,
        validator: this.validateTaskType
      }
    ],
    upLevel: [{ required: true, validator: this.validateLevel }],
    downLevel: [{ required: true, validator: this.validateLevel }]
  }

  private formCustom: any = {
    taskType: [],
    upLevel: 3,
    downLevel: 3
  }

  private taskTypeList = [
    {
      label: '协同工具（XT）：离线任务',
      value: 'XT_OFFLINE_TASK'
    },
    {
      label: '协同工具（XT）：同步任务',
      value: 'XT_SYNC_TASK'
    },
    {
      label: '托管平台：MapReduce任务',
      value: 'MSP_MR'
    },
    {
      label: '托管平台：spark任务',
      value: 'MSP_PY_SPARK'
    },
    {
      label: '托管平台：pyspark任务',
      value: 'MSP_SCALA_SPARK'
    },
    {
      label: '机器学习平台：AFO作业',
      value: 'AFO_TOOL_TASK'
    }
  ]

  get localVisible() {
    return this.visible
  }

  set localVisible(v: boolean) {
    if (!v) {
      this.$emit('update:visible', v)
    }
  }

  private validateTaskType(
    rule: string,
    value: string[],
    callback: (msg?: string) => void
  ) {
    if (!value || (value && value.length === 0)) {
      callback('请选择任务类型')
    }
    callback()
  }

  private validateLevel(
    rule: string,
    value: number,
    callback: (msg?: string) => void
  ) {
    if (value > this.maxCount || value < this.minCount) {
      callback('扩充层级范围在3-5')
    }
    callback()
  }

  private handleSelectAll(v: boolean) {
    if (v) {
      this.formCustom.taskType = this.taskTypeList.map(
        (item: any) => item.value
      )
    } else {
      this.formCustom.taskType = []
    }
  }

  private handleClose() {
    this.localVisible = false
  }

  validate() {
    return new Promise((resovle, reject) => {
      return (this.$refs.autoExtendForm as HTMLFormElement).validate(
        (v: boolean) => {
          v ? resovle(v) : reject(v)
        }
      )
    }).catch(e => {
      // tslint:disable-next-line
      console.log(e)
    })
  }

  private async handleSubmit() {
    const passed = await this.validate()
    if (passed) {
      this.isSubmiting = true
      await AutoExtendStore.workflowExtend(
        {
          workflowId: this.workflowId + '',
          nodeId: this.nodeId + ''
        },
        {
          upstream: this.formCustom.upLevel,
          downstream: this.formCustom.downLevel,
          taskType: this.formCustom.taskType
        }
      )
      this.isSubmiting = false
      this.handleClose()
      await GraphRequestStore.request(this.workflowId)
    }
  }
}
</script>

<style lang="scss" scoped>
.mr8 {
  margin-right: 8px;
}
</style>
