<template>
  <div>
    <mtd-modal v-model="show" @close="closePreview" mask-closable title="预览数据" width="1200px">
      <mtd-loading :loading="isLoading"></mtd-loading>
    <div v-show="!isLoading">
      <p v-if="allNumber" style="margin-bottom:5px">数据总行数：{{allNumber}}</p>
      <mtd-table class='previewTable' :data="previewTableData" height='500px'>
        <mtd-table-column
          v-for="(item, index) in header"
          :key="index"
          :prop="item"
          :label="item"
          :title="item"
          >
          <template slot="header" slot-scope="header">
            <span :title="header.column.label">{{header.column.label}}</span>
          </template>
          <template slot-scope="scope">
            <span :title="scope.row[item]">{{scope.row[item]}}</span>
          </template>
        </mtd-table-column>
      </mtd-table>
    </div>
    <div slot='footer' class="demo-modal-footer">
      <mtd-button type='primary' @click="closePreview">关闭</mtd-button>
    </div>
  </mtd-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import { dataPreviewListStore } from '@/stores/graph/graphVisual/DataPreviewList'

@Component
export default class DataPreviewModel extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private isShowPreview!: boolean

  @Prop(Number)
  private nodeId!: number

  @Prop(Number)
  private graphId!: number

  @Prop(Number)
  private slotIndex!: number

  private dataPreviewData = dataPreviewListStore.state

  private get isLoading() {
    return this.dataPreviewData.loading
  }

  private get show() {
    return this.isShowPreview
  }
  private set show(v: boolean) {
    this.$emit('close-preview-data')
  }

  private get allNumber() {
    return this.dataPreviewData.data.allNumber
  }

  private get header() {
    return this.dataPreviewData.data.fields
  }
  private get previewTableData() {
    return this.dataPreviewData.data.content
  }

  private closePreview() {
    dataPreviewListStore.clear()
    this.$emit('close-preview-data')
  }
  private async created() {
    await dataPreviewListStore.getDataPreviewList(
      this.graphId,
      this.nodeId,
      this.slotIndex
    )
    // this.isLoading = false;
  }
}
</script>

<style lang="scss" scoped>
.previewTable {
  ::v-deep .mtd-table-cell {
    white-space: nowrap;
    line-height: 16px !important;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>