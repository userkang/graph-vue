<template>
  <div class="graph-list-wrap">
    <div class="graph-list-content-wrap">
      <ul class="graph-list-content">
        <li class="graph-item active">{{tabText}}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SwitchGraphController } from '../../stores/graph/graphVisual/SwitchGraph'
import { GraphItemType } from '../../types/graph'
import { GraphVisualStore } from '@/stores/graph/graphVisual/GraphContent'

@Component
export default class TestGraphListWrap extends Vue {
  get tabText() {
    return `${this.$route.query.name}（${this.$route.params.versionId}）`
  }

  async created() {
    GraphVisualStore.setTestState(true)
    GraphVisualStore.setComponentId(Number(this.$route.params.id))
    GraphVisualStore.setComponentVersionId(Number(this.$route.params.versionId))

    const value: GraphItemType = {
      graphId: Number(this.$route.params.id),
      execId: 0,
      name: this.$route.query.name as string,
      dagId: 0
    }

    await SwitchGraphController.testSet(value)
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
    width: calc(100% - 128px);
  }
  .graph-list-content {
    display: flex;
    width: 100%;
    overflow: hidden;
  }
  .graph-item {
    display: flex;
    box-sizing: border-box;
    padding: 12px;
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
      flex-direction: row-reverse;
      padding-right: 10px;
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
</style>