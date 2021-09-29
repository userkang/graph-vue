<template>
  <div class="comp-panel">
    <div class="title">组件</div>
    <li
      v-for="item in componentList"
      :key="item.id"
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
        v-for="item in demoTemplates"
        :key="item.id"
        @click="getDemo(item.type)"
      >
        <ToolTip :message="item.desc" placement="right">
          <div class="demo-item-wrap">
            <div v-show="activeTemplate === item.type" class="mask"></div>
            <img class="image" :src="item.img" />
          </div>
        </ToolTip>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ComponentListStore } from '@/stores/component-list'
import ToolTip from '@/components/tool-tip.vue'
import GraphStore from '@/stores/graph'
import bus from '@/utils/bus'

const getRandomId = () =>
  Math.random()
    .toString()
    .slice(2)

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
      desc: '默认',
      img: require('../assets/imgs/demo-default.jpg')
    },
    {
      id: getRandomId(),
      type: demoTypes.TREE,
      desc: '树型结构',
      img: require('../assets/imgs/demo-tree.jpg')
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
    GraphStore.getData()
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
    bus.emit('demo-change')
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
    &:hover {
      border: 1px solid #4e73ff;
    }
    &-wrap {
      position: relative;
      width: 100%;
      height: 100%;
      transition: all 0.5s;
      &:hover {
        transform: scale(1.1);
      }
      .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
        background-color: rgba(0, 0, 255, 0.3);
      }
      .image {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
