<template>
  <dmc-modal
    v-model="localShow"
    :title="title"
    placement="center"
    width="530px"
    @open="init"
    @close="cancel"
    @ok="submit"
    @cancel="cancel"
    :okButtonLoading="btnLoading"
  >
    <div class="modal-wrap">
      <div class="modal-left">
        <label style="margin-bottom: 40px">
          <i>*</i>目录名称
        </label>
        <label>备注</label>
      </div>
      <div class="modal-main">
        <mtd-input
          v-model="name"
          style="width: 270px;"
          :invalid="isNameInvalid"
          @input="handleNameChange"
          placeholder="中文字符、字母、数字、_"
        />
        <label v-if="isNameInvalid">{{error}}</label>
        <mtd-textarea
          v-model="desc"
          style="width: 270px;margin-top: 26px;"
          rows="3"
          maxlength="50"
        />
      </div>
    </div>
  </dmc-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import { ProjectListStore } from '@/stores/workflow/ProjectList'
import {
  ProjectMenuStore,
  MenuTipsPayload
} from '@/stores/workflow/ProjectMenu'

const titleConfig: { [key: string]: string } = {
  create: '新建',
  rename: '编辑'
}

@Component({
  components: { CommonModal }
})
export default class CreateProjectModal extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  visible!: boolean

  @Prop({
    type: String,
    // rename/create
    default: 'create'
  })
  private modalType!: string

  @Prop()
  private data!: Workflow.WorkflowGroupVo

  @Prop()
  private biz!: string[]

  @Prop()
  private groupId!: string

  private name = ''
  private desc = ''
  private error = ''
  private isNameInvalid = false
  private menuTipsState = ProjectMenuStore.state
  private btnLoading = false

  get menuTipsValue() {
    return this.menuTipsState.value
  }

  get localShow() {
    return this.visible
  }

  set localShow(v: boolean) {
    this.$emit('update:visible', v)
  }

  get title() {
    return titleConfig[this.modalType] + '目录'
  }

  private cancel() {
    this.localShow = false
  }

  private init() {
    if (this.modalType === 'rename') {
      this.name = this.data.groupName
      this.desc = this.data.groupDesc
    }
  }

  private async submit() {
    this.name = this.name.trim()
    if (!this.name) {
      this.error = '名称不能为空'
      this.isNameInvalid = true
      return
    }
    if (this.name.length > 30) {
      this.error = '名称最多为30个字符'
      this.isNameInvalid = true
      return
    }
    if (!/^[\u4e00-\u9fa5A-Za-z0-9_]+$/.test(this.name)) {
      this.error = '含有非法字符'
      this.isNameInvalid = true
      return
    }
    this.handleNameChange()

    try {
      this.btnLoading = true
      if (this.modalType === 'rename') {
        await ProjectListStore.updateProject({
          workflowGroupId: this.data.id,
          groupName: this.name,
          groupDesc: this.desc
        })
      } else {
        await ProjectListStore.addProject({
          bizLine: this.biz[0],
          bizSubject: this.biz[1],
          parentGroupId: this.groupId,
          groupName: this.name,
          groupDesc: this.desc
        })
      }
      this.btnLoading = false
      this.cancel()
    } catch (e) {
      this.btnLoading = false
    }
  }

  private handleNameChange() {
    this.isNameInvalid = false
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
