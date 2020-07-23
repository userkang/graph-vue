<template>
  <div class="edit-item-wrap">
    <span v-if="!isEdit">{{text}}</span>
    <slot v-else />
    <i class="iconfont icon-Dashboard-mingchengbianji" @click="changeEdit" v-if="!isEdit"></i>
    <template v-else>
      <template v-if="buttonType === 'icon'">
        <i class="mtdicon mtdicon-close-thick" @click="handleCancel"></i>
        <i class="mtdicon mtdicon-check-thick" @click="handleSubmit"></i>
      </template>
      <template v-else>
        <MtdButton size="small" class="submit-btn" style="margin: 0 12px" @click="handleSubmit">完成</MtdButton>
        <MtdButton size="small" class="cancel-btn" @click="handleCancel">取消</MtdButton>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.edit-item-wrap {
  .iconfont,
  .mtdicon {
    font-size: 14px;
    color: #606be1;
    cursor: pointer;
    margin-left: 10px;
  }
  .mtdicon {
    font-size: 16px;
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class EditItem extends Vue {
  @Prop({
    required: true
  })
  private text!: string

  @Prop({
    default: 'normal'
  })
  private buttonType!: string

  private isEdit = false

  private changeEdit() {
    this.isEdit = !this.isEdit
  }

  private handleCancel() {
    this.$emit('cancel')
    this.changeEdit()
  }

  private handleSubmit() {
    this.$emit('submit')
    this.changeEdit()
  }
}
</script>
