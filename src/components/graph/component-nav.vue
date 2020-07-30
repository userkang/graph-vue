<template>
  <div id="componentNav">
    <li
      v-for="item in componentList"
      :key="item.id"
      ref="component"
      class="component-item"
    >
      <i class="iconfont iconzujian"></i>
      <span>{{ item.componentName }}</span>
    </li>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
// import {
//   AddNodeStore,
//   NodeGroupStore
// } from '@/stores/workflow/graphVisual/GraphVisual'
// import { SwitchGraphController } from '@/stores/workflow/graphVisual/SwitchGraph'
// import { ActiveNodeStore } from '@/stores/workflow/graphVisual/activeNode'

@Component
export default class ComponentNav extends Vue {
  @Prop({
    type: Array,
    required: true
  })
  private componentList!: IComponentType[]

  private dragged!: HTMLLIElement
  private componentId = 0
  private componentNav!: HTMLDivElement
  private graphContent!: SVGElement
  // private switchGraphState = SwitchGraphController.state
  private svg!: HTMLElement
  private dragPosition = {
    x: 0,
    y: 0
  }
  // private componentType = ''

  // get workflowId() {
  //   return this.switchGraphState.activeGraphExec.workflowId
  // }

  // get canEditGraph() {
  //   return this.switchGraphState.isCurrentGraphCanBeEdit
  // }

  // get isFold() {
  //   return this.switchGraphState.isLeftNavFold
  // }

  // get positionTransform() {
  //   return this.positionTransformState.value
  // }

  // private positionTransformX(originValue: number) {
  //   const posX = originValue - this.svg.getBoundingClientRect().x
  //   return (
  //     posX / this.positionTransform.scale - this.positionTransform.translateX
  //   )
  // }

  // private positionTransformY(originValue: number) {
  //   const posY = originValue - this.svg.getBoundingClientRect().y
  //   return (
  //     posY / this.positionTransform.scale - this.positionTransform.translateY
  //   )
  // }

  private handleDragStart(event: DragEvent) {
    // 保存拖动元素的引用(ref.)
    this.dragged = event.target as HTMLLIElement
    const rect = this.dragged.getBoundingClientRect()
    const dataset = this.dragged.dataset
    this.componentId = Number(dataset.componentid)
    // this.componentType = String(dataset.componenttype)

    // 计算鼠标距离组件外沿边距
    this.dragPosition.x = event.clientX - rect.x
    this.dragPosition.y = event.clientY - rect.y
    // 使其半透明
    // this.dragged.style.backgroundColor = '0.5'
    ;(event.target as SVGElement).classList.add('active')
  }

  private handleDragEnd(event: DragEvent) {
    // 重置透明度
    // ;(event.target as HTMLLIElement).style.opacity = ''
    ;(event.target as SVGElement).classList.remove('active')
  }

  private handleDragOver(event: DragEvent) {
    // 阻止默认动作以启用drop
    event.preventDefault()
  }

  private handleDragEnter(event: DragEvent) {
    // 当可拖动的元素进入可放置的目标时高亮目标节点
    if ((event.target as SVGElement).classList.contains('graph-content')) {
      ;(event.target as SVGElement).classList.add('active')
    }
  }

  private handleDragLeave(event: DragEvent) {
    // 当拖动元素离开可放置目标节点，重置其背景
    if ((event.target as SVGElement).classList.contains('graph-content')) {
      ;(event.target as SVGElement).classList.remove('active')
    }
  }

  private async handleDrop(event: DragEvent) {
    event.preventDefault()
    if ((event.target as SVGElement).id === 'graphContent') {
      const { clientX: x, clientY: y } = event
      // const posX = this.positionTransformX(x) - this.dragBoxInside.x
      // const posY = this.positionTransformY(y) - this.dragBoxInside.y

      try {
        // const data = await AddNodeStore.request({
        //   componentId: this.componentId,
        //   workflowId: this.workflowId,
        //   posX,
        //   posY
        // })
        // ActiveNodeStore.setState(data)
        // this.$emit('addNode')
        // tslint:disable-next-line
      } catch (e) {}
    }
  }

  private mounted() {
    this.componentNav = document.querySelector(
      '#componentNav'
    ) as HTMLDivElement
    this.svg = document.getElementById('graphContent') as HTMLElement
    this.componentNav.addEventListener('dragstart', this.handleDragStart, false)
    this.componentNav.addEventListener('dragend', this.handleDragEnd, false)
    this.svg.addEventListener('dragover', this.handleDragOver, false)
    this.svg.addEventListener('dragenter', this.handleDragEnter, false)
    this.svg.addEventListener('dragleave', this.handleDragLeave, false)
    this.svg.addEventListener('drop', this.handleDrop, false)
  }

  private beforeDestroy() {
    this.componentNav.removeEventListener('dragstart', this.handleDragStart)
    this.componentNav.removeEventListener('dragend', this.handleDragEnd)
    this.svg.removeEventListener('dragover', this.handleDragOver)
    this.svg.removeEventListener('dragenter', this.handleDragEnter)
    this.svg.removeEventListener('dragleave', this.handleDragLeave)
    this.svg.removeEventListener('drop', this.handleDrop)
  }
}
</script>

<style lang="scss" scoped>
.component-item {
  display: flex;
  height: 34px;
  box-sizing: border-box;
  color: $d4;
  font-size: 12px;
  padding-left: 40px;
  align-items: center;
  cursor: pointer;
  user-select: none;
  .iconfont {
    margin-right: 7px;
  }
  &:hover {
    background: #ebeefa;
    color: $d2;
  }
}
.active {
  border: 1px dashed #606be1;
  cursor: grabbing;
}
</style>
