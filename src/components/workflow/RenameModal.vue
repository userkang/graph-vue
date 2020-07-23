<template>
  <dmc-modal
    class="schedule-modal"
    v-model="show"
    @close="close"
    mask-closable
    title="重命名"
    width="600px"
    minHeight="550px"
    destroy-on-close
    @open="init"
  >
    <mtd-form ref="form" :rules="rules" :model="{nodeLabel}">
      <mtd-loading :loading="nodeTaskNameInfoLoading" class="modal-loading-mask">
        <div v-if="oldName" :class="['base-item', isRenamingTask && 'task']">
          <p class="item-title">现{{labelText[type]}}：</p>
          <p class="item-value" style="white-space: nowrap">{{oldName}}</p>
        </div>
        <div :class="['base-item', isRenamingTask && 'task']">
          <p class="item-title">新{{labelText[type]}}：</p>
          <mtd-form-item prop="nodeLabel">
            <mtd-input
              v-model="nodeLabel"
              :genre="!isRenamingTask ? 'line' : ''"
              type="text"
              :placeholder="`输入新${labelText[type]}`"
            >
              <template v-if="nodeTaskNameInfo" slot="prepend">{{nodeTaskNameInfo.namePrefix}}</template>
            </mtd-input>
          </mtd-form-item>
        </div>
      </mtd-loading>
    </mtd-form>

    <div slot="footer">
      <mtd-button @click="close">取消</mtd-button>
      <mtd-button :loading="isLoading" type="primary" @click="rename">确定</mtd-button>
    </div>
  </dmc-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import { ActiveNodeBaseInfoStore } from '@/stores/workflow/graphVisual/activeNode'
import { GraphRequestStore } from '@/stores/workflow/graphVisual/GraphContent'
import {
  NodeCopyStore,
  NodeGroupStore
} from '@/stores/workflow/graphVisual/GraphVisual'
import { cloneDeep } from 'lodash'
import { Form } from '@ss/mtd-vue/types/form'

type NodeDetail = Workflow.WorkflowNodeVo | Workflow.WorkflowNodeGroupVo

@Component
export default class RenameModal extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private visible!: boolean

  @Prop({
    type: Number,
    default: 0
  })
  private workflowId!: number

  @Prop(Object)
  private nodeDetail!: NodeDetail

  @Prop({
    default: ''
  })
  private type!: 'node' | 'copy' | 'group'

  private nodeLabel = ''
  private isLoading = false
  private labelText = {
    node: '节点名',
    copy: '任务名',
    group: '节点组名'
  }
  private nodeTaskNameInfo: Workflow.ToolTaskNameVo | null = null
  private nodeTaskNameInfoLoading = false
  private rules = {
    nodeLabel: [
      {
        required: true,
        message: '请输入用户名'
      },
      {
        validator: (
          rule: any,
          value: string,
          callback: (e?: Error) => void
        ) => {
          if (/^[a-zA-Z0-9_.-]+$/.test(value)) {
            return callback()
          }
          return callback(new Error('任务名只能为字母，数字，下划线，中划线'))
        }
      }
    ]
  }

  get isRenamingTask() {
    return (
      this.type === 'copy' &&
      // MLP即afo节点比较特殊，它在进行复制任务的时候，不需要像XT/MSP那样去拉取名称前缀
      (this.nodeDetail as Workflow.WorkflowNodeVo).categoryType !== 'MLP'
    )
  }

  get oldName() {
    switch (this.type) {
      case 'group':
        return (this.nodeDetail as Workflow.WorkflowNodeGroupVo).nodeGroupName
      case 'node':
        return (this.nodeDetail as Workflow.WorkflowNodeVo).nodeName
      case 'copy':
        return this.nodeTaskNameInfo?.oldName
    }
  }

  private get show() {
    return this.visible
  }

  private set show(v: boolean) {
    if (!v) {
      this.$emit('update:visible', v)
      this.$nextTick(() => {
        this.nodeTaskNameInfo = null
      })
    }
  }

  @Watch('visible')
  async onNodeDetailChange(visible: boolean) {
    if (!visible || !this.isRenamingTask) {
      return
    }
    this.nodeTaskNameInfoLoading = true
    try {
      const nameInfo = await NodeCopyStore.getNodeTaskNameInfo({
        workflowId: this.workflowId,
        nodeId: this.nodeDetail.id
      })
      this.nodeTaskNameInfo = nameInfo
    } finally {
      this.nodeTaskNameInfoLoading = false
    }
  }

  private init() {
    this.nodeLabel = ''
  }

  private close() {
    this.show = false
  }

  private async nodeRename() {
    await ActiveNodeBaseInfoStore.updateBaseInfo(
      {
        workflowId: String(this.workflowId),
        nodeId: String(this.nodeDetail.id)
      },
      { nodeName: this.nodeLabel }
    )
    this.close()
  }

  private nodeCopy() {
    ;(this.$refs.form as Form).validate(async valid => {
      if (valid) {
        const nodeDetail = this.nodeDetail as Workflow.WorkflowNodeVo
        // 只有XT任务需要带上前缀
        const taskName =
          nodeDetail.categoryType === 'XT'
            ? `${this.nodeTaskNameInfo!.namePrefix}${this.nodeLabel}`
            : this.nodeLabel

        await NodeCopyStore.updateNode({
          workflowId: this.workflowId,
          nodeId: this.nodeDetail.id,
          taskName
        })
        this.close()
      }
    })
  }

  private async nodeGroupRename() {
    await NodeGroupStore.rename({
      workflowId: this.workflowId,
      nodeGroupId: this.nodeDetail.id,
      nodeGroupName: this.nodeLabel
    })
    this.close()
  }

  private async rename() {
    try {
      this.isLoading = true
      switch (this.type) {
        case 'node':
          await this.nodeRename()
          break
        case 'copy':
          await this.nodeCopy()
          break
        case 'group':
          await this.nodeGroupRename()
          break
      }
    } finally {
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-loading-mask {
  ::v-deep {
    .mtd-loading-blur {
      opacity: 0 !important;
    }
  }
}
.base-item {
  margin-bottom: 20px;
  &.task {
    ::v-deep {
      .mtd-form-item {
        display: inline-block;
        vertical-align: baseline;
        margin-bottom: 0;
        .mtd-form-item-error-tip {
          position: absolute; // 因为没有用form-item的label，为了避免baseline对齐，导致”新任务名“错位的问题
        }
        .mtd-form-item-content {
          margin-left: 0 !important;
        }
      }
      .mtd-input-group {
        width: auto;
        display: inline-table;
      }
    }
  }
}
.base-item:last-child {
  margin-bottom: 0;
}
.item-title {
  display: inline;
  margin-right: 10px;
}
.name-input {
  width: 200px;
  ::v-deep .mtd-input {
    border-left: none;
    border-top: none;
    border-right: none;
    border-radius: 0;
  }
}
.item-value {
  width: 200px;
  display: inline-block;
  color: #2c2c2c;
  font-weight: bold;
  text-align: left;
}
</style>