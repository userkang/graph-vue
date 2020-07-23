<template>
  <div>
    <mtd-modal
      v-model="show"
      @close="closePreview"
      mask-closable
      title="选择字段"
      :width="570"
      height="598px"
    >
      <mtd-loading :loading="isLoading"></mtd-loading>
      <div v-show="!isLoading">
        <div class="item-wrap" v-for="(item, index) in fielList" :key="index">
          <div class="head-wrap">
            <p class="field-name">{{item.fieldType}}</p>
            <mtd-checkbox
              v-if="!isSingleSelection"
              :checked="item.isSelectAll"
              @input="selectAll($event,index)"
              class="right-all"
            >全选</mtd-checkbox>
          </div>

          <div class="field-list">
            <draggable
              :list="item.fields"
              v-bind="dragOptions"
              ghost-class="ghost"
              @start="drag = true"
              @end="drag = false"
            >
              <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                <li
                  :title="field.name"
                  @click="handleChangeFieldStatus(index, fieldIndex)"
                  v-for="(field, fieldIndex) in item.fields"
                  class="field drag"
                  :class="{'field-selected': field.choosed }"
                  :key="field.name"
                >{{field.name}}</li>
              </transition-group>
            </draggable>
          </div>
        </div>
      </div>
      <div slot="footer" class="demo-modal-footer">
        <span v-if="!isLoading && !isSingleSelection" class="selected-number">
          已选择
          <b>{{totalNumber}}</b>项
        </span>
        <mtd-button @click="closePreview">关闭</mtd-button>
        <mtd-button :loading="isSubmitLoading" type="primary" @click="submitField">确认</mtd-button>
      </div>
    </mtd-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import draggable from 'vuedraggable'
import CommonModal from '@/components/CommonModal.vue'
import { FieldListStore } from '@/stores/graph/graphVisual/GraphVisual'
import { FieldSubmitItemVo } from '@/types/graph'

@Component({
  components: {
    draggable
  }
})
export default class SelectFielModel extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private isShowSelectFieldModel!: boolean

  @Prop(Number)
  private nodeId!: number

  @Prop(Number)
  private graphId!: number

  @Prop(Boolean)
  private isSingleSelection!: boolean

  @Prop(Number)
  private paramId!: number

  private fieldListStoreState = FieldListStore.state

  private isSubmitLoading = false

  private drag = false

  private get isLoading() {
    return this.fieldListStoreState.loading
  }

  private get show() {
    return this.isShowSelectFieldModel
  }
  private set show(v: boolean) {
    this.$emit('close-select-field')
  }

  private get dragOptions() {
    return {
      animation: 200,
      group: 'description',
      disabled: false,
      ghostClass: 'ghost'
    }
  }

  private get totalNumber() {
    let sum = 0
    this.fielList.forEach(item => {
      item.fields.forEach(fieldItem => {
        if (fieldItem.choosed) {
          ++sum
        }
      })
    })
    return sum
  }

  private get fielList() {
    const data = this.fieldListStoreState.data
    data.forEach(item => {
      item.isSelectAll = item.fields.every(field => {
        return field.choosed === true
      })
    })
    return data
  }

  private closePreview() {
    FieldListStore.clear()
    this.$emit('close-select-field')
  }
  private async submitField() {
    const submitData: FieldSubmitItemVo[] = []
    this.fielList.forEach(item => {
      const nodeType: string = item.fieldType
      item.fields.forEach(fieldItem => {
        if (fieldItem.choosed) {
          submitData.push({
            fieldName: fieldItem.name,
            fieldType: nodeType
          })
        }
      })
    })
    this.isSubmitLoading = true
    await FieldListStore.submit(
      this.graphId,
      this.nodeId,
      this.paramId,
      submitData
    )
    this.isSubmitLoading = false
    this.closePreview()
  }
  private selectAll(value: boolean, index: number) {
    const data = this.fieldListStoreState.data
    const dataList = data[index]
    dataList.fields.forEach(item => {
      item.choosed = value
    })
  }
  private handleChangeFieldStatus(index: number, fieldIndex: number) {
    const dataList = this.fielList[index]
    // 单选
    if (this.isSingleSelection) {
      if (dataList.fields[fieldIndex].choosed) {
        dataList.fields[fieldIndex].choosed = false
      } else {
        this.fielList.forEach(item => {
          item.fields.forEach(fieldItem => {
            fieldItem.choosed = false
          })
        })
        dataList.fields[fieldIndex].choosed = true
      }
    } else {
      // 多选
      dataList.fields[fieldIndex].choosed = !dataList.fields[fieldIndex].choosed
    }
  }
  private async created() {
    await FieldListStore.request(this.graphId, this.nodeId, this.paramId)
  }
}
</script>

<style lang="scss" scoped>
.field-name {
  color: #141414;
  font-weight: bold;
  margin-bottom: 15px;
}
.head-wrap {
  overflow: hidden;
  .field-name {
    float: left;
  }
  .right-all {
    float: right;
  }
}
.field-list {
  overflow: hidden;
}
.field {
  float: left;
  width: 88px;
  height: 34px;
  line-height: 34px;
  border: 1px solid #dfe3e8;
  color: #2b2b2b;
  text-align: center;
  margin-right: 12px;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  .selected-log {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
  }
}
.drag {
  cursor: move;
  background: #fff;
}
.ghost {
  opacity: 0.5;
}
.field-selected {
  @extend .field;
  border-color: #4e73ff;
  background: rgba(78, 115, 255, 0.2);
  .selected-log {
    display: inline-block;
  }
}
div.field:nth-child(5n) {
  margin-right: 0px;
}
.selected-number {
  float: left;
  color: #878787;
  font-size: 13px;
  b {
    color: #1f1f1f;
    margin-left: 5px;
    margin-right: 5px;
  }
}
</style>