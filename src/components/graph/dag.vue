<template>
  <div class="graph-content-wrap">
    <svg
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
      @mouseleave="handleMouseLeave"
      width="100%"
      height="100%"
    >
      <g
        :style="{
          transform: `scale(${scale}) translate3D(${translateX}px, ${translateY}px, 0)`,
          transformOrigin: 'center'
        }"
      >
        <template v-if="nodes">
          <GraphNode
            v-for="item in nodes"
            :key="item.nodeId"
            :node="item"
            :fromNodeId="fromNodeId"
            :isLocked="isLocked"
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
      <path
        id="zoom_area"
        :d="pathRect"
        style="fill: #4E73FF; stroke: #606BE1; stroke-width:1px; opacity:0.3"
      />
    </svg>
    <!-- <EmptyGraph v-if="workflowId === 0" /> -->
    <!-- <ScalePanel @scaleChange="handleScaleChange" /> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { DagStore } from '@/stores/graph/dag'
// import {
//   UpdateNodePositionStore,
//   AddEdgeStore,
//   DeleteEdgeStore,
//   DeleteNodeStore
// // } from '@/stores/workflow/graphVisual/GraphVisual'
// import {
//   ActiveNodeController,
//   MenuTipsController,
//   CreateLineController,
//   PositionTransformController,
//   WarningTipsController
// } from '@/stores/workflow/graphVisual/LocalState'
// import {
//   GraphRequestStore,
//   GraphVisualStore
// } from '@/stores/workflow/graphVisual/GraphContent'
// import {
//   AddEdgePositionType,
//   GraphItemType,
//   NodeVoType,
//   PositionType
// } from '../../types/graph'
// import { NodeDevelopDetailStore } from '@/stores/workflow/createNode/nodeDevelopDetail'

// import GraphNode from '@/components/workflow/GraphNode.vue'
// import GraphEdge from '@/components/workflow/GraphEdge.vue'
// import NewGraphEdge from '@/components/workflow/NewGraphEdge.vue'
// import ScalePanel from '@/components/workflow/ScalePanel.vue'
// import LoadingIcon from '@/components/LoadingIcon.vue'
// import EmptyGraph from '@/components/workflow/EmptyGraph.vue'
// import { SwitchGraphController } from '@/stores/workflow/graphVisual/SwitchGraph'
// import { ActiveWorkflowStore } from '@/stores/workflow/graphVisual/activeWorkflow'
// import { ActiveNodeStore } from '@/stores/workflow/graphVisual/activeNode'
// import GraphGroupNode from '@/components/workflow/GraphGroupNode.vue'
// import GraphGroup from '@/components/workflow/GraphGroup.vue'

