<template>
  <CommonModal v-if="true" :title="title" placement="center" width="530px" @close="cancel">
    <div class="modal-wrap">
      <div class="modal-left">
        <label style="margin-bottom: 40px">
          <i>*</i>实验名称
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

    <div class="handle-panel has-top">
      <mtd-button class="common-btn submit-btn" @click="submit">{{submitBtnText}}</mtd-button>
      <mtd-button class="common-btn cancel-btn" @click="cancel" style="margin-right: 10px">取消</mtd-button>
    </div>
  </CommonModal>
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
@Component({
  components: { CommonModal }
})
export default class GraphModal extends Vue {
  @Prop({
    type: String,
    // copy/create
    default: 'copy'
  })
  private modalType!: string
  private isShow = true
  private name = ''
  private desc = ''
  private error = ' 名称不能为空'
  private isNameInvalid = false

  get title() {
    return this.modalType === 'copy' ? '复制' : '创建实验'
  }

  get submitBtnText() {
    return this.modalType === 'copy' ? '复制' : '创建'
  }

  private cancel() {
    this.$emit('cancel')
  }

  private submit() {
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
    this.$emit('submit', {
      name: this.name,
      desc: this.desc
    })
  }

  private handleNameChange() {
    this.isNameInvalid = false
  }
}
</script>
