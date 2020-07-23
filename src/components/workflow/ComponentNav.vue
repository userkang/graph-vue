<template>
  <div id="componentNav">
    <mtd-menu class="component-nav" :default-expanded-names="['协同任务XT', '托管平台', '机器学习平台']">
      <mtd-submenu
        v-for="(categoryItem, categoryIndex) in componentList"
        :name="categoryItem.categoryName"
        :key="categoryIndex"
      >
        <template slot="title">
          <li class="category-item">
            <i class="component-icon" :class="[componentIconMapFunc(categoryIndex)]"></i>
            <span>{{categoryItem.categoryName}}</span>
          </li>
        </template>

        <mtd-menu-item
          v-for="(compItem, compIndex) in categoryItem.components"
          :name="`${categoryIndex}-${compIndex}`"
          :key="compIndex"
          class="component-item"
        >
          <li
            ref="component"
            :draggable="canEditGraph"
            :data-componentid="compItem.id"
            :data-componenttype="categoryItem.categoryType"
            class="item"
          >
            <small>.</small>
            <span>{{compItem.componentName}}</span>
            <i class="iconfont icon-tuodong2"></i>
          </li>
        </mtd-menu-item>
      </mtd-submenu>
    </mtd-menu>
  </div>
</template>

<style lang="scss" scoped>
.component-nav {
  margin-top: 10px;
  text-align: left;
  overflow: hidden;
  user-select: none;
  &::v-deep .mtd-submenu-title {
    &:hover {
      background: #ebeefa;
    }
    a:hover {
      color: #666;
    }
  }
  .category-item {
    display: flex;
    align-items: center;
    color: #666;
    font-size: 14px;
  }
  .component-icon {
    margin-right: 4px;
    color: #8a94c2;
  }
  .component-item {
    box-sizing: border-box;
    color: #6b6b6b;
    font-size: 12px;
    &::v-deep a {
      padding: 0 !important;
      &:hover {
        color: #666;
      }
    }
    .item {
      padding-left: 40px;
      font-size: 12px;
      box-sizing: border-box;
      cursor: grab;
    }
    small {
      font-size: 30px;
      display: inline-block;
      height: 24px;
      margin-top: -32px;
      margin-right: 7px;
      color: #babcd8;
    }
    i {
      color: #a9aed1;
      position: absolute;
      right: 0;
      visibility: hidden;
    }
    &:hover {
      background: #ebeefa;
      color: #666;
      i {
        visibility: visible;
      }
    }
  }
  .active {
    border: 1px dashed #606be1;
    cursor: grabbing;
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { PositionTransformController } from '@/stores/workflow/graphVisual/LocalState'
import { ComponentCategoryVoType, GraphItemType } from '@/types/graph'
import { GraphRequestStore } from '@/stores/workflow/graphVisual/GraphContent'
import {
  AddNodeStore,
  NodeGroupStore
} from '@/stores/workflow/graphVisual/GraphVisual'
import {
  componentIconMapFunc,
  componentChildIconMapFunc
} from '@/metaData/workflow'
import { SwitchGraphController } from '@/stores/workflow/graphVisual/SwitchGraph'
import { ActiveNodeStore } from '@/stores/workflow/graphVisual/activeNode'

@Component
export default class ComponentNav extends Vue {
  @Prop({
    type: Array,
    required: true
  })
  private componentList!: Workflow.WorkflowComponentCategoryVo[]
  private dragged!: HTMLLIElement
  private componentId = 0
  private componentIconMapFunc = componentIconMapFunc
  private componentChildIconMapFunc = componentChildIconMapFunc
  private componentNav!: HTMLDivElement
  private graphContent!: SVGElement
  private positionTransformState = PositionTransformController.state
  private switchGraphState = SwitchGraphController.state
  private svg!: HTMLElement
  private dragBoxInside = {
    x: 0,
    y: 0
  }
  private componentType = ''

  get workflowId() {
    return this.switchGraphState.activeGraphExec.workflowId
  }

  get canEditGraph() {
    return this.switchGraphState.isCurrentGraphCanBeEdit
  }

  get isFold() {
    return this.switchGraphState.isLeftNavFold
  }

  get positionTransform() {
    return this.positionTransformState.value
  }

  private positionTransformX(originValue: number) {
    const posX = originValue - this.svg.getBoundingClientRect().x
    return (
      posX / this.positionTransform.scale - this.positionTransform.translateX
    )
  }

  private positionTransformY(originValue: number) {
    const posY = originValue - this.svg.getBoundingClientRect().y
    return (
      posY / this.positionTransform.scale - this.positionTransform.translateY
    )
  }

  private handleDragStart(event: DragEvent) {
    // 保存拖动元素的引用(ref.)
    this.dragged = event.target as HTMLLIElement
    const rect = this.dragged.getBoundingClientRect()
    const dataset = this.dragged.dataset
    this.componentId = Number(dataset.componentid)
    this.componentType = String(dataset.componenttype)

    // 计算鼠标距离组件外沿边距
    this.dragBoxInside.x = event.clientX - rect.x
    this.dragBoxInside.y = event.clientY - rect.y
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
      const posX = this.positionTransformX(x) - this.dragBoxInside.x
      const posY = this.positionTransformY(y) - this.dragBoxInside.y

      if (this.componentType === 'NODE_GROUP') {
        NodeGroupStore.addNodeGroup({
          workflowId: this.workflowId,
          nodeGroupId: this.componentId,
          posX,
          posY
        })
      } else {
        try {
          const data = await AddNodeStore.request({
            componentId: this.componentId,
            workflowId: this.workflowId,
            posX,
            posY
          })
          ActiveNodeStore.setState(data)
          this.$emit('addNode')
          // tslint:disable-next-line
        } catch (e) {}
      }
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
