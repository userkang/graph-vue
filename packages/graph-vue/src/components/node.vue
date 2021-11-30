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
        <div v-if="hasDefaultSlot" class="w-100 h-100">
          <!-- 有slot -->
          <slot></slot>
        </div>
        <div v-else>
          <!-- 无slot -->
          {{ node.model.label }}
        </div>
      </div>
    </foreignObject>
    <LinkSlot v-for="slot in node.slots" :key="slot.id" :item="slot" />
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
  node!: any

  get graph() {
    return (this.$parent as GraphContent).graph
  }

  get hasDefaultSlot() {
    return (
      Reflect.has(this.$slots, 'default') ||
      Reflect.has(this.$scopedSlots, 'default')
    )
  }

  get isNodeSelected() {
    return this.node.hasState('selected')
  }

  mounted() {
    // console.log(this.$slots)
    // console.log(this.$scopedSlots)
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
