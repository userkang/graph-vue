<template>
  <section class="comp-panel" id="leftCompPanel">
    <mtd-radio-group class="radio-group-wrapper" v-model="tabValue">
      <mtd-radio-button class="radio-button" value="project">目录</mtd-radio-button>
      <mtd-radio-button class="radio-button" value="component">组件</mtd-radio-button>
    </mtd-radio-group>

    <div class="project-content" v-show="tabValue === 'project'">
      <Project />
    </div>

    <div v-show="tabValue ==='component'" class="comp-content">
      <ComponentNav @addNode="() => this.$emit('addNode')" :componentList="graphComponentValue" />
    </div>
    <div id="leftScaleLine" class="scale-line"></div>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ComponentNav from '@/components/workflow/ComponentNav.vue'
import Project from '@/components/workflow/Project.vue'
import { ComponentListStore } from '@/stores/workflow/graphVisual/ComponentList'
import { HistoryListController } from '@/stores/graph/graphVisual/HistoryList'

@Component({
  components: {
    Project,
    ComponentNav
  }
})
export default class ComponentPanel extends Vue {
  private graphComponentState = ComponentListStore.state
  private scaleLine!: HTMLDivElement
  private compPanel!: HTMLDivElement
  private initX = 0
  private initPanelWidth = 0
  private graphListState = HistoryListController.state

  get tabValue() {
    return this.graphComponentState.tabValue
  }

  set tabValue(v: string) {
    this.graphComponentState.tabValue = v
  }

  get graphComponentValue() {
    return this.graphComponentState.list
  }

  private createExperiment() {
    return this.$emit('createExperiment')
  }

  private async mounted() {
    await ComponentListStore.getComponentList()
    this.scaleLine = document.getElementById('leftScaleLine') as HTMLDivElement
    this.compPanel = document.getElementById('leftCompPanel') as HTMLDivElement

    this.scaleLine.addEventListener('mousedown', this.handleMouseDown, true)
  }

  private handleMouseMove(e: MouseEvent) {
    const moveX = this.initX - e.clientX
    document.body.style.userSelect = 'none'
    this.scaleLine.style.background = '#606be1'
    this.compPanel.style.width = this.initPanelWidth - moveX + 'px'
    this.graphListState.resize = !this.graphListState.resize
  }

  private handleMouseUp() {
    document.removeEventListener('mousemove', this.handleMouseMove, true)
    document.removeEventListener('mouseup', this.handleMouseUp, true)
    document.body.style.userSelect = 'auto'
    this.scaleLine.style.background = ''
  }

  private handleMouseDown(e: MouseEvent) {
    this.initX = e.clientX
    this.initPanelWidth = this.compPanel.getBoundingClientRect().width
    document.addEventListener('mousemove', this.handleMouseMove, true)
    document.addEventListener('mouseup', this.handleMouseUp, true)
  }
}
</script>

<style lang="scss" scoped>
.comp-panel {
  position: relative;
  width: 200px;
  max-width: 30%;
  min-width: 200px;
  height: 100%;
  display: block;
  float: left;
  box-sizing: border-box;
  background: #f7f9ff;
  border-right: 1px solid #e4e8f5;
}
.project-content {
  height: calc(100% - 39px);
  overflow: hidden;
}
.comp-content {
  height: calc(100% - 40px);
  overflow: auto;
  h4 {
    font-size: 12px;
    color: #8a94c2;
    font-weight: normal;
    text-align: left;
    margin: 5px 0;
    padding-left: 10px;
  }
}
.radio-button {
  flex: 1;
}
.radio-group-wrapper {
  margin: 5px 5px 0;
  display: flex;
}
.scale-line {
  position: absolute;
  top: 0;
  bottom: 0;
  right: -2px;
  width: 3px;
  &:hover {
    cursor: col-resize;
    background: #606be1;
  }
  z-index: 100;
}
</style>
