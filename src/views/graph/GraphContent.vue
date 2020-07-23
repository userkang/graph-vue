<template>
  <div class="graph-content-wrap">
    <div class="line"></div>
    <div class="loading-wrap" v-show="loadingStatus === 'LOADING'">
      <LoadingIcon />
    </div>
    <svg
      v-show="graphId !== 0"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      id="graphContent"
      @click.capture="handleClick"
      @mousedown="setDragStart"
      @mousemove.capture="handleMouseMove"
      @mouseup.capture="handleMouseUp"
      @contextmenu.capture="preventDefaultContext"
      @mousewheel="handleMouseWheel"
      width="100%"
      height="100%"
    >
      <g
        :style="{
                transform: `scale(${scale}) translate3D(${translateX}px, ${translateY}px, 0)`,
                transformOrigin: '0px 0px 0px'
            }"
      >
        <template v-if="nodes">
          <GraphNode
            v-for="item in nodes"
            :key="item.nodeId"
            :node="item"
            :isDagActived="graphContentState.isDagActived"
            :activeSlotType="activeSlotType"
            :fromNodeId="fromNodeId"
            :linkedSlots="linkedSlots"
            :isLocked="isLocked"
            :isNodeActive="lastNodeId === item.nodeId"
            @mousedown="(position) => handleMouseDown(item, position)"
          />
        </template>
        <template>
          <GraphEdge
            v-for="item in edges"
            :key="item.edgeId"
            :edge="item"
            :isActiveEdge="activeEdgeId === item.edgeId"
            :refresh="isRefreshEdge"
            @edgeClick="handleEdgeClick"
            @delete="deleteLine"
          />
        </template>
        <NewGraphEdge />
      </g>
    </svg>
    <EmptyGraph v-if="graphId === 0" @openCreateModal="openCreateModal" />
    <ScalePanel @scaleChange="handleScaleChange" />
    <ModalMetric :show.sync="isShowMlx" :queryCategory="queryCategory" :chartParams="chartParams" />
  </div>
</template>

<style lang="scss" scoped>
.graph-content-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
  padding-top: 80px;
  .loading-wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 999;
  }
}
.line {
  width: 100%;
  height: 1px;
  background: #d9dadd;
  position: absolute;
  top: 43px;
}
</style>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import {
  UpdateNodePositionStore,
  AddEdgeStore,
  DeleteEdgeStore,
  NodeParamStore,
  DeleteNodeStore
} from '../../stores/graph/graphVisual/GraphVisual'
import {
  ActiveNodeController,
  ActiveGraphController,
  MenuTipsController,
  CreateLineController,
  PositionTransformController
} from '../../stores/graph/graphVisual/LocalState'
import {
  GraphRequestStore,
  GraphVisualStore
} from '../../stores/graph/graphVisual/GraphContent'
import {
  AddEdgePositionType,
  GraphItemType,
  NodeVoType,
  PositionType
} from '../../types/graph'
import { GraphMetricStore } from '../../stores/graph/graphVisual/GraphModelMetric'
import { GlobalState } from '../../stores/global'
import GraphNode from '../../components/graph/GraphNode.vue'
import GraphEdge from '../../components/graph/GraphEdge.vue'
import NewGraphEdge from '../../components/graph/NewGraphEdge.vue'
import ScalePanel from '../../components/graph/ScalePanel.vue'
import LoadingIcon from '../../components/LoadingIcon.vue'
import EmptyGraph from '@/components/graph/EmptyGraph.vue'
import ModalMetric from '@/components/metric/ModalMetric.vue'
import { ChartCompParamsType } from '@/types/metric'

@Component({
  components: {
    EmptyGraph,
    LoadingIcon,
    ScalePanel,
    NewGraphEdge,
    GraphEdge,
    GraphNode,
    ModalMetric
  }
})
export default class GraphContent extends Vue {
  private graphContentState = GraphVisualStore.state
  private isMouseDownFiredByNode = false
  private isMouseDownFiredByLine = false
  private isMouseDownFiredByDrag = false
  private activeNode!: NodeVoType
  private activeEdgeId: number = 0
  private activeSlotType = ''
  private fromNodeId = 0
  private fromSlotId = 0
  private posX = 0
  private posY = 0
  private browserStartX = 0
  private browserStartY = 0
  private translateX = 0
  private translateY = 0
  private moveX = 0
  private moveY = 0
  private distanceX = 0
  private distanceY = 0
  private lastNodeId = 0
  private scale = 1
  private GraphMetricState = GraphMetricStore.state

  get isShowMlx() {
    return GraphMetricStore.state.show
  }
  set isShowMlx(v: boolean) {
    GraphMetricStore.setState({
      show: false,
      nodeId: '',
      graphId: ''
    })
  }

