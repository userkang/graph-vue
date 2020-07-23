<template>
  <div class="empty-icon"></div>
</template>

<style lang="scss" scoped>
.empty-icon {
  position: relative;
  margin: 10px auto;
  width: 100px;
  height: 110px;
  background-image: url(../../static/imgs/empty.png);
  background-size: 80px 72px;
  background-repeat: no-repeat;
  background-position: 10px 0;
  &:after {
    position: absolute;
    content: '暂无数据';
    font-size: 14px;
    color: #999;
    bottom: 12px;
    left: -12px;
    width: 100%;
    text-align: center;
  }
}
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class EmptyIcon extends Vue {}
</script>
