<template>
  <li class="info-item">
    <label :style="{width: labelWidth}">{{label}}:</label>
    <div class="content-slot" :style="{'flex-basis': `calc(100% - ${labelWidth})`}">
      <slot />
    </div>
  </li>
</template>

<style lang="scss" scoped>
.info-item {
  display: flex;
  margin-bottom: 12px;
  font-size: 13px;
  label {
    color: #999999;
    text-align: right;
    margin-right: 20px;
    word-break: break-word;
  }
  .content-slot {
    color: #666666;
    text-align: left;
    word-break: break-word;
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class InfoItem extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private label!: string

  @Prop({
    type: String,
    default: '70px'
  })
  private labelWidth!: string
}
</script>
