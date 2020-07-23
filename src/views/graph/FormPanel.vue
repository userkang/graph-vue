<template>
  <section class="form-panel-wrap" v-show="isRightTableShow">
    <h3 class="title">{{activeGraphValue.isActive ? '实验属性' : activeNodeValue.componentLabel}}</h3>
    <ul v-show="activeGraphValue.isActive" class="form-panel-content">
      <li class="graph-basic-info">
        <label>实验名称:</label>
        <span>{{activeGraphValue.graphName}}</span>
      </li>
      <li class="graph-basic-info">
        <label>当前版本:</label>
        <span>{{activeGraphValue.version}}</span>
      </li>
      <li class="graph-basic-info">
        <label>创建时间:</label>
        <span>{{activeGraphValue.createTime}}</span>
      </li>
      <li class="graph-basic-info">
        <label class="gap-bottom">保留中间数据执行:</label>
        <mtd-radio-group
          style="margin-left: 5px"
          v-model="activeGraphState.value.persist"
          size="small"
          :disabled="!activeGraphState.value.dagActive"
          @input="handlePersist"
        >
          <mtd-radio :value="true">是</mtd-radio>
          <mtd-radio :value="false">否</mtd-radio>
        </mtd-radio-group>
      </li>
      <li class="graph-basic-info" @blur.capture="handleDescBlur">
        <label>描述:</label>
        <MtdTextarea style="width: 100%" v-model="localDesc" rows="6" placeholder="输入内容不超过50个字符" />
      </li>
    </ul>
    <div v-show="!activeGraphValue.isActive">
      <SelectFieldModel
        v-if="isShowSelectFieldModel"
        :nodeId="nodeId"
        :paramId="paramId"
        :graphId="graphId"
        :isSingleSelection="isSingleSelection"
        :isShowSelectFieldModel="isShowSelectFieldModel"
        @close-select-field="handleSelectFieldModelClose"
      />
      <NodeParamShow :basicConfig="basicConfig" />
      <linkInfoShow :linkConfig="linkConfig" />
      <!-- <ul class="form-panel-content">
        <template v-if="linkConfig.length > 0">
          <linkInfoShow v-for="(linkConfig, index) in linkConfig" :key="index" :linkConfig="linkConfig" />
        </template>
        <EmptyAndLoading v-if="loadingStatus === 'LOADING'" :loadingStatus="loadingStatus" />
      </ul>-->
      <ul class="form-panel-content">
        <NodeParam v-for="paramTab in nodeParamValue" :key="paramTab.tabId" :paramTab="paramTab" />
        <EmptyAndLoading v-if="loadingStatus === 'LOADING'" :loadingStatus="loadingStatus" />
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
$border-color: #e4e8f5;
.form-panel-wrap {
  width: calc(100% - 8px);
  box-sizing: border-box;
  padding: 10px 6px 0 6px;
  background: #f7f9ff;
  border-left: 1px solid $border-color;
  .title {
    height: 34px;
    text-align: center;
    font-size: 14px;
    color: #666666;
    border-bottom: 1px solid $border-color;
  }
  .form-panel-content {
    padding-top: 6px;
    overflow-x: hidden;
    overflow-y: auto;
    height: calc(100% - 34px);
    &::-webkit-scrollbar {
      background-color: transparent;
      width: 4px;
      visibility: hidden;
    }
    &::-webkit-scrollbar-thumb {
      background-color: transparent;
      width: 1px;
    }
  }
  .graph-basic-info {
    text-align: left;
    font-size: 12px;
    margin-bottom: 13px;
    color: #2a2a2a;
    label {
      margin-right: 4px;
      color: #8a94c2;
    }
    .mtd-textarea {
      color: #2a2a2a;
      font-size: 12px;
    }
  }
  .gap-bottom {
    display: inline-block;
    margin-bottom: 8px;
  }
}
</style>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import {
  ActiveNodeController,
  ActiveGraphController,
  ActiveGraphPayload
} from '@/stores/graph/graphVisual/LocalState'
import {
  NodeParamStore,
  UpdateGraphStore
} from '@/stores/graph/graphVisual/GraphVisual'
import { GraphRequestStore } from '@/stores/graph/graphVisual/GraphContent'
import NodeParam from '../../components/param/NodeParam.vue'
import NodeParamShow from '../../components/param/NodeParamShow.vue'
import LinkInfoShow from '../../components/param/LinkInfoShow.vue'
import SelectFieldModel from '../../components/param/SelectFieldModel.vue'
import EmptyAndLoading from '../../components/EmptyAndLoading.vue'
import { GlobalState } from '@/stores/global'
import bus from '../../common/bus'

@Component({
  components: {
    EmptyAndLoading,
    NodeParam,
    NodeParamShow,
    SelectFieldModel,
    LinkInfoShow
  }
})
export default class FormPanel extends Vue {
  @Prop({
    type: Boolean,
    required: true
  })
  private isRightTableShow!: boolean

  private isShowSelectFieldModel = false

  private isSingleSelection = true

  private paramId = 0

  private nodeId = 0

  private nodeParamState = NodeParamStore.state

  private activeNodeState = ActiveNodeController.state

  private activeGraphState = ActiveGraphController.state

  private localDesc = ''

  private persist = false

  get linkConfig() {
    return this.nodeParamState.value.componentLinkConfigVo || {}
  }

  get basicConfig() {
    return this.nodeParamState.value.componentBasicConfigVo || {}
  }

  get nodeParamValue() {
    return this.nodeParamState.value.paramTabWithParamVos || []
  }

  get loadingStatus() {
    return this.nodeParamState.loadingStatus
  }

  get activeNodeValue() {
    return this.activeNodeState.value
  }

  get activeGraphValue() {
    return this.activeGraphState.value
  }

  get graphId() {
    return this.activeGraphValue.graphId
  }

  get currentGraph() {
    return (this.$store.state as GlobalState).activeGraphExec
  }

  private handleSelectFieldModelClose() {
    this.isShowSelectFieldModel = false
  }

  private async handlePersist() {
    const { graphId } = this.activeGraphValue
    const res = await UpdateGraphStore.checkoutPersist({
      graphId,
      persist: this.activeGraphValue.persist
    })
  }

  private async handleDescBlur() {
    if (this.localDesc !== this.activeGraphValue.desc) {
      if (this.localDesc.length > 50) {
        this.$mtd.message('描述不能超过50个字符，请重新填写')
        return
      }
      const { graphId, graphName } = this.activeGraphValue
      // optimistic update
      await UpdateGraphStore.request({
        graphId,
        graphName,
        graphDesc: this.localDesc
      })
      await GraphRequestStore.request({
        graphId: this.currentGraph.graphId,
        execId: this.currentGraph.execId
      })
    }
  }

  private mounted() {
    // todo 定为一下打开多个区域为什么会变窄
    this.localDesc = this.activeGraphValue.desc

    bus.$on(
      'show-select-field',
      (type: string, nodeId: number, paramId: number) => {
        this.isShowSelectFieldModel = true
        this.paramId = paramId
        this.nodeId = nodeId
        this.isSingleSelection = type === 'SINGLEFIELD'
      }
    )
  }

  private beforeDestroy() {
    bus.$off('show-select-field')
  }

  @Watch('activeGraphValue', { deep: true })
  private watchActiveGraphValue(value: ActiveGraphPayload) {
    this.localDesc = value.desc
  }
}
</script>
