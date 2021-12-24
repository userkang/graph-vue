<template>
  <g>
    <foreignObject
      :transform="`translate(${node.x}, ${node.y})`"
      :width="node.width"
      :height="node.height"
      graph-type="node"
      :graph-id="node.id"
    >
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        class="graph-node"
        :style="{
          'border-color': isNodeSelected ? '#606BE1' : '#DEDFEC',
          background: isNodeSelected
            ? 'rgba(185,200,245,0.9)'
            : 'rgba(252,252,251,0.9)'
        }"
      >
        <template v-if="hasDefaultSlot">
          <slot></slot>
        </template>
        <template v-else>
          {{ node.model.label }}
        </template>
      </div>
    </foreignObject>

    <slot name="port"></slot>
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import port from '@/components/port.vue'
import GraphContent from './graph.vue'
import { hasSlot } from '@/assets/js/utils'

@Component({
  components: {
    port
  }
})
export default class Node extends Vue {
  @Prop({
    required: true
  })
  node!: any

  get graph() {
    return (this.$parent as GraphContent).graph
  }

  get hasDefaultSlot() {
    return hasSlot.call(this, 'default')
  }

  get hasSlotSlot() {
    return hasSlot.call(this, 'port')
  }

  get isNodeSelected() {
    return this.node.hasState('selected')
  }

  created() {
    console.log(this.$slots)
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
.w-100 {
  width: 100%;
}
.h-100 {
  height: 100%;
}
</style>
