<template>
  <g
    v-if="!node.hasState('hide')"
    :transform="`translate(${node.x}, ${node.y})`"
  >
    <g>
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
    <PortWrapper v-for="port in node.ports" :key="port.id" :port="port">
      <slot name="port" :port="port"></slot>
    </PortWrapper>
  </g>
</template>

<script>
import PortWrapper from './port.vue'

export default {
  components: { PortWrapper },
  props: ['node']
}
</script>
