<template>
  <dmc-modal
    v-model="localShow"
    :title="title"
    placement="center"
    width="550px"
    @open="init"
    @ok="submit"
    @cancel="cancel"
    :okButtonLoading="btnLoading"
  >
    <mtd-form ref="formModel" :model="formModel" :label-width="110" :rules="rules">
      <mtd-form-item label="工作流名称" required prop="workflowName">
        <mtd-input type="text" :style="{width: '350px'}" v-model="formModel.workflowName" />
      </mtd-form-item>
      <mtd-form-item label="负责人" required prop="owner">
        <MisSelect :width="350" v-model="formModel.owner" />
      </mtd-form-item>
      <mtd-form-item label="描述信息" prop="workflowDesc">
        <mtd-textarea
          placeholder="请输入工作流描述信息"
          v-model="formModel.workflowDesc"
          rows="3"
          style="width: 350px"
        />
      </mtd-form-item>
    </mtd-form>
  </dmc-modal>
</template>

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

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import { ProjectListStore } from '@/stores/workflow/ProjectList'
import { ProjectMenuStore } from '@/stores/workflow/ProjectMenu'
import MisSelect from '@/components/MisSelect.vue'
import { UserStore } from '@/stores/common'
import { SwitchGraphController } from '@/stores/workflow/graphVisual/SwitchGraph'
import { ComponentListStore } from '@/stores/workflow/graphVisual/ComponentList'

const titleConfig: { [key: string]: string } = {
  create: '新建',
  rename: '编辑'
}

@Component({
  components: { CommonModal, MisSelect }
})
export default class CreateWrokflowModal extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  visible!: boolean

  @Prop({
    type: String,
    default: 'create'
  })
  private modalType!: string

  @Prop()
  private data!: Workflow.WorkflowBasicVo

  @Prop()
  private groupId!: string

  private isShow = true
  private name = ''
  private desc = ''
  private error = ''
  private isNameInvalid = false
  private menuTipsState = ProjectMenuStore.state
  private projectListState = ProjectListStore.state
  private graphComponentState = ComponentListStore.state
  private userState = UserStore.state
  private formModel = {
    groupId: '',
    workflowName: '',
    workflowDesc: '',
    owner: ''
  }
  private btnLoading = false

  get localShow() {
    return this.visible
  }

  set localShow(v: boolean) {
    this.$emit('update:visible', v)
  }

  get projectList() {
    return this.projectListState.list
  }

  get menuTipsValue() {
    return this.menuTipsState.value
  }

  get title() {
    return titleConfig[this.modalType] + '工作流'
  }

  private cancel() {
    this.localShow = false
  }

  private init() {
    if (this.modalType === 'rename') {
      this.$nextTick(() => {
        this.formModel = {
          groupId: this.data.groupId as string,
          workflowName: this.data.workflowName,
          workflowDesc: this.data.workflowDesc,
          owner: this.data.owner
        }
      })
    } else {
      if (this.groupId) {
        this.formModel.groupId = this.groupId
      }
      this.formModel.owner = this.userState.value.misID
    }
  }

  get rules() {
    return {
      groupId: this.requireStr(),
      workflowName: this.requireStr(),
      owner: this.requireStr()
    }
  }

  private requireStr() {
    return [
      {
        required: true,
        message: '不能为空'
      }
    ]
  }

  validate() {
    return new Promise((resovle, reject) => {
      return (this.$refs.formModel as HTMLFormElement).validate(
        (v: boolean) => {
          v ? resovle(v) : reject(v)
        }
      )
    }).catch(e => {
      // tslint:disable-next-line
    })
  }

  private async submit() {
    const value = await this.validate()

    this.btnLoading = true
    if (value) {
      try {
        let res
        if (this.modalType === 'rename') {
          res = await ProjectListStore.updateWorkflow({
            ...this.formModel,
            workflowId: this.data.id
          })
        } else {
          res = await ProjectListStore.addWorkflow(this.formModel)
        }

        await SwitchGraphController.set({
          workflowId: res.id,
          name: res.name
        })

        this.cancel()
        this.graphComponentState.tabValue = 'component'
        this.btnLoading = false
      } catch (e) {
        this.btnLoading = false
      }
    }
  }
}
</script>
