<template>
  <div class="graph-list-wrap">
    <div class="graph-list-content-wrap">
      <ul
        class="graph-list-content"
        ref="graphListContent"
      >
        <template v-for="(graph, index) in graphList">
          <li
            class="graph-item"
            :style="{'padding-left': index === 0 && '12px'}"
            :class="{'active': graph.isActive}"
            @click="setActive(graph, false)"
            :key="`${graph.workflowId}`"
          >
            {{graph.name}}
            <i
              class="iconfont icon-biaoqianguanbi close-icon"
              @click="(event) => closeGraph(graph, event)"
            ></i>
          </li>
          <li
            class="gap"
            :key="`${graph.workflowId}-${index}`"
          ></li>
        </template>
      </ul>
    </div>
    <div class="graph-item more-item">
      <mtd-dropdown
        v-if="graphList.length > 0"
        trigger="hover"
        style="margin-top: -5px;"
        placement="bottom-end"
      >
        <span class="setting-wrap">
          <i class="iconfont icon-settings"></i>
        </span>
        <MtdDropdownMenu slot="dropdown">
          <MtdDropdownMenuItem @click="closeAllGraphs">关闭所有标签</MtdDropdownMenuItem>
          <MtdDropdownMenuItem @click="closeOtherGraphs">关闭其他标签</MtdDropdownMenuItem>
        </MtdDropdownMenu>
      </mtd-dropdown>
      <mtd-dropdown
        trigger="hover"
        v-if="isMoreShow"
        style="margin-top: -5px"
      >
        <mtd-button type="text">
          <span style="margin-right: 4px;">更多</span>
          <i class="mtdicon mtdicon-down"></i>
        </mtd-button>
        <MtdDropdownMenu slot="dropdown">
          <MtdDropdownMenuItem
            v-for="item in cutOffGraphList"
            :key="`${item.workflowId}`"
            @click="() => setActive(item, true)"
          >{{item.name}}</MtdDropdownMenuItem>
        </MtdDropdownMenu>
      </mtd-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { escapeHtml, routeNumberFilter } from '../../common/utils'
import { GraphVisualStore } from '../../stores/workflow/graphVisual/GraphContent'
import { SwitchGraphController } from '../../stores/workflow/graphVisual/SwitchGraph'
import { HistoryListController } from '../../stores/workflow/graphVisual/HistoryList'
import { ActiveWorkflowStore } from '../../stores/workflow/graphVisual/activeWorkflow'
import { GraphItemType } from '../../types/graph'

@Component
export default class GraphListWrap extends Vue {
  private workflowId = 0
  private name = ''
  private contentWidth = 0
  private wrapWidth = 0
  private isMoreShow = false
  private cutOffIndex = 0
  private graphListState = HistoryListController.state

  get graphList() {
    return this.graphListState.list
  }

  get cutOffGraphList() {
    return this.graphList.slice(this.cutOffIndex, this.graphList.length)
  }

  get route() {
    return this.$route
  }

  private handleResize() {
    if (this.$refs.graphListContent) {
      const liList = (this.$refs
        .graphListContent as HTMLElement).querySelectorAll('li')
      let contentWidth = 0
      let isSet = false
      let contentIndex = -1
      this.wrapWidth = (this.$refs
        .graphListContent as HTMLElement).getBoundingClientRect().width
      liList.forEach(item => {
        contentWidth += item.getBoundingClientRect().width
        if (item.classList.contains('graph-item')) {
          contentIndex++
        }
        if (contentWidth > this.wrapWidth && !isSet) {
          this.cutOffIndex = contentIndex
          isSet = true
        }
      })
      this.contentWidth = contentWidth
      this.isMoreShow = this.contentWidth > this.wrapWidth
    }
  }

  private async setActive(value: Workflow.GraphItemType, isToStart = false) {
    await SwitchGraphController.set(value, isToStart)
  }

  private async setDefaultGraph() {
    if (this.graphListState.list.length > 0) {
      const defaultGraph = this.graphListState.list[0]
      ;({ workflowId: this.workflowId, name: this.name } = defaultGraph)
      await this.setActive(
        {
          workflowId: this.workflowId,
          name: this.name
        },
        true
      )
    }
  }

