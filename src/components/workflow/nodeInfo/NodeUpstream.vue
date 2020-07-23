<template>
  <div class="param-wrap">
    <div class="param-title">
      <i class="slide"></i>
      <i
        class="iconfont icon-daohangxialasanjiao fold-param-icon"
        :class="{ 'fold-status': isFold }"
        @click="changeFold"
      ></i>
      <h4 class="comp-name">上游依赖</h4>
    </div>
    <section class="param-content" v-show="!isFold">
      <label class="param-item-label">强依赖</label>
      <mtd-button
        v-for="item in activeNodeUpstreamInfo.strongRelation"
        :key="item.taskUrl"
        type="text"
        @click="handleClick(item)"
      >{{ item.taskName }}</mtd-button>

      <label class="param-item-label">弱依赖</label>
      <mtd-button
        v-for="item in activeNodeUpstreamInfo.weakRelation"
        :key="item.taskUrl"
        type="text"
        @click="handleClick(item)"
      >{{ item.taskName }}</mtd-button>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
  ActiveNodeUpstreamInfoStore,
  IUpstreamItem
} from '@/stores/workflow/graphVisual/activeNode'

@Component
export default class NodeUpstream extends Vue {
  private isFold = false

  private activeNodeUpstreamInfoState = ActiveNodeUpstreamInfoStore.state

  get activeNodeUpstreamInfo() {
    return this.activeNodeUpstreamInfoState.value
  }

  private changeFold() {
    this.isFold = !this.isFold
  }

  private handleClick(row: IUpstreamItem) {
    const { taskUrl, nodeId, workflowId } = row
    if (taskUrl) {
      window.open(taskUrl, '_blank')
    } else if (nodeId && workflowId) {
      this.$router.push({
        name: 'nodeDevelopDetail',
        params: {
          workflowId,
          nodeId
        },
        query: {
          // 用来从目标页面再跳回来
          from: this.$route.query.name,
          fromWorkflow: this.$route.params.workflowId
        }
      })
    }
  }
}
</script>