  get queryCategory() {
    return this.isShowMlx ? 'graphNode' : ''
  }

  get nodes() {
    return this.graphContentState.nodes
  }

  get edges() {
    return this.graphContentState.edges
  }

  get linkedSlots() {
    return this.graphContentState.linkedSlots
  }

  get isFold() {
    return (this.$store.state as GlobalState).isLeftNavFold
  }

  get isLocked() {
    return !(this.$store.state as GlobalState).isCurrentGraphCanBeEdit
  }

  get graphId() {
    return (this.$store.state as GlobalState).activeGraphExec.graphId
  }

  get execId() {
    return (this.$store.state as GlobalState).activeGraphExec.execId
  }

  get isRefreshEdge() {
    return this.graphContentState.isRefreshEdge
  }

  get loadingStatus() {
    return this.graphContentState.loadingStatus
  }

  get chartParams() {
    return {
      nodeId: this.GraphMetricState.nodeId,
      graphId: this.GraphMetricState.graphId
    }
  }

  private async fetchGraphContent() {
    await GraphRequestStore.request({
      graphId: this.graphId,
      execId: this.execId
    })
  }

  private openCreateModal() {
    this.$emit('openCreateModal')
  }

  private handleEdgeClick(edgeId: number) {
    this.activeEdgeId = edgeId
    this.lastNodeId = 0
  }

  private handleClick(event: MouseEvent) {
    // event.stopPropagation();
    if ((event.target as SVGElement).tagName === 'svg') {
      MenuTipsController.hide()
      ActiveGraphController.show()
      this.activeEdgeId = 0
      this.lastNodeId = 0
    }
  }

  private async handleKeyUp(event: KeyboardEvent) {
    const tagName = (event.target as HTMLBodyElement).tagName
    if (tagName === 'BODY' && !this.isLocked) {
      if (['Delete', 'Backspace'].includes(event.key)) {
        if (this.activeEdgeId) {
          await DeleteEdgeStore.request({
            graphId: this.graphId,
            edgeId: this.activeEdgeId
          })
          this.activeEdgeId = 0
        }
        if (this.lastNodeId) {
          await DeleteNodeStore.request({
            graphId: this.graphId,
            nodeId: this.lastNodeId
          })
          this.lastNodeId = 0
        }
      }
    }
  }

  private async deleteLine() {
    await DeleteEdgeStore.request({
      graphId: this.graphId,
      edgeId: this.activeEdgeId
    })
    this.activeEdgeId = 0
  }

  private handleMouseWheel(event: WheelEvent) {
    this.handleScaleChange(event.deltaY > 0 ? 'shrink' : 'expand', 0.01)
  }

  private handleScaleChange(scaleType: string, radio = 0.1) {
    if (scaleType === 'expand' && this.scale < 1.5) {
      this.scale += radio
    } else if (scaleType === 'shrink' && this.scale > 0.6) {
      this.scale -= radio
    } else if (scaleType === 'reset') {
      this.scale = 1
      this.translateX = 0
      this.translateY = 0
      this.resetNodePosition()
    }
  }

  private async resetNodePosition() {
    const graphContent = document.getElementById('graphContent') as HTMLElement
    const limitWidth = graphContent.getBoundingClientRect().width - 200
    const limitHeight = graphContent.getBoundingClientRect().height - 34 - 80

    await this.graphContentState.nodes.forEach(async item => {
      if (
        item.posX > 0 &&
        item.posX < limitWidth &&
        item.posY > 0 &&
        item.posY < limitHeight
      ) {
        return
      }

      item.posX = item.posX < 0 ? 0 : item.posX
      item.posX = item.posX > limitWidth ? limitWidth : item.posX
      item.posY = item.posY < 0 ? 0 : item.posY
      item.posY = item.posY > limitHeight ? limitHeight : item.posY

      await GraphVisualStore.updateNodePosition({
        nodeId: item.nodeId,
        x: item.posX,
        y: item.posY
      })
      await UpdateNodePositionStore.request({
        graphId: this.graphId,
        nodeId: item.nodeId,
        x: item.posX,
        y: item.posY
      })
    })
  }

  private async handleShowParam(nodeId: number) {
    await NodeParamStore.request(nodeId, 0)
  }

  private preventDefaultContext(event: MouseEvent) {
    event.preventDefault()
  }

  private positionTransformX(originValue: number) {
    const posX = this.isFold ? originValue - 60 - 180 : originValue - 200 - 180
    return posX / this.scale - this.translateX
  }

  private positionTransformY(originValue: number) {
    const posY = originValue - 56 - 122
    return posY / this.scale - this.translateY
  }

  private async setNodePosition(x: number, y: number) {
    if (!this.isLocked) {
      GraphVisualStore.updateNodePosition({
        nodeId: this.activeNode.nodeId,
        x,
        y
      })
    }
  }

