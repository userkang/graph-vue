<template>
  <section class="bottom-btn-panel">
    <slot></slot>
  </section>
</template>

<style lang="scss" scoped>
.bottom-btn-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  height: 50px;
  box-shadow: 0 -1px 4px 0 rgba(39, 60, 111, 0.1);
  display: flex;
  flex-direction: row-reverse;
  padding: 8px 30px;
  background: #fff;
}
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class BottomBtnPanel extends Vue {}
</script>