@Component({
  components: {
    // EmptyGraph,
    // LoadingIcon,
    // ScalePanel,
    // NewGraphEdge,
    // GraphEdge,
    // GraphNode,
    // GraphGroupNode,
    // GraphGroup
  }
})
export default class GraphContent extends Vue {
  // private graphContentState = GraphVisualStore.state
  // private switchGraphState = SwitchGraphController.state
  // private activeNodeState = ActiveNodeStore.state
  private isMouseDownFiredByNode = false
  private isMouseDownFiredByLine = false
  private isMouseDownFiredByDrag = false
  private activeNode!: Workflow.WorkflowNodeVo
  private activeEdgeId: number = 1
  private fromNodeId = 0
  private browserStartX = 0
  private browserStartY = 0
  private moveX = 0
  private moveY = 0
  private scale = 1
  private scaleOffset = {
    x: 0,
    y: 0
  }
  private rect!: HTMLElement
  private pathRect = ''
  private svg!: HTMLElement
  // 框选盒子实体参数
  private box = {
    boxing: false,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0
  }
  // 计算框选范围时，用来保存变换方向后的中间变量
  private range = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0
  }
  // 节点宽
  private nodeWidth = 198
  // 节点高
  private nodeHeight = 34
  private groupRect!: HTMLElement
  private groupNode!: HTMLElement
  private moveNodes: Workflow.WorkflowNodeVo[] = []
  private activeNodeSelected = false
  private groupPosition: { [key: string]: number[] } = {
    startX: [],
    startY: [],
    endX: [],
    endY: []
  }

  get translateX() {
    return Number(this.graphContentState.transform.translateX)
  }

  set translateX(v: number) {
    this.graphContentState.transform.translateX = String(v)
  }

  get translateY() {
    return Number(this.graphContentState.transform.translateY)
  }

  set translateY(v: number) {
    this.graphContentState.transform.translateY = String(v)
  }

  get nodes() {
    return this.graphContentState.nodes
  }

  get nodeGroups() {
    return this.graphContentState.nodeGroups
  }

  get lastNodeId() {
    return this.activeNodeState.selectNodeIds
  }

  set lastNodeId(v) {
    ActiveNodeStore.setSelectNodeIds(v)
  }

  get edges() {
    return this.graphContentState.edges
  }

  get isFold() {
    return this.switchGraphState.isLeftNavFold
  }

  get isLocked() {
    return !this.switchGraphState.isCurrentGraphCanBeEdit
  }

  get workflowId() {
    return this.switchGraphState.activeGraphExec.workflowId
  }

  get isRefreshEdge() {
    return this.graphContentState.isRefreshEdge
  }

  get loadingStatus() {
    return this.graphContentState.loadingStatus
  }

  get isEditGroup() {
    return this.graphContentState.isEditGroup
  }

  get selecting() {
    return this.graphContentState.selecting
  }

  private isNodeActive(id: number) {
    for (const item of this.lastNodeId) {
      if (item.id === id) {
        return true
      }
    }

    return false
  }

  private handleEdgeClick(edgeId: number) {
    this.activeEdgeId = edgeId
    this.lastNodeId = []
  }

  private handleClick(event: MouseEvent) {
    if ((event.target as SVGElement).tagName === 'svg') {
      ActiveWorkflowStore.show()
      this.activeEdgeId = 0

      // 如果鼠标未拖动，将选中节点清空
      if (
        !Math.abs(this.browserStartX - event.x) &&
        !Math.abs(this.browserStartY - event.y)
      ) {
        this.lastNodeId = []
      }
    }
  }

  private async handleKeyUp(event: KeyboardEvent) {
    event.stopPropagation()
    const tagName = (event.target as HTMLBodyElement).tagName
    if (tagName === 'BODY' && !this.isLocked) {
      if (['Delete', 'Backspace'].includes(event.key)) {
        if (this.activeEdgeId) {
          await DeleteEdgeStore.request({
            workflowId: this.workflowId,
            edgeId: this.activeEdgeId
          })
          this.activeEdgeId = 0
        }
        if (this.lastNodeId.length) {
          await DeleteNodeStore.request({
            workflowId: this.workflowId,
            nodes: this.lastNodeId
          })
          this.lastNodeId = []
        }
      }
    }
  }

  private async deleteLine() {
    await DeleteEdgeStore.request({
      workflowId: this.workflowId,
      edgeId: this.activeEdgeId
    })
    this.activeEdgeId = 0
  }

  private handleMouseWheel(event: WheelEvent) {
    event.preventDefault()
    if (event.deltaX) {
      this.translateX -= event.deltaX
    }
    if (event.deltaY) {
      this.translateY -= event.deltaY
    }
    // this.handleScaleChange(event.deltaY > 0 ? 'shrink' : 'expand', 0.01)
  }

  private handleScaleChange(scaleType: string, radio = 0.1) {
    if (scaleType === 'expand' && this.scale < 2) {
      this.scale += radio
    } else if (scaleType === 'shrink' && this.scale > 0.4) {
      this.scale -= radio
    } else if (scaleType === 'reset') {
      this.scale = 1
      this.scaleOffset.x = 0
      this.scaleOffset.y = 0
      this.translateX = 0
      this.translateY = 0
    }

    this.scaleOffset.x =
      (this.svg.getBoundingClientRect().width * (this.scale - 1)) / 2
    this.scaleOffset.y =
      (this.svg.getBoundingClientRect().height * (this.scale - 1)) / 2
  }

  private preventDefaultContext(event: MouseEvent) {
    event.preventDefault()
  }

  private positionTransformX(originValue: number) {
    const posX = originValue - this.svg.getBoundingClientRect().x
    return (posX + this.scaleOffset.x) / this.scale - this.translateX
  }

  private positionTransformY(originValue: number) {
    const posY = originValue - this.svg.getBoundingClientRect().y
    return (posY + this.scaleOffset.y) / this.scale - this.translateY
  }

  private async setNodePosition(moveX: number, moveY: number) {
    if (!this.isLocked) {
      GraphVisualStore.updateNodePosition({
        nodes: this.moveNodes,
        moveX,
        moveY
      })
    }
  }

  private createNewLine(x: number, y: number) {
    if (!this.isLocked) {
      CreateLineController.move(x, y)
    }
  }

  private setDragGroupStart(
    event: MouseEvent,
    nodes: Workflow.WorkflowNodeVo[]
  ) {
    event.stopPropagation()
    this.moveX = this.browserStartX = event.x
    this.moveY = this.browserStartY = event.y

    this.isMouseDownFiredByNode = true
    this.moveNodes = nodes.map(item => {
      item.startX = item.posX
      item.startY = item.posY
      return item
    })
  }

  private setDragStart(event: MouseEvent) {
    event.stopPropagation()
    this.moveX = this.browserStartX = event.x
    this.moveY = this.browserStartY = event.y

    if (this.isEditGroup || this.selecting) {
      this.box.boxing = true
      this.box.startX = event.clientX - this.svg.getBoundingClientRect().x
      this.box.startY = event.clientY - this.svg.getBoundingClientRect().y
    } else {
      this.isMouseDownFiredByDrag = true
    }
  }

  private async handleDoubleClick() {
    if (!this.activeNode.bindTask) {
      ActiveNodeStore.setState(this.activeNode)
      this.$emit('addNode')
    } else {
      const categoryType = this.activeNode.categoryType
      const openNewTab = ['XT', 'MSP'].includes(categoryType)
      const pathParams = {
        workflowId: String(this.workflowId),
        nodeId: String(this.activeNode.id)
      }

      if (openNewTab) {
        // TODO：待XT平台支持 https 后修改
        const taskUrl = await NodeDevelopDetailStore.getTaskUrl(pathParams)
        if (taskUrl) {
          window.open(taskUrl)
        }
      } else {
        this.$router.push({
          name: 'nodeDevelopDetail',
          params: pathParams,
          query: {
            // 用来从目标页面再跳回来
            from: this.$route.query.name,
            fromWorkflow: pathParams.workflowId
          }
        })
      }
    }
  }

  private async handleNodeClick(
    node: Workflow.WorkflowNodeVo,
    position: PositionType | AddEdgePositionType
  ) {
    this.activeNode = node
    // 判断当前正在移动节点是否被选中
    for (const item of this.lastNodeId) {
      if (item.id === this.activeNode.id) {
        this.activeNodeSelected = true
        break
      }
    }
    // 保存起始坐标，计算拖动后节点坐标使用，拖动后坐标 = 起始坐标 + 拖动距离
    if (this.activeNodeSelected) {
      this.moveNodes = this.lastNodeId.map(item => {
        item.startX = item.posX
        item.startY = item.posY
        return item
      })
    } else {
      this.activeNode.startX = node.posX
      this.activeNode.startY = node.posY
      this.moveNodes = [this.activeNode]
    }

    if (position.type === 'node') {
      this.isMouseDownFiredByNode = true
      this.browserStartX = position.x
      this.browserStartY = position.y
      this.moveX = position.x
      this.moveY = position.y
    } else if (position.type === 'line') {
      const edgePosition = position as AddEdgePositionType
      this.isMouseDownFiredByLine = true
      const posX = this.positionTransformX(edgePosition.x)
      const posY = this.positionTransformY(edgePosition.y)
      this.createNewLine(posX, posY)
      this.fromNodeId = edgePosition.fromNodeId
      GraphVisualStore.setSlotActive(true)
    }
  }

  private async handleMouseMove(event: MouseEvent) {
    event.stopPropagation()
    const posX = this.positionTransformX(event.clientX)
    const posY = this.positionTransformY(event.clientY)
    if (this.isMouseDownFiredByNode) {
      // 移动的距离
      await this.setNodePosition(
        (event.clientX - this.moveX) / this.scale,
        (event.clientY - this.moveY) / this.scale
      )
      this.renderGroupRect()
      WarningTipsController.hide()
    } else if (this.isMouseDownFiredByLine) {
      this.createNewLine(posX, posY)
    } else if (this.isEditGroup || this.selecting) {
      if (this.box.boxing) {
        this.box.endX = event.clientX - this.svg.getBoundingClientRect().x
        this.box.endY = event.clientY - this.svg.getBoundingClientRect().y
        this.pathRect = `M${this.box.startX},${this.box.startY}H${this.box.endX}V${this.box.endY}H${this.box.startX}Z`
        this.checkSelected()
      }
    } else if (this.isMouseDownFiredByDrag) {
      const { clientX: endX, clientY: endY } = event
      this.translateX = endX - this.moveX + this.translateX
      this.translateY = endY - this.moveY + this.translateY
      this.moveX = endX
      this.moveY = endY
    }
  }

  private checkSelected() {
    // 从左上->右下，不要交换
    this.range = JSON.parse(JSON.stringify(this.box))
    // 左下->右上
    if (this.box.endX > this.box.startX && this.box.endY < this.box.startY) {
      this.range.startY = this.box.endY
      this.range.endY = this.box.startY
    }
    // 右上->左下
    if (this.box.endX < this.box.startX && this.box.endY > this.box.startY) {
      this.range.startX = this.box.endX
      this.range.endX = this.box.startX
    }
    // 右下->左上
    if (this.box.endX < this.box.startX && this.box.endY < this.box.startY) {
      this.range.startX = this.box.endX
      this.range.startY = this.box.endY
      this.range.endX = this.box.startX
      this.range.endY = this.box.startY
    }

    let nodes
    // 如果是框选操作，节点组下的节点也需要合并进去
    if (this.selecting) {
      let groupNodes: Workflow.WorkflowNodeVo[] = []
      this.graphContentState.nodeGroups.forEach(item => {
        if (item.nodes.length) {
          groupNodes = groupNodes.concat(item.nodes)
        }
      })
      nodes = groupNodes.concat(this.graphContentState.nodes)
    } else {
      nodes = this.graphContentState.nodes
    }

    this.lastNodeId = nodes
      .filter(item => {
        return this.checkNodeRange(item)
      })
      .map(item => {
        // 将起始节点坐标保存
        item.startX = item.posX
        item.startY = item.posY
        return item
      })
  }

  private checkNodeRange(item: Workflow.WorkflowNodeVo) {
    if (
      item.posY + this.nodeHeight <
      (this.range.startY + this.scaleOffset.y) / this.scale - this.translateY
    ) {
      return false
    } else if (
      item.posY >
      (this.range.endY + this.scaleOffset.y) / this.scale - this.translateY
    ) {
      return false
    } else if (
      item.posX + this.nodeWidth <
      (this.range.startX + this.scaleOffset.x) / this.scale - this.translateX
    ) {
      return false
    } else if (
      item.posX >
      (this.range.endX + this.scaleOffset.x) / this.scale - this.translateX
    ) {
      return false
    } else {
      return true
    }
  }

  private async handleMouseUp(event: MouseEvent) {
    event.stopPropagation()
    if (this.isMouseDownFiredByNode) {
      this.isMouseDownFiredByNode = false
      this.activeNodeSelected = false
      if (
        this.browserStartX !== event.clientX ||
        this.browserStartY !== event.clientY
      ) {
        if (!this.isLocked) {
          await UpdateNodePositionStore.request(this.workflowId, this.moveNodes)
        }
      } else if (
        this.activeNode &&
        (event.target as SVGRectElement).dataset.type === 'node'
      ) {
        const nodeId = this.activeNode.id
        // if position not change, assert node click event happened, so show right param panel
        const { nodeName, nodeDesc } = this.activeNode
        ActiveNodeController.setState(nodeId, nodeName, nodeDesc)
        SwitchGraphController.showRightTableFold()
        ActiveWorkflowStore.hide()
        this.lastNodeId = []
        this.lastNodeId.push(this.activeNode)
      }
      this.activeEdgeId = 0
    } else if (this.isMouseDownFiredByLine) {
      if (!this.isLocked) {
        this.isMouseDownFiredByLine = false
        GraphVisualStore.setSlotActive(false)
        const el = (event as MouseEvent).target as SVGCircleElement
        if (el.tagName === 'circle') {
          const status = el.dataset.status
          if (status === 'enable') {
            const toNodeId = el.dataset.id
            await AddEdgeStore.request({
              id: this.activeNode.id,
              nodeGroupId: 0,
              workflowId: this.workflowId,
              fromNodeId: this.fromNodeId,
              toNodeId: Number(toNodeId)
            })
          }
        }
        CreateLineController.reset()
      }
    } else if (this.isEditGroup || this.selecting) {
      this.box.boxing = false
      this.rect.setAttribute('d', '')
      this.graphContentState.selecting = false
    } else if (this.isMouseDownFiredByDrag) {
      this.translateX = event.clientX - this.moveX + this.translateX
      this.translateY = event.clientY - this.moveY + this.translateY
      this.isMouseDownFiredByDrag = false
      if (
        event.clientX - this.browserStartX ||
        event.clientY - this.browserStartY
      ) {
        ActiveWorkflowStore.update({
          workflowId: this.workflowId,
          transform: `${this.translateX},${this.translateY}`
        })
      }
    }
  }

  private handleMouseLeave() {
    if (this.isEditGroup || this.selecting) {
      this.box.boxing = false
      this.rect.setAttribute('d', '')
    }
    this.isMouseDownFiredByDrag = false
    this.isMouseDownFiredByNode = false
  }

  // 渲染节点组外边框
  private renderGroupRect() {
    this.nodeGroups.forEach((item, index) => {
      const nodes = item.nodes
      if (nodes.length) {
        let [startX, startY, endX, endY] = [
          nodes[0].posX,
          nodes[0].posY,
          nodes[0].posX,
          nodes[0].posY
        ]

        for (let i = 1; i < nodes.length; i++) {
          if (nodes[i].posX < startX) {
            startX = nodes[i].posX
          }
          if (nodes[i].posY < startY) {
            startY = nodes[i].posY
          }
          if (nodes[i].posX > endX) {
            endX = nodes[i].posX
          }
          if (nodes[i].posY > endY) {
            endY = nodes[i].posY
          }
        }

        this.groupPosition.startX[index] = startX
        this.groupPosition.startY[index] = startY
        this.groupPosition.endX[index] = endX
        this.groupPosition.endY[index] = endY
        this.groupPosition = JSON.parse(JSON.stringify(this.groupPosition))
      }
    })
  }

  private create() {
    DagStore.getDagContent()
  }

  private mounted() {
    document.addEventListener('keydown', this.handleKeyUp, true)
    this.svg = document.getElementById('graphContent') as HTMLElement
    this.rect = document.getElementById('zoom_area') as HTMLElement
  }

  private beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyUp)
  }

  // @Watch('nodeGroups')
  // private watchLoadingStatus() {
  //   if (this.graphContentState.loadingStatus === 'LOADED') {
  //     this.graphContentState.isRefreshEdge = false
  //     this.$nextTick(() => {
  //       this.lastNodeId = []
  //       this.renderGroupRect()
  //       this.graphContentState.isRefreshEdge = true
  //     })
  //   }
  // }
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

<style lang="scss" scoped>
.graph-content-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
  padding-top: 44px;
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
