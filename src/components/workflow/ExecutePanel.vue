<template>
  <ul class="execute-panel">
    <li>
      <router-link class="highlight-text execute-history" :to="routerLink">查看变更历史</router-link>
    </li>
    <li class="execute-item">
      <template v-if="isEditGroup">
        <mtd-button ghost type="primary" size="small" @click="cancelGroup">取消</mtd-button>
        <mtd-button style="margin-left: 7px" type="primary" size="small" @click="addGroup">完成</mtd-button>
      </template>
      <mtd-button v-else type="primary" size="small" @click="handleEdit">添加节点组</mtd-button>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.execute-panel {
  position: absolute;
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 43px;
  font-size: 12px;
  background: #fff;
  transition-property: right;
  transition-duration: 0.5s;
  z-index: 99;
  li {
    cursor: pointer;
  }
  .execute-item {
    margin-left: 18px;
    img {
      width: 12px;
      height: 12px;
      margin-right: 6px;
    }
  }

  .execute-history {
    margin-left: 10px;
    &:hover {
      color: #606be1;
    }
  }
}
.iconfont-custom {
  color: #8a94c2;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { SwitchGraphController } from '@/stores/workflow/graphVisual/SwitchGraph'
import { GraphVisualStore } from '@/stores/workflow/graphVisual/GraphContent'
import { ActiveNodeStore } from '@/stores/workflow/graphVisual/activeNode'

@Component
export default class ExecutePanel extends Vue {
  private switchGraphState = SwitchGraphController.state
  private graphVisualState = GraphVisualStore.state
  private activeNodeState = ActiveNodeStore.state

  get activeGraphValue() {
    return this.switchGraphState.activeGraphExec
  }

  get isEditGroup() {
    return this.graphVisualState.isEditGroup
  }

  set isEditGroup(v) {
    this.graphVisualState.isEditGroup = v
  }

  get routerLink() {
    return {
      name: 'workflowHistory',
      params: {
        id: this.activeGraphValue.workflowId
      },
      query: {
        name: this.activeGraphValue.name
      }
    }
  }

  handleEdit() {
    this.graphVisualState.isEditGroup = true
  }

  addGroup() {
    this.$emit('createNodeGroup')
    this.isEditGroup = false
  }

  cancelGroup() {
    this.isEditGroup = false
    ActiveNodeStore.setSelectNodeIds([])
  }
}
</script>
