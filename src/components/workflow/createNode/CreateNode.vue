<template>
  <MtdModal
    v-model="localVisible"
    :mount-on-create="false"
    title="新建节点"
    placement="center"
    width="540px"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <component :is="renderTarget" ref="createNodeFormRef" :ready.sync="formReady"></component>
    <div slot="footer" class="modal-footer-wrapper">
      <MtdButton @click="handleClose">取消</MtdButton>
      <MtdButton
        @click="handleSubmit"
        type="primary"
        :loading="isSubmiting"
        :disabled="!formReady"
      >创建</MtdButton>
    </div>
  </MtdModal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Mixins } from 'vue-property-decorator'

import { ToolTaskXtStore } from '@/stores/workflow/createNode/toolTaskXt'
import { ToolTaskMspStore } from '@/stores/workflow/createNode/toolTaskMsp'
import { ToolTaskMlpStore } from '@/stores/workflow/createNode/toolTaskMlp'
import { GraphRequestStore } from '@/stores/workflow/graphVisual/GraphContent'

import MLPForm from './form/MLPForm.vue'
import MSPForm from './form/MSPForm.vue'
import XTForm from './form/XTForm.vue'
import { NodeInfoMixin } from './mixins'
import { transRef2VueInstance } from '@/types/util'
import { ValidatableForm } from './interfaces'

@Component({
  components: {
    MLPForm,
    MSPForm,
    XTForm
  }
})
export default class CreateNode extends Mixins(NodeInfoMixin) {
  @Prop({
    type: Boolean,
    default: () => true
  })
  private visible!: boolean

  private isSubmiting: boolean = false

  private formReady = true

  get localVisible() {
    return this.visible
  }

  set localVisible(visible: boolean) {
    if (!visible) {
      this.$emit('update:visible', visible)
    }
  }

  get renderTarget() {
    // TODO:由于这个bug，这里暂时先写死 https://github.com/vuejs/vue-class-component/issues/407
    switch (this.NodeInfoMixin__toolType) {
      case 'MSP':
        return 'MSPForm' // name默认是class名字
      case 'XT':
        return 'XTForm'
      case 'MLP':
      default:
        return 'MLPForm'
    }
  }

  /**
   * 以类型安全的方式创建节点
   */
  async safelyCreateNode(createNodeFormRef: any) {
    const workflowInfo = {
      workflowId: this.NodeInfoMixin__workflowId,
      nodeId: this.NodeInfoMixin__nodeId
    }

    if (this.isMSPForm(createNodeFormRef)) {
      // 创建msp节点
      const postData = await createNodeFormRef.validate()
      return ToolTaskMspStore.createNode(workflowInfo, postData)
    } else if (this.isXTForm(createNodeFormRef)) {
      // 创建xt节点
      const postData = await createNodeFormRef.validate()
      return ToolTaskXtStore.createNode(workflowInfo, postData)
    } else if (this.isMLPForm(createNodeFormRef)) {
      // 创建afo节点
      const postData = await createNodeFormRef.validate()
      return ToolTaskMlpStore.createNode(workflowInfo, postData)
    }
  }

  async handleSubmit() {
    const createNodeFormRef = this.$refs.createNodeFormRef
    try {
      this.isSubmiting = true
      const res = await this.safelyCreateNode(createNodeFormRef)
      this.isSubmiting = false
      this.handleClose()
      GraphRequestStore.request(Number(this.NodeInfoMixin__workflowId))

      const taskUrl = res?.value?.taskUrl
      const openNewTab = ['XT', 'MSP'].includes(this.NodeInfoMixin__toolType)
      const pathParams = {
        workflowId: this.NodeInfoMixin__workflowId,
        nodeId: this.NodeInfoMixin__nodeId
      }
      this.$emit('createNode')
      if (openNewTab) {
        if (taskUrl) {
          window.open(taskUrl)
        }
      } else {
        this.$router.push({
          name: 'nodeDevelopDetail',
          params: pathParams,
          query: {
            // 用来从目标页面再跳回来
            from: this.$route.query.name,
            fromWorkflow: pathParams.workflowId
          }
        })
      }
    } catch (error) {
      if (error) {
        console.error(error)
      }
    } finally {
      this.isSubmiting = false
    }
  }

  handleClose() {
    this.localVisible = false
    this.formReady = true // 关闭窗口后，重置formReady状态
  }

  // Type guards

  isMLPForm(ref: ValidatableForm): ref is MLPForm {
    return ref.componentName === 'MLPForm'
  }

  isMSPForm(ref: ValidatableForm): ref is MSPForm {
    return ref.componentName === 'MSPForm'
  }

  isXTForm(ref: ValidatableForm): ref is XTForm {
    return ref.componentName === 'XTForm'
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
