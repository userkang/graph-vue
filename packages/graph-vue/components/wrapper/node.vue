<template>
  <g v-if="!node.hasState('hide')">
    <g :transform="`translate(${node.x}, ${node.y})`">
      <foreignObject
        overflow="visible"
        :width="node.width"
        :height="node.height"
        graph-type="node"
        :graph-id="node.id"
      >
        <slot></slot>
      </foreignObject>
    </g>
    <Port v-for="port in node.slots" :key="port.id" :port="port">
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
export default class NodeWrapper extends Vue {
  @Prop({
    required: true
  })
  node!: INode
}
</script>
