<template>
  <div class="graph-content-wrap">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      ref="svg"
      @dragover="e => e.preventDefault()"
      @drop="handleDrop"
      @contextmenu="e => e.preventDefault()"
      width="100%"
      height="100%"
    >
      <g
        :style="{
          transform: `scale(${transform.scale}) translate3D(${transform.translateX}px, ${transform.translateY}px, 0)`,
          transformOrigin: 'center'
        }"
        v-if="graph"
      >
        <Edge v-for="item in edges" :key="item.edgeId" :edge="item" />
        <Node
          v-for="item in nodes"
          :key="item.nodeId"
          :node="item"
          :nodeInfo="nodeInfo"
          :selectedNodes="selectedNodes"
        />

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

        <NewEdge :path="newEdgePath" />
      </g>
      <path
        :d="brushPath"
        style="fill: #4E73FF; stroke: #606BE1; stroke-width:1px; opacity:0.3"
      />
    </svg>

    <ToolBox
      :isBrushing="isBrushing"
      @clickBrush="
        value => {
          this.isBrushing = value
        }
      "
    />
    <Menu ref="menu"></Menu>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import GraphStore from '@/stores/graph'
import { ComponentListStore } from '@/stores/component-list'
import Node from '@/components/node.vue'
import Edge from '@/components/edge.vue'
import NewEdge from '@/components/new-edge.vue'
import ToolBox from '@/components/tool-box.vue'
import Menu from '@/components/menu.vue'
import { calculateCurve } from '@/assets/js/utils'

import Graph from '@datafe/graph-core'

@Component({
  components: {
    NewEdge,
    Edge,
    Node,
    ToolBox,
    Menu
    // GraphGroupNode,
    // GraphGroup
  }
})
export default class GraphContent extends Vue {
  @Prop({
    required: true
  })
  data!: IGraphDataType

  @Prop()
  nodeStyle!: INodeStyle

  componentState = ComponentListStore.state

  graph: any = null

  nodeInfo = {
    width: 190,
    height: 35
  }

  nodes: INodeType[] = []
  edges: IEdgeType[] = []
  selectedNodes: INodeType[] = []
  transform = {
    scale: 1,
    translateX: 0,
    translateY: 0
  }
  isBrushing = false
  brushPath = ''
  newEdgePath = ''

  get dragingInfo() {
    return this.componentState.dragingInfo
  }

  handleDrop(e: DragEvent) {
    e.preventDefault()
    const { clientX: x, clientY: y } = e
    const posX = x - this.dragingInfo.offsetX * this.graph.getZoom()
    const posY = y - this.dragingInfo.offsetY * this.graph.getZoom()

    // 这块参数可以只传 nodeId, 其余节点信息后端存有
    this.graph.addNode({
      nodeId: Number(posX + '' + posY),
      nodeName: this.dragingInfo.component.componentName,
      nodeDesc: this.dragingInfo.component.componentDesc,
      posX,
      posY
    })
  }

  mounted() {
    this.graph = new Graph({
      container: this.$refs.svg as SVGElement,
      drection: 'LR',
      nodeInfo: {
        width: this.nodeInfo.width,
        height: this.nodeInfo.height
      },
      action: [
        'drag-svg',
        'drag-node',
        'click-select',
        'create-edge',
        'wheel-move',
        'wheel-zoom',
        'brush-select',
        'right-click'
      ]
    })

    this.graph.data(this.data)

    this.initCustomHooks()
  }

  initCustomHooks() {
    const hooks = [
      'afteraddnode',
      'nodeselectchange',
      'aftertranslate',
      'afterzoom',
      'afteraddedge',
      'brushing',
      'mouseup',
      'showmenu',
      'afterremovenode',
      'afterremoveedge',
      'addingEdge'
    ]
    hooks.forEach(hook => {
      this.graph.on(hook, (this as any)[hook])
    })
  }

  brushing(path: string) {
    this.brushPath = path
  }

  mouseup() {
    if (this.graph.getBrushing()) {
      this.graph.setBrushing(false)
      this.isBrushing = false
    }
  }

  addingEdge(createEdge: any) {
    this.nodes = this.graph.getNodes()
    const { source, target } = createEdge
    this.newEdgePath = calculateCurve(source.x, source.y, target.x, target.y)
  }

  afteraddnode(item: INodeType) {
    this.nodes = this.graph.getNodes()
  }

  afteraddedge(item: IEdgeType) {
    this.edges = this.graph.getEdges()
  }

  afterremovenode() {
    this.nodes = this.graph.getNodes()
    this.edges = this.graph.getEdges()
  }

  afterremoveedge() {
    this.edges = this.graph.getEdges()
  }

  nodeselectchange(nodes: INodeType[]) {
    this.selectedNodes = nodes
  }

  aftertranslate(x: number, y: number) {
    this.transform.translateX = x
    this.transform.translateY = y
  }

  afterzoom(zoom: number) {
    this.transform.scale = zoom
  }

  beforeDestroy() {
    this.graph.destroy()
  }

  showmenu(menu: IMenu) {
    ;(this.$refs.menu as Menu).showMenu(menu)
  }
}
</script>

<style lang="scss" scoped>
.graph-content-wrap {
  background: url('../assets/imgs/grid.svg') no-repeat center rgba(20, 40, 60);
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
