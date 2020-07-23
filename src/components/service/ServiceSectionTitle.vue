<template>
  <div class="service-section-title">
    <h4 :style="{'text-align': isLeftAlign && 'left'}">
      <span class="slide"></span>
      {{title}}
    </h4>
    <div class="handle">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../static/css/variable';
.service-section-title {
  display: flex;
  padding-bottom: 8px;
  align-items: center;
  .slide {
    display: inline-block;
    background-color: $highlight-color;
    width: 3px;
    height: 12px;
    margin-top: 6px;
    margin-right: 7px;
  }
  h4 {
    font-size: 14px;
    font-weight: 600;
    line-height: 24px;
    height: 24px;
    flex-basis: 140px;
    color: #666666;
  }
  .handle {
    display: flex;
    flex: 1;
    flex-direction: row-reverse;
    align-items: center;
    color: blue;
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ServiceSectionTitle extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private title!: string

  @Prop({
    type: Boolean,
    default: false
  })
  private isLeftAlign!: boolean
}
</script>
