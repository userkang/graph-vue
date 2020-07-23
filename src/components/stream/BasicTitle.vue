<template>
  <p class="text">
    <span class="block"></span>
    {{text}}
  </p>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class BasicTitle extends Vue {
  @Prop({
    type: String
  })
  private text!: string
}
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
  color: #666666;
  margin-bottom: 10px;
}
.block {
  display: inline-block;
  width: 3px;
  height: 12px;
  text-align: middle;
  margin-right: 6px;
  background: #969acb;
}
</style>
