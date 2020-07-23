<template>
  <mtd-modal
    class="schedule-modal"
    v-model="show"
    @close="close"
    mask-closable
    title="重命名"
    width="520px"
    minHeight="550px"
  >
    <div class="base-item">
      <p class="item-title">现节点名：</p>
      <p class="item-value">{{nodeDetail.nodeLabel}}</p>
    </div>

    <div class="base-item">
      <p class="item-title">新节点名：</p>
      <mtd-input class="name-input" v-model="nodeLabel" type="text" placeholder="输入新节点名"></mtd-input>
    </div>

    <div slot="footer" class="demo-modal-footer">
      <mtd-button @click="close">取消</mtd-button>
      <mtd-button :loading="isLoading" type="primary" @click="rename">确定</mtd-button>
    </div>
  </mtd-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import { NodeUpdateStore } from '@/stores/graph/graphVisual/GraphVisual'
import { GraphRequestStore } from '@/stores/graph/graphVisual/GraphContent'
import { NodeVoType } from '@/types/graph'
import { cloneDeep } from 'lodash'

@Component
export default class RenameModal extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private isShowRename!: boolean

  @Prop(Object)
  private nodeDetail!: NodeVoType

  @Prop(Number)
  private execId!: number

  @Prop(Number)
  private graphId!: number

  private nodeLabel: string = ''
  private isLoading: boolean = false

  private get show() {
    return this.isShowRename
  }
  private set show(v: boolean) {
    this.$emit('close-schedule')
  }

  private close() {
    this.$emit('close-rename')
  }

  private async rename() {
    this.isLoading = true
    const newNodeDetail = cloneDeep(this.nodeDetail)
    newNodeDetail.nodeLabel = this.nodeLabel
    await NodeUpdateStore.updateNode(this.nodeDetail.nodeId, newNodeDetail)
    this.isLoading = false
    this.close()
  }
}
</script>

<style lang="scss" scoped>
.base-item {
  margin-bottom: 20px;
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