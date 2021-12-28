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
        :class="{ 'graph-node-active': node.hasState('selected') }"
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
    console.log(this.node.hasState('selected'))
    return this.node.hasState('selected')
  }
}
</script>
