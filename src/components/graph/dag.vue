<template>
  <div class="graph-content-wrap">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      ref="graphContent"
      @click.capture="handleClick"
      @mousedown="setDragStart"
      @mousemove.capture="handleMouseMove"
      @mouseup.capture="handleMouseUp"
      @contextmenu.capture="preventDefaultContext"
      @mousewheel="handleMouseWheel"
      @drop="handleDrop"
      width="100%"
      height="100%"
    >
      <g
        :style="{
          transform: `scale(${transform.scale}) translate3D(${transform.translateX}px, ${transform.translateY}px, 0)`
        }"
      >
        <template>
          <GraphNode
            v-for="item in nodes"
            :key="item.nodeId"
            :node="item"
            :isNodeActive="isNodeActive(item.id)"
            @mousedown="position => handleNodeClick(item, position)"
            @dblclick.native="handleDoubleClick"
          />
        </template>

        <!-- <template v-if="nodeGroups">
          <GraphGroup
            v-for="(group, index) in nodeGroups"
            :key="group.id"
            :group="group"
            :index="index"
            :groupPosition="groupPosition"
            :fromNodeId="fromNodeId"
            @mousedown="setDragGroupStart"
            @handleNodeClick="handleNodeClick"
            @handleDoubleClick="handleDoubleClick"
          />
        </template> -->

        <template>
          <GraphEdge
            v-for="item in edges"
            :key="item.id"
            :edge="item"
            :isActiveEdge="activeEdgeId === item.id"
            :refresh="isRefreshEdge"
            @edgeClick="handleEdgeClick"
            @delete="deleteLine"
          />
        </template>
        <NewGraphEdge />
      </g>
      <!-- <path
        id="zoom_area"
        :d="pathRect"
        style="fill: #4E73FF; stroke: #606BE1; stroke-width:1px; opacity:0.3"
      /> -->
    </svg>
    <!-- <EmptyGraph v-if="workflowId === 0" /> -->
    <!-- <ScalePanel @scaleChange="handleScaleChange" /> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { DagStore } from '@/stores/graph/dag'
import { ComponentListStore } from '@/stores/graph/component-list'
import { NodeStore } from '@/stores/graph/node'
import GraphNode from '@/components/graph/graph-node.vue'

@Component({
  components: {
    // EmptyGraph,
    // LoadingIcon,
    // ScalePanel,
    // NewGraphEdge,
    // GraphEdge,
    GraphNode
    // GraphGroupNode,
    // GraphGroup
  }
})
export default class GraphContent extends Vue {
  dagState = DagStore.state
  componentState = ComponentListStore.state
  svg!: HTMLElement

  get nodes() {
    return this.dagState.dag.nodes
  }

  get edges() {
    return this.dagState.dag.edges
  }

  get transform() {
    return this.dagState.transfrom
  }

  get dragingInfo() {
    return this.componentState.dragingInfo
  }

  handleClick(event: MouseEvent) {
    // event.stopPropagation();
    if ((event.target as SVGElement).tagName === 'svg') {
      // MenuTipsController.hide()
      // ActiveGraphController.show()
      // this.activeEdgeId = 0
      // this.lastNodeId = 0
    }
  }

  setDragStart(event: MouseEvent) {
    // this.isMouseDownFiredByDrag = true
    // this.moveX = event.clientX
    // this.moveY = event.clientY
  }

