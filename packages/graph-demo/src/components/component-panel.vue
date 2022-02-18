<template>
  <div class="comp-panel">
    <div class="title">组件</div>
    <li
      v-for="item in componentList"
      :key="item.componentId"
      ref="component"
      class="component-item"
      @dragstart="(e) => handleDragStart(e, item)"
      @dragend="handleDragEnd"
      draggable
    >
      <i class="iconfont iconzujian"></i>
      <span>{{ item.componentName }}</span>
    </li>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ComponentListStore from '@/stores/component-list'

@Component
export default class ComponentPanel extends Vue {
  dragged!: HTMLLIElement
  componentState = ComponentListStore.state

  get componentList() {
    return this.componentState.list
  }

  handleDragStart(e: DragEvent, component: IComponentType) {
    this.dragged = e.target as HTMLLIElement

    // 添加拖动样式
    this.dragged.classList.add('active')

    const rect = this.dragged.getBoundingClientRect()
    this.componentState.dragingInfo.component = component

    // 保存鼠标距离组件左上角距离
    this.componentState.dragingInfo.offsetX = e.clientX - rect.x
    this.componentState.dragingInfo.offsetY = e.clientY - rect.y
  }

  handleDragEnd(e: DragEvent) {
    ;(e.target as HTMLElement).classList.remove('active')
  }

  async mounted() {
    await ComponentListStore.getComponentList()
  }
}
</script>

<style lang="scss" scoped>
.comp-panel {
  position: relative;
  width: 190px;
  height: 100%;
  box-sizing: border-box;
  background: #333;
  border-right: 1px solid #222;
}
.title {
  font-size: 12px;
  color: #ddd;
  text-align: left;
  margin: 5px 10px;
}
.component-item {
  display: flex;
  height: 35px;
  box-sizing: border-box;
  color: #ddd;
  font-size: 12px;
  padding-left: 40px;
  align-items: center;
  cursor: pointer;
  user-select: none;
  .iconfont {
    margin-right: 6px;
  }
  &:hover {
    background: #484848;
  }
}
.active {
  border: 1px dashed #999;
  cursor: grabbing;
}
</style>
