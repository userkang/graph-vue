<template>
  <div class="param-wrap">
    <div class="param-title">
      <i class="slide"></i>
      <i
        class="iconfont icon-daohangxialasanjiao fold-param-icon"
        :class="{ 'fold-status': isFold }"
        @click="changeFold"
      ></i>
      <h4 class="comp-name">基础信息</h4>
    </div>
    <section class="param-content" v-show="!isFold">
      <label class="param-item-label">节点类型</label>
      <span class="content-item">{{ activeNodeBaseInfo.componentName }}</span>
      <label class="param-item-label">节点名称</label>
      <mtd-input
        v-focus="nameEdit"
        size="small"
        v-if="nameEdit"
        v-model="localName"
        placeholder="请输入节点名称"
        @blur="handleNodeInfoChange('name')"
        class="workflow-basic-info-edit"
      ></mtd-input>
      <template v-else>
        <span class="content-item">{{ activeNodeBaseInfo.nodeName }}</span>
        <i class="iconfont icon-Dashboard-mingchengbianji" @click="handleNodeInfoEdit('name')"></i>
      </template>

      <label class="param-item-label">功能描述</label>
      <mtd-textarea
        v-focus="descEdit"
        v-if="descEdit"
        style="width: 100%"
        v-model="localDesc"
        rows="6"
        placeholder="输入功能描述"
        @blur="handleNodeInfoChange('desc')"
        class="workflow-basic-info-edit"
      />
      <template v-else>
        <span class="label-text content-item">{{ activeNodeBaseInfo.desc }}</span>
        <i class="iconfont icon-Dashboard-mingchengbianji" @click="handleNodeInfoEdit('desc')"></i>
      </template>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
  IBaseInfo,
  ActiveNodeBaseInfoStore,
  IbaseInfoUpdatePayload
} from '@/stores/workflow/graphVisual/activeNode'
@Component({
  directives: {
    focus: (el, binding) => {
      if (binding.value) {
        setTimeout(() => {
          if (el.querySelector('input')) {
            ;(el.querySelector('input') as HTMLElement).focus()
          }
          if (el.nodeName === 'TEXTAREA') {
            ;(el as HTMLElement).focus()
          }
        }, 0)
      }
    }
  }
})
export default class NodeBaseInfo extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private workflowId!: string

  @Prop({
    type: String,
    required: true
  })
  private nodeId!: string

  private isFold = false

  private nameEdit: boolean = false

  private localName: string = ''

  private descEdit: boolean = false

  private localDesc: string = ''

  private activeNodeBaseInfoState = ActiveNodeBaseInfoStore.state

  get activeNodeBaseInfo() {
    return this.activeNodeBaseInfoState.value
  }

  private changeFold() {
    this.isFold = !this.isFold
  }

  private async handleNodeInfoChange(val: string) {
    const payload: IbaseInfoUpdatePayload = {}
    switch (val) {
      case 'name':
        payload.nodeName = this.localName
        break
      case 'desc':
        payload.nodeDesc = this.localDesc
        break
    }
    ;(this as any)[val + 'Edit'] = false
    await ActiveNodeBaseInfoStore.updateBaseInfo(
      {
        workflowId: this.workflowId,
        nodeId: this.nodeId
      },
      payload
    )
    // 更新state数据
    ActiveNodeBaseInfoStore.set({
      ...this.activeNodeBaseInfo,
      ...payload
    })
  }

  private async handleNodeInfoEdit(val: string) {
    switch (val) {
      case 'name':
        this.localName = this.activeNodeBaseInfo.nodeName
        break
      case 'desc':
        this.localDesc = this.activeNodeBaseInfo.desc
        break
    }
    ;(this as any)[val + 'Edit'] = true
  }
}
</script>

<style lang="scss" scoped>
.param-content {
  font-size: 12px;
  .icon-Dashboard-mingchengbianji {
    font-size: 14px;
    color: #606be1;
    cursor: pointer;
    margin-left: 10px;
  }
}
.workflow-basic-info-edit {
  width: 100%;
}

.content-item {
  margin-bottom: 8px;
  word-break: break-all;
}
</style>
