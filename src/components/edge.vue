<template>
  <path
    stroke-width="2"
    @click="clickEdge"
    :d="calculateCurve(this.x1, this.y1, this.x2, this.y2)"
    :data-id="edge.edgeId"
    fill="transparent"
    :class="lineClassName"
    @contextmenu.capture="showMenuTips"
  ></path>
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

  get graph(): Graph {
    return (this.$parent as GraphContent).graph
  }

  get activeEdgeId() {
    return this.graph.eventController.activeEdgeId
  }

  get lineClassName() {
    return this.activeEdgeId === this.edge.edgeId
      ? 'edge-selected-style'
      : 'edge-style'
  }

  get rectInfo() {
    return this.graph.viewController.rectInfo
  }

  get nodes() {
    return this.graph.nodes
  }

  get fromNode() {
    return this.nodes.filter(item => {
      return item.nodeId === this.edge.fromNodeId
    })
  }

  get toNode() {
    return this.nodes.filter(item => {
      return item.nodeId === this.edge.toNodeId
    })
  }

  get x1() {
    return this.fromNode[0].posX + this.rectInfo.width / 2
  }

  get x2() {
    return this.toNode[0].posX + this.rectInfo.width / 2
  }

  get y1() {
    return this.fromNode[0].posY + this.rectInfo.height
  }

  get y2() {
    return this.toNode[0].posY
  }

  clickEdge(e: MouseEvent) {
    console.log(e)
  }

  showMenuTips(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    this.$emit('contextMenu', e, 'edge', this.edge)
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
