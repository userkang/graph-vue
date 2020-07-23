<template>
  <div>
    <mtd-modal
      v-model="show"
      @close="closePreview"
      mask-closable
      class="modal-setting"
      title="探查报告"
      width="1200px"
    >
      <mtd-loading :loading="isLoading"></mtd-loading>
      <mtd-table
        v-show="!isLoading"
        height="600px"
        class="expandsTable"
        :data="describeTableData"
        :row-key="getRowKeys"
        :expandable="expandable"
        :expand-row-keys="expands"
      >
        <mtd-table-column label="字段名称" prop="columnName"></mtd-table-column>
        <mtd-table-column label="数据类型" prop="dataType">
          <template slot-scope="scope">
            <span>{{scope.row.dataType === 1 ? '连续值' : '离散值'}}</span>
          </template>
        </mtd-table-column>

        <mtd-table-column label="缺失比例" prop="missRate">
          <template slot-scope="scope">
            <span>{{scope.row.missCount ? `≈${scope.row.missRate.toFixed(3) * 100}` : scope.row.missRate * 100}}%({{scope.row.missCount}})</span>
          </template>
        </mtd-table-column>

        <mtd-table-column label="不同的值" prop="distinct"></mtd-table-column>

        <mtd-table-column label="平均值" prop="mean">
          <template slot-scope="scope">
            <span>{{ (scope.row.mean === +scope.row.mean) ? (scope.row.mean).toFixed(3) : scope.row.mean}}</span>
          </template>
        </mtd-table-column>

        <mtd-table-column label="标准差" prop="stddev">
          <template slot-scope="scope">
            <span>{{(scope.row.stddev === +scope.row.stddev) ? (scope.row.stddev).toFixed(3) : scope.row.stddev}}</span>
          </template>
        </mtd-table-column>

        <mtd-table-column label="与目标相关性" prop="correlation">
          <template slot-scope="scope">
            <span>{{(scope.row.correlation === +scope.row.correlation) ? (scope.row.correlation).toFixed(3) : scope.row.correlation}}</span>
          </template>
        </mtd-table-column>

        <mtd-table-column label="互信息" prop="mutualInformation">
          <template slot-scope="scope">
            <span>{{(scope.row.mutualInformation === +scope.row.mutualInformation) ? (scope.row.mutualInformation).toFixed(3) : scope.row.mutualInformation}}</span>
          </template>
        </mtd-table-column>

        <mtd-table-column label="gini" prop="gini">
          <template slot-scope="scope">
            <span>{{(scope.row.gini === +scope.row.gini) ? (scope.row.gini).toFixed(3) : scope.row.gini}}</span>
          </template>
        </mtd-table-column>

        <mtd-table-column label="信息增益" prop="gain">
          <template slot-scope="scope">
            <span>{{(scope.row.gain === +scope.row.gain) ? (scope.row.gain).toFixed(3) : scope.row.gain}}</span>
          </template>
        </mtd-table-column>

        <mtd-table-column class="select-wrap" type="expand" label="查看分布">
          <template slot-scope="props">
            <NodeDescribeChart
              :chartType="props.row.chart"
              :pieData="props.row.distributionRing"
              :barData="props.row.distributionHistogram"
            />
          </template>
        </mtd-table-column>
      </mtd-table>

      <div slot="footer" class="demo-modal-footer">
        <mtd-button type="primary" @click="closePreview">关闭</mtd-button>
      </div>
    </mtd-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import NodeDescribeChart from './NodeDescribeChart.vue'
import { nodeDescribeStore } from '@/stores/graph/graphVisual/GraphVisual'
import { DescribeVo } from '@/types/graph'

@Component({
  components: {
    NodeDescribeChart
  }
})
export default class SelectFieldModel extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private isShowNodeDescribeModel!: boolean

  @Prop(Number)
  private nodeId!: number

  @Prop(Number)
  private graphId!: number

  private nodeDescribeData = nodeDescribeStore.state

  private get isLoading() {
    return this.nodeDescribeData.loading
  }

  private get show() {
    return this.isShowNodeDescribeModel
  }
  private set show(v: boolean) {
    this.$emit('close-node-describe')
  }

  private expands: [] = []

  private get describeTableData() {
    return this.nodeDescribeData.list
  }

  private getRowKeys(row: DescribeVo) {
    return row.columnName
  }
  private expandable(row: DescribeVo, index: number) {
    return index >= 0
  }
  private getData(row: DescribeVo, index: number) {
    return []
  }

  private closePreview() {
    this.$emit('close-node-describe')
  }
  private async created() {
    await nodeDescribeStore.getNodeDescribe(this.graphId, this.nodeId)
  }
}
</script>

<style lang="scss" scoped>
.modal-setting {
  ::v-deep .mtd-modal-content-wrapper {
    overflow: scroll;
  }
}
.expandsTable {
  overflow: scroll;
  ::v-deep .mtd-table-body-wrapper {
    overflow: scroll;
  }
  // ::v-deep .mtd-table-row {
  //   td:last-child {
  //     padding:0;
  //     .mtd-table-cell {

  //     }
  //   }
  // }
}
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
  border-radius: 4px;
  color: #2b2b2b;
  text-align: center;
  margin-right: 12px;
  margin-bottom: 12px;
  position: relative;
  cursor: pointer;
  .selected-log {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
  }
  // &:hover {
  //   background: rgba(7,163,90,0.1);
  //   border-color: #07A35A;
  // }
}
.field-selected {
  @extend .field;
  background: rgba(7, 163, 90, 0.1);
  border-color: #07a35a;
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
.select-wrap {
  color: red !important;
}
</style>