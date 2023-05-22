<template>
  <g v-if="!edge.hasState('hide')" graph-type="edge" :graph-id="edge.id">
    <slot></slot>
  </g>
</template>

<script>
export default {
  props: ['edge']
}
</script>
