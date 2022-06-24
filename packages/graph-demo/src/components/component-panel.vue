<template>
  <div class="component-panel">
    <div class="title">拖动组件到画布</div>
    <li
      v-for="item in componentList"
      :key="item.componentId"
      ref="component"
      class="component-item"
      @dragstart="e => handleDragStart(e, item)"
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
import ToolTip from '@/components/tool-tip.vue'

@Component({
  components: {
    ToolTip
  }
})
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

  created() {
    ComponentListStore.getComponentList()
  }
}
</script>

<style lang="scss" scoped>
.component-panel {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 180px;
  height: 250px;
  user-select: none;
  box-sizing: border-box;
  background: #333;
  z-index: 1;
}
.title {
  font-size: 12px;
  color: #ddd;
  text-align: left;
  margin: 10px 10px;
}
.component-item {
  display: flex;
  height: 40px;
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
