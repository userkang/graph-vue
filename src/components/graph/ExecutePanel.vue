<template>
  <ul class="execute-panel">
    <div class="left-part">
      <li class="execute-item" v-if="graphStatus !== 30">
        <button
          @click="handleExecute('EXEC_ALL')"
          :style="{cursor: canExecute ? 'pointer' : 'not-allowed'}"
        >
          <img src="../../assets/execute.png" alt="execute" />
          <span>运行</span>
        </button>
      </li>
      <li class="execute-item" v-else>
        <button @click="handleStop">
          <img src="../../assets/stop.png" alt="execute" />
          <span>停止</span>
        </button>
      </li>
      <li class="execute-item" v-if="!isTest">
        <button @click="handleShowSchedule">
          <i class="iconfont-custom">&#xe656;</i>
          {{task && task.taskId ? '调度配置' : '添加调度'}}
        </button>
      </li>
      <li class="execute-item" v-if="!isTest">
        <button @click="handleCopy">
          <img src="../../assets/copy.png" alt="copy" />
          <span>另存为</span>
        </button>
      </li>
      <li>
        <router-link class="highlight-text execute-history" :to="routerLink">查看运行历史</router-link>
      </li>
    </div>
    <div v-if="activeGraphValue.execId !== 0" class="right-part">
      <div class="execute-item">
        <button @click="goNewVersion">跳转最新版本</button>
      </div>
    </div>
  </ul>
</template>

<style lang="scss" scoped>
.execute-panel {
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 43px;
  font-size: 12px;
  background: #fff;
  z-index: 99;
  transition-property: right;
  transition-duration: 0.5s;
  .left-part {
    display: flex;
    align-items: center;
    flex: 1;
  }
  .right-part {
    display: flex;
    align-items: center;
    padding-right: 15px;
  }
  .execute-item {
    padding-left: 8px;
    button {
      font-size: 12px;
      display: flex;
      height: 26px;
      color: #333;
      background: #ffffff;
      border: 1px solid #b4bad7;
      border-radius: 2px;
      padding: 6px 10px;
      line-height: 1;
      cursor: pointer;
      &:active {
        outline: none;
      }
      &:focus {
        outline: none;
      }
      &:hover {
        background: rgba(96, 107, 225, 0.1);
      }
    }
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
  margin-right: 6px;
  color: #8a94c2;
  font-size: 12px;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import {
  GraphStatusStore,
  GraphVisualStore
} from '@/stores/graph/graphVisual/GraphContent'
import { ProjectListStore } from '@/stores/graph/GraphList'
import { GlobalState } from '@/stores/global'
import { SwitchGraphController } from '@/stores/graph/graphVisual/SwitchGraph'

@Component
export default class ExecutePanel extends Vue {
  private graphStatusState = GraphStatusStore.state

  private graphContentState = GraphVisualStore.state

  private projectListState = ProjectListStore.state

  get isTest() {
    return this.graphContentState.isTest
  }

  get graphStatus() {
    return this.graphStatusState.value.status
  }

  get task() {
    return this.graphContentState.value.task
  }

  get graphProjectName(): string {
    return this.graphContentState.value
      ? this.graphContentState.value.projectName
      : ''
  }

  get projectNameList(): string[] {
    return this.projectListState.value.map(item => item.name)
  }

  get canExecute() {
    // graph is running enabled if execId is 0 and graph is not empty
    return (
      this.projectNameList.includes(this.graphProjectName) &&
      this.graphContentState.nodes.length > 0 &&
      (this.$store.state as GlobalState).activeGraphExec.execId === 0
    )
  }

  get activeGraphValue() {
    return (this.$store.state as GlobalState).activeGraphExec
  }

  get routerLink() {
    return {
      name: 'graphHistory',
      params: {
        id: this.activeGraphValue.graphId
      },
      query: {
        name: this.activeGraphValue.name
      }
    }
  }

  private handleExecute(mode: string) {
    if (this.canExecute) {
      this.$emit('executeGraph', mode)
    }
  }

  private handleStop() {
    this.$emit('stopGraph')
  }

  private handleCopy() {
    this.$emit('copyGraph')
  }

  private handleShowSchedule() {
    this.$emit('showSchedule')
  }

  private goNewVersion() {
    SwitchGraphController.set(
      {
        graphId: this.activeGraphValue.graphId,
        execId: 0,
        name: this.activeGraphValue.name,
        dagId: 0
      },
      false
    )
  }
}
</script>
