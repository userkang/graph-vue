<template>
  <defs>
    <marker
      id="arrow"
      overflow="visible"
      orient="auto"
      refX="-5"
      markerUnits="userSpaceOnUse"
    >
      <path
        class="arrow-style"
        transform="rotate(180)"
        d="M 0 0 L 7 -3.5 L 5.25 0 L 7 3.5 Z"
      ></path>
      <marker
        id="arrow-active"
        overflow="visible"
        orient="auto"
        refX="-5"
        markerUnits="userSpaceOnUse"
      >
        <path
          class="arrow-selected"
          transform="rotate(180)"
          d="M 0 0 L 7 -3.5 L 5.25 0 L 7 3.5 Z"
        ></path>
      </marker>
    </marker>
  </defs>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Arrow extends Vue {}
</script>

<style lang="scss" scoped>
$edge-color: #d1d1dd;
$select-color: #4150f6;
.arrow-style {
  stroke: $edge-color;
  fill: $edge-color;
}
.arrow-selected {
  stroke: $select-color;
  fill: $select-color;
}
</style>
