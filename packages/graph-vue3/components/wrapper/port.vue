<template>
  <g
    graph-type="port"
    :graph-id="port.id"
    :transform="`translate(${port.x}, ${port.y})`"
  >
    <slot :port="port"></slot>
  </g>
</template>

<script>
import { defineComponent } from 'vue-demi'

export default defineComponent({
  props: ['port']
})
</script>
