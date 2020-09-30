<template>
  <g>
    <foreignObject
      :x="node.posX"
      :y="node.posY"
      :width="nodeInfo.width"
      :height="nodeInfo.height"
      data-type="node"
      :data-item="JSON.stringify(node)"
    >
      <div
        class="graph-node"
        :style="{
          'border-color': isNodeSelected ? '#606BE1' : '#DEDFEC',
          background: isNodeSelected
            ? 'rgba(220,223,245,0.9)'
            : 'rgba(252,252,251,0.9)'
        }"
      >
        {{ node.nodeName }}
      </div>
    </foreignObject>
    <LinkSlot :node="node" isInOrOut="in" />
    <LinkSlot :node="node" isInOrOut="out" />
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import LinkSlot from '@/components/link-slot.vue'
import GraphContent from './graph.vue'

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

  @Prop()
  selectedNodes!: INodeType[]

  get nodeInfo() {
    return (this.$parent as GraphContent).nodeInfo
  }

  get graph() {
    return (this.$parent as GraphContent).graph
  }

  get isNodeSelected() {
    return this.nodeSelected(this.node.nodeId)
  }

  nodeSelected(id: number) {
    for (const item of this.selectedNodes) {
      if (item.nodeId === id) {
        return true
      }
    }

    return false
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
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #666;
  border-width: 1px;
  border-style: solid;
  border-radius: 2px;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
