<template>
  <div class="comp-panel">
    <div class="title">组件</div>
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
    <div class="title">模板</div>
    <ul class="demo">
      <li
        class="demo-item"
        :class="{ selected: activeTemplate === item.type }"
        v-for="item in demoTemplates"
        :key="item.id"
        @click="getDemo(item.type)"
      >
        <ToolTip :message="item.desc" placement="right">
          <div class="demo-item-wrap">
            <img class="image" :src="item.img" />
          </div>
        </ToolTip>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ComponentListStore from '@/stores/component-list'
import ToolTip from '@/components/tool-tip.vue'
import GraphStore from '@/stores/graph'
import demoDefault from '@/assets/imgs/demo-default.jpg'
import demoTree from '@/assets/imgs/demo-tree.jpg'

const getRandomId = () => Math.random().toString().slice(2)

enum demoTypes {
  DEFAULT,
  TREE
}

@Component({
  components: {
    ToolTip
  }
})
export default class ComponentPanel extends Vue {
  dragged!: HTMLLIElement
  componentState = ComponentListStore.state

  demoTypes = demoTypes

  activeTemplate = demoTypes.DEFAULT

  demoTemplates: Array<{
    id: string
    type: number
    desc: string
    img: string
  }> = [
    {
      id: getRandomId(),
      type: demoTypes.DEFAULT,
      desc: 'dag 图',
      img: demoDefault
    },
    {
      id: getRandomId(),
      type: demoTypes.TREE,
      desc: '树型结构',
      img: demoTree
    }
  ]

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

  getDemo(type: number) {
    this.activeTemplate = type
    switch (type) {
      case demoTypes.TREE:
        GraphStore.getTreeData()
        break
      case demoTypes.DEFAULT:
        GraphStore.getData()
        break
      default:
        break
    }
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
.demo {
  width: 100%;
  &-item {
    position: relative;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    height: 100px;
    margin-left: 10%;
    overflow: hidden;
    box-sizing: border-box;
    &-wrap {
      position: relative;
      width: 100%;
      height: 100%;
      transition: all 0.5s;
      box-sizing: border-box;
      &:hover {
        transform: scale(1.1);
      }
      .image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .selected {
    border: 1px solid #4e73ff;
  }
}
</style>
