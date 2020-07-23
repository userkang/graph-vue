<template>
  <ul class="form-panel-content">
    <li class="workflow-basic-info">
      <label>业务线:</label>
      <span class="basic-info-item-text">{{ workflowInfo.bizLineName }}</span>
    </li>
    <li class="workflow-basic-info">
      <label>业务分组:</label>
      <span class="basic-info-item-text">{{ workflowInfo.bizSubjectName }}</span>
    </li>
    <li class="workflow-basic-info">
      <label>目录名称:</label>
      <span class="basic-info-item-text">{{ workflowInfo.groupName }}</span>
    </li>
    <li class="workflow-basic-info">
      <label>工作流名称:</label>
      <mtd-input
        v-focus="nameEdit"
        size="small"
        v-if="nameEdit"
        v-model="localName"
        placeholder="请输入工作流名称"
        @blur="handleWorkflowChange('name')"
        class="workflow-basic-info-edit"
      ></mtd-input>
      <template v-else>
        <span class="basic-info-item-text">
          {{
          workflowInfo.workflowName
          }}
        </span>
        <i class="iconfont icon-Dashboard-mingchengbianji" @click="handleWorkflowEdit('name')"></i>
      </template>
    </li>
    <li class="workflow-basic-info" v-focus="ownerEdit">
      <label>负责人:</label>
      <mtd-select
        size="small"
        v-if="ownerEdit"
        filterable
        remote
        multiple
        class="workflow-basic-info-edit"
        :debounce="300"
        clearable
        :remote-method="getUserList"
        @blur="handleWorkflowChange('owner')"
        v-model="localOwner"
      >
        <mtd-option v-for="item in userList" :value="item" :key="item" :label="item"></mtd-option>
      </mtd-select>
      <template v-else>
        <span class="basic-info-item-text">{{ workflowInfo.owner }}</span>
        <i class="iconfont icon-Dashboard-mingchengbianji" @click="handleWorkflowEdit('owner')"></i>
      </template>
    </li>
    <li class="workflow-basic-info">
      <label>创建时间:</label>
      <span class="basic-info-item-text">{{ workflowInfo.createTime }}</span>
    </li>
    <li class="workflow-basic-info">
      <label>更新时间:</label>
      <span class="basic-info-item-text">{{ workflowInfo.updateTime }}</span>
    </li>
    <li class="workflow-basic-info" v-focus="descEdit">
      <label>描述信息:</label>
      <mtd-textarea
        v-if="descEdit"
        style="width: 100%"
        v-model="localDesc"
        rows="6"
        placeholder="输入描述信息"
        @blur="handleWorkflowChange('desc')"
        class="workflow-basic-info-edit"
      />
      <template v-else>
        <span class="basic-info-item-text">
          {{
          workflowInfo.workflowDesc
          }}
        </span>
        <i class="iconfont icon-Dashboard-mingchengbianji" @click="handleWorkflowEdit('desc')"></i>
      </template>
    </li>
  </ul>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
  IActiveWorkflowInfo,
  ActiveWorkflowStore,
  IUpdateWorkflowPayload
} from '@/stores/workflow/graphVisual/activeWorkflow'
import { DetailStore } from '@/stores/monitor/detail'

@Component({
  directives: {
    focus: (el, binding) => {
      if (binding.value) {
        setTimeout(() => {
          if (el.querySelector('input')) {
            ;(el.querySelector('input') as HTMLElement).focus()
          }
          if (el.querySelector('textarea')) {
            ;(el.querySelector('textarea') as HTMLElement).focus()
          }
        }, 0)
      }
    }
  }
})
export default class WorkflowInfo extends Vue {
  private localName: string = ''

  private nameEdit: boolean = false

  private localOwner: string[] = []

  private ownerEdit: boolean = false

  private localDesc: string = ''

  private descEdit: boolean = false

  private detailState = DetailStore.state
  private activeWorkflowState = ActiveWorkflowStore.state

  get workflowInfo() {
    return this.activeWorkflowState.value
  }

  private get userList() {
    return this.detailState.userList
  }

  private async getUserList(query: string) {
    await DetailStore.getUserList(query)
  }

  private async handleWorkflowChange(val: string) {
    const payload: IUpdateWorkflowPayload = {
      workflowId: this.workflowInfo.id,
      groupId: this.workflowInfo.groupId
    }
    if (!val) {
      ;(this as any)[val + 'Edit'] = false
      return
    }
    switch (val) {
      case 'name':
        payload.workflowName = this.localName
        break
      case 'owner':
        payload.owner = this.localOwner.join(',')
        break
      case 'desc':
        payload.workflowDesc = this.localDesc
        break
    }
    if (this.workflowInfo.id) {
      await ActiveWorkflowStore.update(payload)
      // 更新state数据
      ActiveWorkflowStore.set({
        ...this.workflowInfo,
        ...payload
      })
    }
    ;(this as any)[val + 'Edit'] = false
  }

  private handleWorkflowEdit(val: string) {
    ;(this as any)[val + 'Edit'] = true

    switch (val) {
      case 'name':
        this.localName = this.workflowInfo.workflowName
        break
      case 'owner':
        this.localOwner = this.workflowInfo.owner
          ? this.workflowInfo.owner.split(',')
          : []
        break
      case 'desc':
        this.localDesc = this.workflowInfo.workflowDesc
        break
    }
  }
}
</script>
<style lang="scss" scoped>
.form-panel-content {
  padding-top: 6px;
  overflow-x: hidden;
  overflow-y: auto;
  height: calc(100% - 34px);
  &::-webkit-scrollbar {
    background-color: transparent;
    width: 4px;
    visibility: hidden;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    width: 1px;
  }
}
.workflow-basic-info {
  text-align: left;
  font-size: 12px;
  margin-bottom: 10px;
  color: #2a2a2a;
  label {
    margin-right: 4px;
    color: #8a94c2;
  }
  .icon-Dashboard-mingchengbianji {
    font-size: 14px;
    color: #606be1;
    cursor: pointer;
    margin-left: 10px;
  }
  .mtd-textarea {
    color: #2a2a2a;
    font-size: 12px;
  }
  &-edit {
    width: 100%;
    margin-top: 6px;
  }
  .basic-info-item-text {
    display: inline-block;
    word-break: break-all;
    word-wrap: break-word;
  }
}
</style>
