<template>
  <defs>
    <marker
      id="arrow"
      overflow="visible"
      orient="auto"
      markerUnits="userSpaceOnUse"
    >
      <path
        class="graph-vue-arrow"
        transform="rotate(180)"
        d="M 0 0 L 7 -3.5 L 5.25 0 L 7 3.5 Z"
      ></path>
    </marker>
  </defs>
</template>

<script>
import { defineComponent } from 'vue-demi'

export default defineComponent({})
</script>

<style lang="scss">
.graph-vue-arrow {
  stroke: #d1d1d9;
  fill: #d1d1d9;
}
</style>
