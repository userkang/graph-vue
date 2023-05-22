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
export default {
  props: ['port']
}
</script>
