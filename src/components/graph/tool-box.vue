<template>
  <div class="scale-panel" @click="handleChange">
    <li id="expand">+</li>
    <li id="shrink">-</li>
    <li id="reset" class="iconfont icon-huiguiyuanwei">归</li>
    <li
      id="select"
      :class="{ select: isSelecting }"
      class="iconfont icon-kuangxuan"
    >
      选
    </li>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ITransform } from '../../types/dag'

@Component
export default class ToolBox extends Vue {
  @Prop({
    required: true
  })
  isSelecting!: boolean

  handleChange(e: MouseEvent) {
    this.$emit('click', e)
  }
}
</script>

<style lang="scss" scoped>
.scale-panel {
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  background: #f7f9ff;
  border: 1px solid #e8ecfa;
  color: #8a94c2;
  font-weight: 600;
  width: 130px;
  font-size: 18px;
  & > li {
    display: flex;
    height: 30px;
    align-items: center;
    justify-content: center;
    flex: 1;
    border-right: 1px solid #e8ecfa;
    cursor: pointer;
    &:last-child {
      border-right: none;
    }
    &:hover {
      background: $l2;
    }
  }
  .select {
    color: #ff9801;
  }
}
</style>
