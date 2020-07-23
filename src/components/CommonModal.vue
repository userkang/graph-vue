<template>
  <MtdModal
    v-model="localShow"
    :placement="placement"
    :title="title"
    :width="width"
    destroy-on-close
    @close="handleClose"
    @open="handleOpen"
  >
    <template slot="title">
      <slot name="title"></slot>
    </template>
    <slot></slot>
    <template slot="footer">
      <slot name="footer"></slot>
    </template>
  </MtdModal>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class CommonModal extends Vue {
  @Prop({
    type: String,
    default: 'top'
  })
  private placement!: string

  @Prop({
    type: String,
    required: true
  })
  private title!: string

  @Prop({
    type: String,
    default: '600px'
  })
  private width!: string

  @Prop({
    type: Boolean,
    default: true
  })
  private show!: boolean

  get localShow() {
    return this.show
  }

  set localShow(v: boolean) {
    this.$emit('show', v)
  }

  private handleClose() {
    this.$emit('close')
  }

  private handleOpen() {
    this.$emit('open')
  }
}
</script>
