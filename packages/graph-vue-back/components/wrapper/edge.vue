<template>
  <g v-if="!edge.hasState('hide')" graph-type="edge" :graph-id="edge.id">
    <slot></slot>
  </g>
</template>

<script>
import { defineComponent } from 'vue-demi'

export default defineComponent({
  props: ['edge']
})
</script>
