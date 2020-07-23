<template>
  <span class="nav-corner"></span>
</template>

<style lang="scss">
.nav-corner {
  display: inline-block;
  background-color: #606be1;
  width: 4px;
  height: 38px;
  clip-path: polygon(0 4px, 3px 5px, 4px 6px, 4px 32px, 3px 33px, 0 34px);
  margin-right: 14px;
}
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class NavCorner extends Vue {}
</script>
