<template>
  <g @mousedown="handleNodeMouseDown" @contextmenu.capture="showMenuTips">
    <rect
      ref="node"
      data-type="node"
      class="graph-node"
      :style="{
        stroke: isNodeSelected ? '#606BE1' : '#DEDFEC',
        fill: isNodeSelected ? 'rgba(220,223,245,0.8)' : 'rgba(252,252,251,0.8)'
      }"
      :width="rectInfo.width"
      :height="rectInfo.height"
      :x="node.posX"
      :y="node.posY"
      :rx="rectInfo.rx"
      :ry="rectInfo.ry"
    ></rect>
    <foreignObject
      :x="node.posX"
      :y="node.posY"
      :width="rectInfo.width"
      :height="rectInfo.height"
    >
      <div class="node-content">{{ node.nodeName }}</div>
    </foreignObject>
    <GraphSlot
      :node="node"
      :fromNodeId="fromNodeId"
      isInOrOut="in"
      :rectInfo="rectInfo"
      @mouseup="handleSlotMouseUp"
    />
    <GraphSlot
      :node="node"
      :fromNodeId="fromNodeId"
      isInOrOut="out"
      :rectInfo="rectInfo"
      @mousedown="handleSlotMouseDown"
    />
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import GraphSlot from '@/components/graph/graph-slot.vue'

@Component({
  components: {
    GraphSlot
  }
})
export default class GraphNode extends Vue {
  @Prop({
    required: true
  })
  node!: INodeType

  @Prop({
    required: true,
    type: Number
  })
  fromNodeId!: number

  @Prop({
    required: true,
    type: Boolean
  })
  isNodeSelected!: boolean

  @Prop({
    required: true
  })
  rectInfo!: IRectInfo

  handleNodeMouseDown(e: MouseEvent) {
    e.stopPropagation()
    if (e.button === 0) {
      this.$emit('mouseDownNode', e, this.node)
    }
  }

  handleSlotMouseDown(e: MouseEvent) {
    this.$emit('mouseDownSlot', e, this.node)
  }

  handleSlotMouseUp(e: MouseEvent) {
    this.$emit('mouseUpSlot', e, this.node)
  }

  showMenuTips(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    this.$emit('contextMenu', {
      show: true,
      x: e.x,
      y: e.y,
      data: this.node.nodeId,
      type: 'node'
    })
  }
}
</script>

<style lang="scss" scoped>
.graph-node {
  stroke-width: 1;
  cursor: pointer;
  @keyframes rotate {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
.node-content {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #666;
  cursor: pointer;
}
</style>