  private async cleanContent() {
    GraphVisualStore.cleanContent()
    ActiveWorkflowStore.clean()
    SwitchGraphController.cleanActiveGraph()
  }

  private async closeGraph(value: Workflow.GraphItemType, event: MouseEvent) {
    event.stopPropagation()
    const newActiveItem = await HistoryListController.removeGraph(value)

    await SwitchGraphController.set(newActiveItem, false)
    // if history graph list is null, clean graph content data
    if (!newActiveItem.workflowId) {
      await this.cleanContent()
    }
  }

  private async closeAllGraphs() {
    HistoryListController.closeAllGraphs()
    await this.cleanContent()
    this.$router.push({
      name: 'workflowDetail',
      params: {
        id: '0'
      }
    })
  }

  private async closeOtherGraphs() {
    if (this.graphList.length > 1) {
      const activeGraph = HistoryListController.closeOtherGraphs()
      await SwitchGraphController.set(activeGraph)
    }
  }

  private async handleRouteChange() {
    HistoryListController.parseStorage()
    const workflowId = Number((this.$route.params as any).id)
    this.name = escapeHtml(this.$route.query.name as string)
    this.workflowId = routeNumberFilter(workflowId)

    if (this.workflowId && this.name) {
      await this.setActive(
        {
          workflowId: this.workflowId,
          name: this.name
        },
        true
      )
    } else if (this.workflowId === 0) {
      await this.setDefaultGraph()
    }
  }

  private async created() {
    await this.handleRouteChange()
  }

  @Watch('route')
  private async watchRoute() {
    const workflowId = Number(this.route.params.id)
    if (workflowId === 0) {
      await this.handleRouteChange()
    }
  }

  private mounted() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  }

  private updated() {
    this.handleResize()
  }

  private beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  }

  @Watch('graphListState.resize', {
    immediate: true
  })
  private watchResize() {
    this.handleResize()
  }
}
</script>

<style lang="scss" scoped>
@import '../../../static/css/variable';
$height: 22px;
.graph-list-wrap {
  font-family: PingFangSC-Regular;
  display: flex;
  overflow: hidden;
  height: 44px;
  background: #edf0fa;
  user-select: none;
  .graph-list-content-wrap {
    flex: 1;
  }
  .graph-list-content {
    overflow: hidden;
    text-align: left;
  }
  .graph-item {
    display: inline-block;
    vertical-align: top;
    box-sizing: border-box;
    padding: 12px 2px 10px 12px;
    // max-width: 186px;
    height: 44px;
    line-height: $height;
    color: #464646;
    font-size: 14px;
    text-align: left;
    cursor: pointer;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover {
      .close-icon {
        visibility: visible;
      }
    }
    &.active {
      color: $highlight-color;
      background: #fff;
      font-weight: 600;
      .close-icon {
        visibility: visible;
      }
    }
    &.more-item {
      width: 180px;
      padding-right: 10px;
      text-align: right;
    }
    .setting-wrap {
      width: 26px;
      height: 28px;
      background: #fff;
      border: 1px solid #dddeeb;
      border-right-width: 1px;
      border-radius: 1px;
      &:hover {
        border-color: #8891e9;
        background: #eaedfc;
      }
      i {
        display: inline-block;
        margin: 4px 5px;
        font-size: 14px;
        color: #8a94c2;
      }
    }

    .close-icon {
      color: inherit;
      font-weight: normal;
      display: inline-block;
      padding: 0 0 0 4px;
      font-size: 12px;
      margin-top: 2px;
      width: 26px;
      visibility: hidden;
    }
  }
  .gap {
    display: inline-block;
    content: '';
    width: 1px;
    height: $height;
    background: #e1e3f0;
    margin-top: 12px;
  }

  .setting-panel {
    margin-left: -200px;
  }
}
.schedule-logo {
  width: 68px;
  height: 18px;
  display: inline-block;
  background: #2cb066;
  color: #fff;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  border-radius: 2px;
  margin-top: 2px;
  margin-left: 5px;
}
.schedule-logo-yellow {
  @extend .schedule-logo;
  background: #fabc13;
}
</style>
