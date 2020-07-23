<template>
  <el-menu class="component-nav" id="componentNav" :defaultOpeneds="['数据源', '机器学习', '数据预处理']">
    <el-submenu
      v-for="(categoryItem, categoryIndex) in componentList"
      :index="categoryItem.categoryName"
      :key="categoryIndex"
    >
      <template slot="title" style="padding-left: 0">
        <li class="category-item">
          <i class="component-icon" :class="[componentIconMapFunc(categoryIndex)]"></i>
          <span>{{categoryItem.categoryName}}</span>
        </li>
      </template>
      <el-submenu
        v-for="(typeItem, typeIndex) in categoryItem.types"
        :index="`${categoryIndex}-${typeIndex}`"
        :key="typeIndex"
      >
        <template slot="title">
          <li class="type-item">
            <i
              class="component-icon"
              :class="[componentChildIconMapFunc(categoryIndex, typeIndex)]"
            ></i>
            <span class="type-item-text">{{typeItem.typeName}}</span>
          </li>
        </template>
        <el-menu-item
          v-for="(compItem, compIndex) in typeItem.components"
          :index="`${categoryIndex}-${typeIndex}-${compIndex}`"
          :key="compIndex"
        >
          <li
            class="component-item"
            ref="component"
            :draggable="canEditGraph"
            ondragstart="event.dataTransfer.setData('text/plain',null)"
            :data-versionid="compItem.componentVersionId"
            :style="{'cursor': canEditGraph ? 'pointer' : 'not-allowed'}"
          >
            <small>.</small>
            <span>{{compItem.componentLabel}}</span>
            <i class="iconfont icon-tuodong2"></i>
          </li>
        </el-menu-item>
      </el-submenu>
    </el-submenu>
  </el-menu>
</template>

<style lang="scss" scoped>
.component-nav {
  text-align: left;
  overflow: hidden;
  user-select: none;
  .category-item {
    display: flex;
    align-items: center;
    color: #666;
    font-size: 14px;
    padding-left: 10px;
    &:hover {
      background: #ebeefa;
    }
  }
  .type-item {
    display: flex;
    align-items: center;
    padding-left: 25px;
    color: #666;
    font-size: 12px;
    &:hover {
      background: #ebeefa;
    }
    &-text {
      display: inline-block;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .component-icon {
    margin-right: 4px;
    color: #8a94c2;
  }
  .component-item {
    box-sizing: border-box;
    padding-left: 40px;
    color: #6b6b6b;
    font-size: 12px;
    width: 180px;
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
      float: right;
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
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { PositionTransformController } from '@/stores/graph/graphVisual/LocalState'
import { ComponentCategoryVoType, GraphItemType } from '@/types/graph'
import { GraphRequestStore } from '@/stores/graph/graphVisual/GraphContent'
import { AddNodeStore } from '@/stores/graph/graphVisual/GraphVisual'
import {
  componentIconMapFunc,
  componentChildIconMapFunc
} from '@/metaData/graph'

@Component
export default class ComponentNav extends Vue {
  @Prop({
    type: Array,
    required: true
  })
  private componentList!: ComponentCategoryVoType[]
  private dragged!: HTMLLIElement
  private versionId = 0
  private componentIconMapFunc = componentIconMapFunc
  private componentChildIconMapFunc = componentChildIconMapFunc
  private componentNav!: HTMLDivElement
  private graphContent!: SVGElement
  private positionTransformState = PositionTransformController.state
  private svg!: HTMLElement
  private dragBoxInside = {
    x: 0,
    y: 0
  }

  get graphId() {
    return ((this.$store.state as any).activeGraphExec as GraphItemType).graphId
  }

  get execId() {
    return ((this.$store.state as any).activeGraphExec as GraphItemType).execId
  }

  get canEditGraph() {
    return (this.$store.state as any).isCurrentGraphCanBeEdit as boolean
  }

  get isFold() {
    return (this.$store.state as any).isLeftNavFold
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
    this.versionId = Number(dataset.versionid)

    // 计算鼠标距离组件外沿边距
    this.dragBoxInside.x = event.clientX - rect.x
    this.dragBoxInside.y = event.clientY - rect.y
    // 使其半透明
    ;(event.target as HTMLLIElement).style.backgroundColor = '0.5'
  }

  private handleDragEnd(event: DragEvent) {
    // 重置透明度
    ;(event.target as HTMLLIElement).style.opacity = ''
  }

  private handleDragOver(event: DragEvent) {
    // 阻止默认动作以启用drop
    event.preventDefault()
  }

  private handleDragEnter(event: DragEvent) {
    // 当可拖动的元素进入可放置的目标时高亮目标节点
    if ((event.target as SVGElement).classList.contains('graph-content')) {
      // (event.target as SVGElement).classList.add('active');
    }
  }

  private handleDragLeave(event: DragEvent) {
    // 当拖动元素离开可放置目标节点，重置其背景
    if ((event.target as SVGElement).classList.contains('graph-content')) {
      // (event.target as SVGElement).classList.remove('active');
    }
  }

  private async handleDrop(event: DragEvent) {
    event.preventDefault()
    if ((event.target as SVGElement).id === 'graphContent') {
      const { clientX: x, clientY: y } = event
      const posX = this.positionTransformX(x) - this.dragBoxInside.x
      const posY = this.positionTransformY(y) - this.dragBoxInside.y

      await AddNodeStore.request({
        graphId: this.graphId,
        versionId: this.versionId,
        x: posX,
        y: posY
      })
    }
  }

  private mounted() {
    this.componentNav = document.querySelector(
      '#componentNav'
    ) as HTMLDivElement
    this.svg = document.getElementById('graphContent') as HTMLElement
    this.graphContent = document.querySelector('#graphContent') as SVGElement
    this.componentNav.addEventListener('dragstart', this.handleDragStart, false)
    this.componentNav.addEventListener('dragend', this.handleDragEnd, false)
    this.graphContent.addEventListener('dragover', this.handleDragOver, false)
    this.graphContent.addEventListener('dragenter', this.handleDragEnter, false)
    this.graphContent.addEventListener('dragleave', this.handleDragLeave, false)
    this.graphContent.addEventListener('drop', this.handleDrop, false)
  }

  private beforeDestroy() {
    this.componentNav.removeEventListener('dragstart', this.handleDragStart)
    this.componentNav.removeEventListener('dragend', this.handleDragEnd)
    this.graphContent.removeEventListener('dragover', this.handleDragOver)
    this.graphContent.removeEventListener('dragenter', this.handleDragEnter)
    this.graphContent.removeEventListener('dragleave', this.handleDragLeave)
    this.graphContent.removeEventListener('drop', this.handleDrop)
  }
}
</script>
