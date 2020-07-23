<template>
  <div class="text flex">
    <div class="flex-v-center">
      <div class="block"></div>
      <div>{{title}}</div>
    </div>
    <div class="flex-item">
      <slot name="content" class="flex-item">
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class InfoTitle extends Vue {
  @Prop({
    type: String
  })
  title!: string
}
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
  color: #666666;
  margin-bottom: 10px;
  font-weight: 800;
}
.block {
  display: inline-block;
  width: 3px;
  height: 12px;
  text-align: middle;
  margin-right: 6px;
  background: #606be1;
}
</style>
