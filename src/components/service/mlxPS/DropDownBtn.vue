<template>
  <button class="pull-down-btn">
    <span class="title">{{title}}</span>
    <span class="handle-icon-wrap">
      <i class="iconfont icon-daohangxialasanjiao"></i>
    </span>
  </button>
</template>

<style lang="scss" scoped>
.pull-down-btn {
  height: 34px;
  width: 130px;
  color: #fff;
  background: #828dc4;
  border: none;
  &:active {
    outline: none;
  }
  &:focus {
    outline: none;
  }
  .title {
    padding: 0 12px;
    border-right: 1px #747fb9 solid;
  }
  .handle-icon-wrap {
    margin-left: 10px;
    text-align: center;
    color: #fff;
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class PullDownBtn extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private title!: string
}
</script>
