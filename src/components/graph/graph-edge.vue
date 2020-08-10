<template>
  <g
    stroke-width="2"
    stroke="#000"
    fill="transparent"
    @contextmenu.capture="showMenuTips"
  >
    <path
      :d="calculateCurve(this.x1, this.y1, this.x2, this.y2)"
      :data-id="edge.edgeId"
      fill="none"
      :class="lineClassName"
    ></path>
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { calculateCurve } from '@/assets/js/utils'
import { DagStore } from '@/stores/graph/dag'

@Component
export default class GraphEdge extends Vue {
  @Prop({
    required: true
  })
  edge!: IEdgeType

  @Prop({
    type: Boolean
  })
  isActiveEdge!: boolean

  @Prop({
    required: true
  })
  rectInfo!: IRectInfo

  dagState = DagStore.state
  path = ''
  calculateCurve = calculateCurve

  get lineClassName() {
    return this.isActiveEdge ? 'edge-selected-style' : 'edge-style'
  }

  get nodes() {
    return this.dagState.dag.nodes
  }

  get fromNode(): INodeType[] {
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

  showMenuTips(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    this.$emit('contextMenu', {
      show: true,
      x: e.x,
      y: e.y,
      data: this.edge.edgeId,
      type: 'edge'
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
