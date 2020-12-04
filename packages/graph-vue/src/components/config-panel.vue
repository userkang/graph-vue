<template>
  <div class="config-panel-wrapper">
    <div class="title">画布配置</div>

    <div class="form-item">
      <div class="label">图方向</div>
      <select class="content" v-model="graphConfigState.drection">
        <option value="TB">TB（自上而下）</option>
        <option value="LR">LR（从左往右）</option>
      </select>
    </div>

    <div class="item">
      <div class="label">交互行为</div>
      <div class="checkbox-item" v-for="(item, key) in actionList" :key="key">
        <input
          :id="key"
          type="checkbox"
          :value="key"
          v-model="graphConfigState.action"
        />
        <label :for="key">{{ item }}</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { GraphConfigStore } from '@/stores/graph-config'

@Component
export default class ConfigPanel extends Vue {
  graphConfigState = GraphConfigStore.state
  actionList = {
    'drag-svg': '拖动画布',
    'drag-node': '拖动节点',
    'click-select': '点击选中',
    'create-edge': '创建边',
    'wheel-move': '滚轮移动画布',
    'wheel-zoom': '双指缩放',
    'brush-select': '框选'
  }
}
</script>

<style lang="scss" scoped>
.config-panel-wrapper {
  width: 190px;
  height: 100%;
  box-sizing: border-box;
  background: $l1;
  border-left: 1px solid $l2;
  color: #666;
  font-size: 14px;
  padding: 5px 10px;
  .form-item {
    width: 100%;
    margin-bottom: 7px;
  }
  .label {
    font-size: 12px;
    padding: 5px 0;
    font-weight: 800;
  }
  input,
  select {
    line-height: 1;
    font-size: 12px;
    border: 1px solid #eee;
    outline: none;
    padding: 3px 2px;
    box-shadow: 0 2px 3px 0 #eee;
    vertical-align: middle;
    cursor: pointer;
  }
  select {
    width: 100%;
  }
  input[type='text'] {
    width: 100%;
  }
  label {
    padding: 4px 2px;
    font-size: 12px;
    cursor: pointer;
  }
  .checkbox-item {
    display: inline-flex;
    align-items: center;
    margin-right: 10px;
    margin-bottom: 5px;
    height: 20px;
  }
}
.title {
  font-size: 12px;
  color: $d1;
  text-align: left;
  padding: 10px 0px;
}
</style>
