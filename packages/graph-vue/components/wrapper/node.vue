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
    <Port v-for="port in node.ports" :key="port.id" :port="port">
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
  refresh() {
    this.$forceUpdate()
  }
  created() {
    this.node.on('port:added', this.refresh)
    this.node.on('port:change', this.refresh)
    this.node.on('port:deleted', this.refresh)
  }
  beforeDestroy() {
    this.node.off('port:added', this.refresh)
    this.node.off('port:change', this.refresh)
    this.node.off('port:deleted', this.refresh)
  }
}
</script>
