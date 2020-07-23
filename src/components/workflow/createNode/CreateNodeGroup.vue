<template>
  <mtd-modal
    v-model="localVisible"
    title="创建节点组"
    placement="center"
    width="540px"
    destroy-on-close
    @close="handleClose"
  >
    <mtd-form
      ref="createNodeForm"
      :model="formCustom"
      class="modal-body-wrapper"
      :label-width="110"
    >
      <mtd-form-item required label="节点组名称" prop="nodeName" :rules="ruleCustom">
        <mtd-input
          v-model="formCustom.nodeName"
          :placeholder="ruleMessage"
          class="form-item-sub-content"
        />
      </mtd-form-item>
    </mtd-form>

    <div slot="footer" class="modal-footer-wrapper">
      <mtd-button @click="handleClose">取消</mtd-button>
      <mtd-button @click="handleSubmit" type="primary" :loading="isSubmiting">创建</mtd-button>
    </div>
  </mtd-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ActiveNodeStore } from '@/stores/workflow/graphVisual/activeNode'
import { NodeGroupStore } from '@/stores/workflow/graphVisual/GraphVisual'
import { ComponentListStore } from '@/stores/workflow/graphVisual/ComponentList'

@Component
export default class CreateNode extends Vue {
  @Prop({
    type: Boolean,
    default: () => true
  })
  private visible!: boolean

  @Prop()
  private workflowId!: number

  private isSubmiting = false

  private formCustom = {
    nodeName: ''
  }

  private ruleMessage: string = '请输入节点名称'

  private ruleCustom: object = { required: true, message: this.ruleMessage }

  private activeNodeState = ActiveNodeStore.state

  get nodes() {
    return this.activeNodeState.selectNodeIds
  }

  get localVisible() {
    return this.visible
  }

  set localVisible(v: boolean) {
    if (!v) {
      this.$emit('update:visible', v)
    }
  }

  private handleClose() {
    this.localVisible = false
  }

  validate() {
    return new Promise((resovle, reject) => {
      return (this.$refs.createNodeForm as HTMLFormElement).validate(
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

      await NodeGroupStore.createNodeGroup({
        workflowId: this.workflowId,
        nodeGroupName: this.formCustom.nodeName,
        nodes: this.nodes
      })

      this.isSubmiting = false
      this.handleClose()
      ComponentListStore.getComponentList()
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-body-wrapper {
  ::v-deep .form-item-sub-content {
    width: 360px;
  }
  ::v-deep .node-name-tips {
    display: block;
    color: #ff6459;
    margin-top: 6px;
    font-size: 12px;
    line-height: 16px;
  }
}
</style>
