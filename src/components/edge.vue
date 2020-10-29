<template>
  <g data-type="edge" :data-item="JSON.stringify(edge)">
    <path
      stroke-width="2"
      :d="
        calculateCurve(
          edge.source.x,
          edge.source.y,
          edge.target.x,
          edge.target.y
        )
      "
      :data-id="edge.edgeId"
      fill="transparent"
      :class="lineClassName"
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

  get lineClassName() {
    return this.activeEdgeId === this.edge.edgeId
      ? 'edge-selected-style'
      : 'edge-style'
  }

  // changePosition() {
  //   this.fromNode = this.graph.findNode(this.edge.fromNodeId)
  //   this.toNode = this.graph.findNode(this.edge.toNodeId)
  //   const fromNodeSlots = this.graph.getSlotPoint(this.fromNode)
  //   const toNodeSlots = this.graph.getSlotPoint(this.toNode)
  //   this.x1 = fromNodeSlots['out'][0]
  //   this.x2 = toNodeSlots['in'][0]
  //   this.y1 = fromNodeSlots['out'][1]
  //   this.y2 = toNodeSlots['in'][1]
  // }

  mounted() {
    // this.changePosition()

    // this.graph.on('dragingnode', () => {
    //   this.changePosition()
    // })

    // this.graph.on('afteraddedge', () => {
    //   this.changePosition()
    // })

    // this.graph.on('afterlayout', () => {
    //   this.changePosition()
    // })

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
