<template>
  <div class="empty">
    <div class="empty-icon"></div>
    <div class="empty-desc">
      <slot v-if="$slots.default"></slot>
      <template v-else>暂无数据</template>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Empty extends Vue {}
</script>

<style lang="scss" scoped>
.empty {
  padding: 30px 0;
  text-align: center;

  &-icon {
    width: 119px;
    height: 91px;
    margin: 0 auto;
    background: url(../assets/empty.png) no-repeat center / contain;
  }

  &-desc {
    margin-top: 10px;
    color: #6f6f6f;
  }
}
</style>