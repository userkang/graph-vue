<template>
  <div ref='menubox'>
    <ul class="menu-tips" :style="{top: tips.y + 10 + 'px', left: tips.x + 10 + 'px'}">
      <li @click="handleDelete" :class="{'disabled': !canEditGraph }">
        <i class="iconfont-custom">&nbsp; &nbsp;</i>
        <i class="iconfont-custom">&#xe65e;</i>删除
      </li>
      <li @click="rename" class=''>
        <i class="iconfont-custom">&nbsp; &nbsp;</i>
        <i class="mtdicon mtdicon-edit"></i>重命名
      </li>
      <li @click="handleExec('EXEC_FROM')" :class="{'disabled': !dagActived}">
        <i class="iconfont-custom">&nbsp; &nbsp;</i>
        <i class="iconfont-custom">&#xe65b;</i>
        从此处执行
      </li>
      <li @click="handleExec('EXEC_TO')" :class="{'disabled': !dagActived}">
        <i class="iconfont-custom">&nbsp; &nbsp;</i>
        <i class="iconfont-custom">&#xe65c;</i>
        执行到此处
      </li>
      <li @click="handleExec('EXEC_SINGLE')" :class="{'disabled': !dagActived}">
        <i class="iconfont-custom">&nbsp; &nbsp;</i>
        <i class="iconfont-custom">&#xe65a;</i>执行该节点
      </li>
      <li>
        <i class="iconfont-custom">&nbsp; &nbsp;</i>
        <i class="iconfont-custom">&#xe659;</i>小数量运行
        <i class="iconfont-custom more-icon">&#xe64b;</i>
        <div class='menu-tips second-li'>
          <li @click="handleExec('SMALL_EXEC_ALL')" :class="{'disabled': !dagActived}">
            全部执行
          </li>
          <li @click="handleExec('SMALL_EXEC_FROM')" :class="{'disabled': !dagActived}">
            从此处执行
          </li>
          <li @click="handleExec('SMALL_EXEC_TO')" :class="{'disabled': !dagActived}">
            执行到此处
          </li>
          <li @click="handleExec('SMALL_EXEC_SINGLE')" :class="{'disabled': !dagActived}">
            执行该节点
          </li>
        </div>
      </li>
      <li v-if="isDataPreview">
        <i class="iconfont-custom">&nbsp; &nbsp;</i>
        <i class="iconfont-custom">&#xe65d;</i>
        预览数据
        <i class="iconfont-custom more-icon">&#xe64b;</i>
        <div class='menu-tips second-li'>
          <li @click="handleDataPreview(item.slotIndex)" v-for="(item, index) in outSlots" :key="index">
            输出桩{{item.slotIndex}}
          </li>
        </div>
      </li>
      <li @click="handleRegressionPreview" v-if="isRegressionEnable">
        <i class="iconfont-custom">&nbsp; &nbsp;</i>
        <i class="iconfont icon-jiqi-yulanshuju"></i>评估报告
      </li>
      <li @click="handleBinaryPreview" v-if="isBinaryEnable">
        <i class="iconfont-custom">&nbsp; &nbsp;</i>
        <i class="iconfont icon-jiqi-yulanshuju"></i>评估报告
      </li>
      <li @click="handledeNodeDescribePreview" v-if="isNodeDescribe">
        <i class="iconfont-custom">&nbsp; &nbsp;</i>
        <i class="iconfont icon-jiqi-yulanshuju"></i>探查报告
      </li>
      <li
        @click="handleLog"
        :class="{'disabled': !isLogEnable, 'slide-gap': tips.data.componentName !== 'MLXModelTraining' }"
      >
        <i class="iconfont-custom">&nbsp; &nbsp;</i>
        <i class="iconfont icon-jiqi-chakanrizhi"></i>查看日志
      </li>

      <li
        @click="lookUpMetric"
        v-if="tips.data.componentName === 'MLXModelTraining'"
        :class="{'disabled': !GraphNodeState.value.metricOperator }"
        class="slide-gap"
      >
        <i class="iconfont-custom">&nbsp; &nbsp;</i>
        <i class="iconfont icon-jiqixuexi-chakanzhibiao"></i>查看指标
        <mtd-loading v-if="GraphNodeState.loading" class="ml-loading" size="small" message></mtd-loading>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.menu-tips {
  width: 150px;
  // height: 136px;
  position: fixed;
  z-index: 999;
  background: #fff;
  box-shadow: 0 1px 4px 0 rgba(50, 57, 131, 0.25);
  border-radius: 1px;
  li {
    height: 34px;
    color: #666;
    font-size: 14px;
    line-height: 34px;
    cursor: pointer;
    text-align: left;
    .second-li {
      display: none;
      position: relative;
      left: 150px;
      top: -34px;
      padding-left: 12px;
    }
    &:hover {
      color: #333;
      background: #f2f3fa;
      .second-li {
        display: inline-block;
      }
    }
    &.disabled {
      cursor: not-allowed;
    }
    &.slide-gap {
      border-bottom: 1px solid #e8e9f2;
    }
    i {
      margin-right: 7px;
      font-size: 12px;
      color: #666;
    }
    .more-icon {
      float: right;
      transform: scale(0.8);
      color: #a6a6a6;
    }
  }
}
.ml-loading {
  display: inline-block;
  margin-left: 6px;
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import {
  DeleteNodeStore,
  ExecuteGraphStore,
  NodeLogStore
} from '../../stores/graph/graphVisual/GraphVisual'
import {
  MenuTipsController,
  MenuTipsPayload
} from '../../stores/graph/graphVisual/LocalState'
import {
  GraphRequestStore,
  GraphNodeStore
} from '../../stores/graph/graphVisual/GraphContent'
import { GraphMetricStore } from '../../stores/graph/graphVisual/GraphModelMetric'
import { GraphItemType } from '../../types/graph'

@Component({
  components: {}
})
export default class MenuTips extends Vue {
  @Prop({
    required: true
  })
  private tips!: MenuTipsPayload

  private GraphNodeState = GraphNodeStore.state

  get canEditGraph() {
    return (this.$store.state as any).isCurrentGraphCanBeEdit
  }

  get graphId() {
    return ((this.$store.state as any).activeGraphExec as GraphItemType).graphId
  }

  get execId() {
    return Number((this.$route.params as any).execId)
    // return ((this.$store.state as any).activeGraphExec as GraphItemType).execId
  }

  get dagActived() {
    return this.tips.isDagActived
  }

  get isNodeDescribe() {
    return (
      this.tips.data.componentName === 'Describe' &&
      this.tips.data.status === 60
    )
  }

  get isRegressionEnable() {
    return this.tips.data.componentName === 'RegressorEvaluator'
  }

  get isBinaryEnable() {
    return this.tips.data.componentName === 'BinaryClassifyEvaluator'
  }

  get isLogEnable() {
    return [30, 40, 60, 80].includes(this.tips.data.status)
  }

  get isExecuteEnable() {
    return [10, 40, 60, 80].includes(this.tips.data.status) && this.canEditGraph
  }

  get outSlots() {
    const outSlots = this.tips.data.outSlots
    if (!outSlots || !outSlots.length) {
      return []
    }
    return outSlots.filter(item => {
      return item.slotType === 'HIVE_TABLE'
    })
  }

  get isDataPreview() {
    return !!this.outSlots.length
  }

  private mounted() {
    GraphNodeStore.request({
      nodeId: this.tips.data.nodeId,
      graphId: this.graphId
    })
  }

  private beforeDestroy() {
    GraphNodeStore.reset()
  }

  private hideMenuTips() {
    MenuTipsController.hide()
  }

  private async handleDelete() {
    if (this.canEditGraph) {
      this.hideMenuTips()
      await DeleteNodeStore.request({
        graphId: this.graphId,
        nodeId: this.tips.data.nodeId
      })
    }
  }

  private rename() {
    this.$emit('show-rename',this.tips.data)
    this.hideMenuTips()
  }

  private handleDataPreview(slotIndex: number) {
    if (this.isDataPreview) {
      this.$emit(
        'show-data-preview',
        this.graphId,
        this.tips.data.nodeId,
        slotIndex
      )
      this.hideMenuTips()
    }
  }

  private handleRegressionPreview() {
    if (this.isRegressionEnable) {
      this.$emit('show-regression-preview', this.tips.data.nodeId)
      this.hideMenuTips()
    }
  }

  private handleBinaryPreview() {
    if (this.isBinaryEnable) {
      this.$emit('show-binary-preview', this.tips.data.nodeId)
      this.hideMenuTips()
    }
  }

  private handledeNodeDescribePreview() {
    if (this.isNodeDescribe) {
      this.$emit('show-describe', this.tips.data.nodeId)
      this.hideMenuTips()
    }
  }

  private async handleLog() {
    if (this.isLogEnable) {
      this.hideMenuTips()
      await NodeLogStore.request(this.graphId, this.tips.data.nodeId)
    }
  }

  private lookUpMetric() {
    if (this.GraphNodeState.value.metricOperator) {
      GraphMetricStore.setState({
        show: true,
        nodeId: this.tips.data.nodeId,
        graphId: this.graphId
      })
      this.hideMenuTips()
    }
  }

  private async handleExec(type: string) {
    if (this.execId === 0 || !this.execId) {
      this.hideMenuTips()
      await ExecuteGraphStore.request({
        graphId: this.graphId,
        baseNodeId: this.tips.data.nodeId,
        mode: type,
        execId: 0
      })
    }
  }
}
</script>
