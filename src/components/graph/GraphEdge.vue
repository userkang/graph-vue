<template>
  <g stroke-width="2" stroke="#000" fill="transparent">
    <path
      :d="path"
      :data-id="edge.edgeId"
      stroke="blue"
      stroke-width="50"
      fill="none"
      :class="lineClassName"
      @click="handleClick"
    ></path>
    <image
      v-if="isActiveEdge && deleteX"
      @click="deleteLine"
      class="delete-icon"
      :xlink:href="deleteIcon"
      :x="deleteX"
      :y="deleteY"
    ></image>
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { EdgeVoType } from '../../types/graph'
import { calculateCurve } from '../../common/utils'
import jianzi from '../../assets/jianzi.svg'
import { DeleteEdgeStore } from '../../stores/graph/graphVisual/GraphVisual'

@Component
export default class GraphEdge extends Vue {
  @Prop({
    required: true
  })
  private edge!: EdgeVoType

  @Prop({
    type: Boolean
  })
  private isActiveEdge!: boolean

  @Prop({
    type: Boolean
  })
  private refresh!: boolean

  private path = ''

  private deleteX !: number
  private deleteY !: number
  private deleteIcon = jianzi

  get lineClassName() {
    return this.isActiveEdge ? 'edge-selected-style' : 'edge-style'
  }

  private handleClick() {
    this.$emit('edgeClick', this.edge.edgeId)
  }

  private async deleteLine() {
    this.$emit('delete')
  }


  @Watch('refresh')
  private handleRefresh(v: boolean) {
    setTimeout(() => {
      const { fromNodeId, fromSlotId, toNodeId, toSlotId } = this.edge
      const fromNode = document.querySelector(
        `[data-id="${fromNodeId}-${fromSlotId}"]`
      ) as SVGCircleElement
      const toNode = document.querySelector(
        `[data-id="${toNodeId}-${toSlotId}"]`
      ) as SVGCircleElement
      const x1 = Number(fromNode.getAttribute('cx'))
      const y1 = Number(fromNode.getAttribute('cy'))
      const x2 = Number(toNode.getAttribute('cx'))
      const y2 = Number(toNode.getAttribute('cy'))
      this.path = calculateCurve(x1, y1 + 3, x2, y2 - 3)
      this.deleteX = (x1 + x2) / 2 - 15
      this.deleteY = (y1 + y2) / 2 - 15
    }, 0)
  }

  private mounted() {
    this.handleRefresh(true)
  }
}
</script>

<style lang="scss" scoped>
.edge-style {
  stroke: #dedfec;
  stroke-width: 3;
  &:hover {
    stroke: #4150f6;
    stroke-width: 3;
    cursor: pointer;
  }
}

.edge-selected-style {
  stroke: #4150f6;
  stroke-width: 3;
  cursor: pointer;
}
.delete {
  height: 20px;
  width: 20px;
  font-size: 24px;
}
.delete-icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>