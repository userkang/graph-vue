<template>
  <li class="env-banner-wrap" :class="{'selected': isSelected}">
    <div class="title" :class="{'selected': isSelected}">
      <i class="iconfont icon-fabu"></i>
      {{env}}环境
    </div>
    <p class="desc">{{desc}}</p>
  </li>
</template>

<style lang="scss" scoped>
@import '../../../../static/css/variable';
.env-banner-wrap {
  display: inline-block;
  width: 140px;
  height: 72px;
  margin-right: 14px;
  padding-top: 13px;
  text-align: center;
  box-sizing: border-box;
  border-radius: 1px;
  border: 1px solid #d3d8e4;
  &:hover {
    box-shadow: 0 2px 5px 0 rgba(12, 15, 50, 0.24);
  }
  &.selected {
    border-top: 2px solid $highlight-color;
  }
  .title {
    display: flex;
    justify-content: center;
    color: #302c6e;
    font-size: 14px;
    &.selected {
      color: $highlight-color;
    }
    i {
      color: inherit;
      margin-right: 12px;
    }
  }
  .desc {
    color: #adadad;
    font-size: 12px;
    margin-top: 5px;
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TFEnvBanner extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private env!: string

  @Prop({
    type: String,
    required: true
  })
  private desc!: string

  @Prop({
    type: Boolean,
    required: true
  })
  private isSelected!: boolean
}
</script>
