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
    <LinkSlot
      :node="node"
      :graph="graph"
      isInOrOut="in"
      @mouseup="handleSlotMouseUp"
    />
    <LinkSlot
      :node="node"
      :graph="graph"
      isInOrOut="out"
      @mousedown="handleSlotMouseDown"
    />
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import LinkSlot from '@/components/link-slot.vue'

@Component({
  components: {
    LinkSlot
  }
})
export default class Node extends Vue {
  @Prop({
    required: true
  })
  node!: INodeType

  @Prop({
    required: true
  })
  graph: any

  get rectInfo() {
    return this.graph.viewController.rectInfo
  }

  get isNodeSelected() {
    return this.graph.eventController.isNodeSelected(this.node.nodeId)
  }

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
    this.$emit('contextMenu', e, 'node', this.node)
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
