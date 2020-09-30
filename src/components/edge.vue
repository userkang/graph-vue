<template>
  <g data-type="edge" :data-item="JSON.stringify(edge)">
    <path
      stroke-width="2"
      :d="calculateCurve(this.x1, this.y1, this.x2, this.y2)"
      :data-id="edge.edgeId"
      fill="transparent"
      :class="lineClassName"
      @contextmenu.capture="showMenuTips"
    ></path>
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { calculateCurve } from '@/assets/js/utils'
import GraphContent from './graph.vue'
import Graph from '@/controller/graph'

@Component
export default class Edge extends Vue {
  @Prop({
    required: true
  })
  edge!: IEdgeType

  path = ''
  calculateCurve = calculateCurve
  fromNode!: INodeType
  toNode!: INodeType
  x1 = 0
  x2 = 0
  y1 = 0
  y2 = 0
  activeEdgeId = 0

  get graph(): Graph {
    return (this.$parent as GraphContent).graph
  }

  get nodeInfo() {
    return (this.$parent as GraphContent).nodeInfo
  }

  get lineClassName() {
    return this.activeEdgeId === this.edge.edgeId
      ? 'edge-selected-style'
      : 'edge-style'
  }

  showMenuTips(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    this.$emit('contextMenu', e, 'edge', this.edge)
  }

  changePosition() {
    this.fromNode = this.graph.findNode(this.edge.fromNodeId)
    this.toNode = this.graph.findNode(this.edge.toNodeId)
    this.x1 = this.fromNode.posX + this.nodeInfo.width / 2
    this.x2 = this.toNode.posX + this.nodeInfo.width / 2
    this.y1 = this.fromNode.posY + this.nodeInfo.height
    this.y2 = this.toNode.posY
  }

  mounted() {
    this.changePosition()

    this.graph.on('dragingnode', () => {
      this.changePosition()
    })

    this.graph.on('afteraddedge', () => {
      this.changePosition()
    })

    this.graph.on('edgeselectchange', (item: IEdgeType) => {
      this.activeEdgeId = item.edgeId as number
    })
  }
}
</script>

<style lang="scss" scoped>
.edge-style {
  stroke: #d1d1d1;
  stroke-width: 2;
  stroke-linecap: round;
  &:hover {
    stroke: #4150f6;
    stroke-width: 2.5;
    cursor: pointer;
  }
}

.edge-selected-style {
  stroke: #4150f6;
  stroke-width: 2.5;
  cursor: pointer;
}
</style>
