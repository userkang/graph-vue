<template>
  <div class="edit">
    <MtdInput
      v-model.trim="op"
      v-show="isEdit"
      @keyup.enter="addOp"
      size="small"
      ref="opInput"
      placeholder="回车确定"
      style="width: 600px"
      class="mb10"
    />

    <div v-for="(op, i) in localList" :key="i + op" class="mb10">
      <mtd-tag :closeable="isEdit" @close="removeOp(i)">{{ op }}</mtd-tag>
    </div>
    <i
      v-show="!isEdit"
      @click="toggleEdit"
      class="iconfont icon-Dashboard-mingchengbianji edit-icon mt10"
    ></i>
    <div class="edit-footer" v-show="isEdit">
      <MtdButton size="small" class="edit-footer-confirm" @click="handleSubmit">完成</MtdButton>
      <MtdButton size="small" @click="handleCancel">取消</MtdButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mb10 {
  margin-bottom: 10px;
}
.edit {
  &-icon {
    display: inline-block;
    font-size: 14px;
    color: #606be1;
    cursor: pointer;
  }
  &-footer {
    margin-top: 10px;
    &-confirm {
      margin-right: 10px;
    }
  }
}

.mtd-tag {
  max-width: 900px;
  height: auto;
}
.mtd-tag ::v-deep.mtd-tag-content {
  white-space: normal;
  text-align: left;
}
</style>


<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import { ChackFileStore } from '../../stores/editItem/EditOp'

@Component({})
export default class EditOp extends Vue {
  @Prop({
    type: Boolean,
    default: true
  })
  private isEdit!: boolean
  @Prop({
    type: Array,
    required: true
  })
  private list!: string[]

  private op = ''
  private localList = cloneDeep(this.list)

  @Watch('list')
  private handleListChange(val: string[]) {
    this.localList = cloneDeep(val)
  }

  private async addOp() {
    if (this.op) {
      const isPass = await ChackFileStore.request({ customedFile: this.op })
      if (isPass) {
        this.localList.push(this.op)
        this.op = ''
      }
    }
  }

  private removeOp(i: number) {
    this.localList.splice(i, 1)
  }

  private handleAddClick() {
    this.$nextTick(() => {
      ;(this.$refs.opInput as HTMLInputElement).focus()
    })
  }

  private handleSubmit() {
    this.toggleEdit()
    this.$emit('list-change', cloneDeep(this.localList))
  }

  private handleCancel() {
    this.localList = cloneDeep(this.list)
    this.toggleEdit()
  }

  private toggleEdit() {
    this.$emit('update:isEdit', !this.isEdit)
  }
}
</script>