  private createNewLine(x: number, y: number) {
    if (!this.isLocked) {
      CreateLineController.move(x, y)
    }
  }

  private setDragStart(event: MouseEvent) {
    this.isMouseDownFiredByDrag = true
    this.moveX = event.clientX
    this.moveY = event.clientY
  }

  private async handleMouseDown(
    node: NodeVoType,
    position: PositionType | AddEdgePositionType
  ) {
    if (position.type === 'node') {
      this.isMouseDownFiredByNode = true
      this.activeNode = node
      this.posX = this.positionTransformX(position.x)
      this.posY = this.positionTransformY(position.y)
      await this.setNodePosition(node.posX, node.posY)
      this.distanceX = this.posX - node.posX
      this.distanceY = this.posY - node.posY
      this.browserStartX = position.x
      this.browserStartY = position.y
    } else if (position.type === 'line') {
      const edgePosition = position as AddEdgePositionType
      this.isMouseDownFiredByLine = true
      const posX = this.positionTransformX(edgePosition.x)
      const posY = this.positionTransformY(edgePosition.y)
      this.createNewLine(posX, posY)
      this.fromNodeId = edgePosition.fromNodeId
      this.fromSlotId = edgePosition.fromSlotId
      this.activeSlotType = edgePosition.slotType
    }
  }

  private async handleMouseMove(event: MouseEvent) {
    event.stopPropagation()
    const posX = this.positionTransformX(event.clientX)
    const posY = this.positionTransformY(event.clientY)
    if (this.isMouseDownFiredByNode) {
      this.posX = posX
      this.posY = posY
      await this.setNodePosition(
        this.posX - this.distanceX,
        this.posY - this.distanceY
      )
    } else if (this.isMouseDownFiredByLine) {
      this.createNewLine(posX, posY)
    } else if (this.isMouseDownFiredByDrag) {
      const { clientX: endX, clientY: endY } = event
      this.translateX = endX - this.moveX + this.translateX
      this.translateY = endY - this.moveY + this.translateY
      this.moveX = endX
      this.moveY = endY
    }
  }

  private async handleMouseUp(event: MouseEvent) {
    event.stopPropagation()
    if (this.isMouseDownFiredByNode) {
      this.isMouseDownFiredByNode = false
      // polling when position changed really not fired by click event
      this.posX = this.positionTransformX(event.clientX)
      this.posY = this.positionTransformY(event.clientY)
      const nodeId = this.activeNode.nodeId
      if (
        this.browserStartX !== event.clientX ||
        this.browserStartY !== event.clientY
      ) {
        if (!this.isLocked) {
          await UpdateNodePositionStore.request({
            graphId: this.graphId,
            nodeId,
            x: this.posX - this.distanceX,
            y: this.posY - this.distanceY
          })
        }
      } else {
        // if position not change, assert node click event happened, so show right param panel
        const { componentName, componentDesc } = this.activeNode
        ActiveNodeController.setState(nodeId, componentName, componentDesc)
        await this.$store.commit('showRightTableFold')
        ActiveGraphController.hide()
        await NodeParamStore.request(nodeId, 0)
      }
      this.lastNodeId = nodeId
      this.activeEdgeId = 0
    } else if (this.isMouseDownFiredByLine) {
      if (!this.isLocked) {
        this.isMouseDownFiredByLine = false
        this.activeSlotType = ''
        const el = (event as MouseEvent).target as SVGCircleElement
        if (el.tagName === 'circle') {
          const status = el.dataset.status
          if (status === 'enable') {
            const ids = (el.dataset.id as string).split('-')
            const { 0: toNodeId, 1: toSlotId } = ids
            if (this.fromSlotId !== Number(toSlotId)) {
              await AddEdgeStore.request({
                graphId: this.graphId,
                fromNodeId: this.fromNodeId,
                fromSlotId: this.fromSlotId,
                toNodeId: Number(toNodeId),
                toSlotId: Number(toSlotId)
              })
            }
          }
        }
        CreateLineController.reset()
      }
    } else if (this.isMouseDownFiredByDrag) {
      this.translateX =
        (event as MouseEvent).clientX - this.moveX + this.translateX
      this.translateY =
        (event as MouseEvent).clientY - this.moveY + this.translateY
      this.isMouseDownFiredByDrag = false
    }
  }

  private mounted() {
    document.addEventListener('keydown', this.handleKeyUp, true)
  }

  private beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyUp)
  }

  @Watch('scale')
  private watchScale() {
    PositionTransformController.set('scale', this.scale)
  }
  @Watch('translateX')
  private watchTranslateX() {
    PositionTransformController.set('translateX', this.translateX)
  }
  @Watch('translateY')
  private watchTranslateY() {
    PositionTransformController.set('translateY', this.translateY)
  }
}
</script>
