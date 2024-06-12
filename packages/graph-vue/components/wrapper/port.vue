<template>
  <g
    graph-type="port"
    :graph-id="port.id"
    :transform="`translate(${port.offsetX}, ${port.offsetY})`"
  >
    <slot :port="port"></slot>
  </g>
</template>

<script>
export default {
  props: ['port']
}
</script>
