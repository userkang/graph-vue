<template>
  <nav class="back-nav">
    <span @click="handleClick" class="title">
      <i class="iconfont icon-fanhuiliebiao" style="font-size: 12px; color: #969ACB"></i>
      <slot v-if="$slots.title" name="title" />
      <template v-else>{{title}}</template>
    </span>
    <div class="handle">
      <slot name="handle" />
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.back-nav {
  position: absolute;
  display: flex;
  right: 0;
  top: 0;
  width: 100%;
  height: 42px;
  line-height: 42px;
  padding-left: 30px;
  font-size: 14px;
  color: #747da3;
  box-shadow: 0 1px 3px 0 rgba(39, 60, 111, 0.1);
  i {
    display: inline;
    margin-right: 7px;
  }
  .title {
    cursor: pointer;
    text-align: left;
    font-size: 14px;
  }
  .handle {
    flex: 1;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    padding-right: 30px;
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class BackNav extends Vue {
  @Prop({
    type: String,
    default: '返回'
  })
  private title!: string

  private handleClick() {
    this.$emit('click')
  }
}
</script>
