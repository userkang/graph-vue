<template>
  <div class="script-param" :class="{'disabled': disabled}">
    <h4>脚本{{param.value ? '脚本已填写' : '脚本未填写'}}</h4>
  </div>
</template>

<style lang="scss" scoped>
.script-param {
  width: 180px;
  height: 108px;
  border: 1px solid #dddeeb;
  border-radius: 1px;
  text-align: center;
  &.disabled {
    cursor: not-allowed;
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ParamVo } from '../../types/graph'

@Component
export default class ScriptParam extends Vue {
  @Prop({
    required: true
  })
  private param!: ParamVo

  @Prop({
    type: Boolean,
    required: true
  })
  private disabled!: boolean
}
</script>
