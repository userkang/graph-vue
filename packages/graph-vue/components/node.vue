<template>
  <g>
    <foreignObject
      :transform="`translate(${node.x}, ${node.y})`"
      :width="node.width"
      :height="node.height"
      graph-type="node"
      :graph-id="node.id"
    >
      <template v-if="$slots.default">
        <slot></slot>
      </template>
      <div
        v-else
        class="graph-node"
        :style="{
          'border-color': isNodeSelected ? '#606BE1' : '#DEDFEC',
          background: isNodeSelected
            ? 'rgba(185,200,245,0.9)'
            : 'rgba(252,252,251,0.9)'
        }"
      >
        {{ node.model.label }}
      </div>
    </foreignObject>

    <Port v-for="port in node.slots" :key="port.id" :item="port">
      <slot name="port" :port="port"></slot>
    </Port>
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { INode } from '@datafe/graph-core'
import Port from './port.vue'

@Component({
  components: {
    Port
  }
})
export default class Node extends Vue {
  @Prop({
    required: true
  })
  node!: INode

  get isNodeSelected() {
    return this.node.hasState('selected')
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
