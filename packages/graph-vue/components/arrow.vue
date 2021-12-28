<template>
  <defs>
    <marker
      id="arrow"
      overflow="visible"
      orient="auto"
      refX="-2"
      markerUnits="userSpaceOnUse"
    >
      <path
        class="graph-arrow"
        transform="rotate(180)"
        d="M 0 0 L 7 -3.5 L 5.25 0 L 7 3.5 Z"
      ></path>
      <marker
        id="arrow-active"
        overflow="visible"
        orient="auto"
        refX="-2"
        markerUnits="userSpaceOnUse"
      >
        <path
          class="graph-arrow-active"
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
