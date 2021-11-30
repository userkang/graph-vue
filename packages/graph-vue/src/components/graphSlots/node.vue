<template>
  <div class="node"></div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Node extends Vue {}
</script>

<style scoped>
.node {
  width: 100%;
  height: 100%;
  background-color: green;
}
</style>
