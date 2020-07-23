<template>
  <section class="service-detail-header">
    <div class="title-part">
      <slot name="title"></slot>
    </div>
    <div class="handle-part">
      <slot name="handle"></slot>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.service-detail-header {
  height: 40px;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  .title-part {
    text-align: left;
    flex: 1;
  }
  .handle-part {
    display: flex;
  }
  .new-ps {
    position: relative;
  }
  .btn-tips {
    white-space: nowrap;
    margin-top: 10px;
    margin-left: -20px;
    position: absolute;
    font-size: 12px;
    color: #606be1;
    z-index: 10;
    user-select: none;
    cursor: pointer;
    font-weight: 600;
  }
}
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class ServiceDetailHeader extends Vue {}
</script>