  async handleMouseUp(event: MouseEvent) {
    // event.stopPropagation()
    // if (this.isMouseDownFiredByNode) {
    //   this.isMouseDownFiredByNode = false
    //   // polling when position changed really not fired by click event
    //   this.posX = this.positionTransformX(event.clientX)
    //   this.posY = this.positionTransformY(event.clientY)
    //   const nodeId = this.activeNode.nodeId
    //   if (
    //     this.browserStartX !== event.clientX ||
    //     this.browserStartY !== event.clientY
    //   ) {
    //     if (!this.isLocked) {
    //       await UpdateNodePositionStore.request({
    //         graphId: this.graphId,
    //         nodeId,
    //         x: this.posX - this.distanceX,
    //         y: this.posY - this.distanceY
    //       })
    //     }
    //   } else {
    //     // if position not change, assert node click event happened, so show right param panel
    //     const { componentName, componentDesc } = this.activeNode
    //     ActiveNodeController.setState(nodeId, componentName, componentDesc)
    //     await this.$store.commit('showRightTableFold')
    //     ActiveGraphController.hide()
    //     await NodeParamStore.request(nodeId, 0)
    //   }
    //   this.lastNodeId = nodeId
    //   this.activeEdgeId = 0
    // } else if (this.isMouseDownFiredByLine) {
    //   if (!this.isLocked) {
    //     this.isMouseDownFiredByLine = false
    //     this.activeSlotType = ''
    //     const el = (event as MouseEvent).target as SVGCircleElement
    //     if (el.tagName === 'circle') {
    //       const status = el.dataset.status
    //       if (status === 'enable') {
    //         const ids = (el.dataset.id as string).split('-')
    //         const { 0: toNodeId, 1: toSlotId } = ids
    //         if (this.fromSlotId !== Number(toSlotId)) {
    //           await AddEdgeStore.request({
    //             graphId: this.graphId,
    //             fromNodeId: this.fromNodeId,
    //             fromSlotId: this.fromSlotId,
    //             toNodeId: Number(toNodeId),
    //             toSlotId: Number(toSlotId)
    //           })
    //         }
    //       }
    //     }
    //     CreateLineController.reset()
    //   }
    // } else if (this.isMouseDownFiredByDrag) {
    //   this.translateX =
    //     (event as MouseEvent).clientX - this.moveX + this.translateX
    //   this.translateY =
    //     (event as MouseEvent).clientY - this.moveY + this.translateY
    //   this.isMouseDownFiredByDrag = false
    // }
  }

  async handleMouseMove(event: MouseEvent) {
    // event.stopPropagation()
    // const posX = this.positionTransformX(event.clientX)
    // const posY = this.positionTransformY(event.clientY)
    // if (this.isMouseDownFiredByNode) {
    //   this.posX = posX
    //   this.posY = posY
    //   await this.setNodePosition(
    //     this.posX - this.distanceX,
    //     this.posY - this.distanceY
    //   )
    // } else if (this.isMouseDownFiredByLine) {
    //   this.createNewLine(posX, posY)
    // } else if (this.isMouseDownFiredByDrag) {
    //   const { clientX: endX, clientY: endY } = event
    //   this.translateX = endX - this.moveX + this.translateX
    //   this.translateY = endY - this.moveY + this.translateY
    //   this.moveX = endX
    //   this.moveY = endY
    // }
  }

  preventDefaultContext(event: MouseEvent) {
    event.preventDefault()
  }

  handleMouseWheel(event: WheelEvent) {
    // this.handleScaleChange(event.deltaY > 0 ? 'shrink' : 'expand', 0.01)
  }

  handleDragOver(event: DragEvent) {
    // 阻止默认动作以启用drop
    event.preventDefault()
  }

  async handleDrop(e: DragEvent) {
    e.preventDefault()
    if ((e.target as SVGElement).id === 'graphContent') {
      const { clientX: x, clientY: y } = e
      const posX = 0 //this.positionTransformX(x) - this.dragingInfo.offsetX
      const posY = 0 //this.positionTransformY(y) - this.dragingInfo.offsetY
      console.log()

      NodeStore.addNode({
        nodeId: this.dragingInfo.component.componentId,
        nodeName: this.dragingInfo.component.componentName,
        nodeDesc: this.dragingInfo.component.componentDesc,
        posX: 0,
        posY: 0
      })
      // const data = await AddNodeStore.request({
      //   componentId: this.componentId,
      //   workflowId: this.workflowId,
      //   posX,
      //   posY
      // })
      // ActiveNodeStore.setState(data)
      // this.$emit('addNode')
      // tslint:disable-next-line
    }
  }

  mounted() {
    this.svg = this.$refs.graphContent as HTMLElement
  }

  beforeDestory() {
    this.svg.removeEventListener('dragover', this.handleDragOver)
  }
}
</script>

<style lang="scss" scoped>
.graph-content-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
  .loading-wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fff;
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
