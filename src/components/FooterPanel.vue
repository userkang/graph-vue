<template>
  <footer class="footer-panel">
    <slot />
  </footer>
</template>

<style lang="scss" scoped>
.footer-panel {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  padding-top: 10px;
  padding-right: 20px;
  background-color: #fff;
  justify-content: flex-end;
  box-shadow: 0 -1px 4px 0 rgba(39, 60, 111, 0.1);
  z-index: 10;
}
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class FooterPanel extends Vue {}
</script>
