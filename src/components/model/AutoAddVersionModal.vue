<template>
  <dmc-modal v-model="localShow" title="自动添加版本" width="400px" @ok="handleSubmit">
    <InfoItem label="版本个数">
      <MtdInput v-model="count" type="number" />
    </InfoItem>
  </dmc-modal>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import InfoItem from '@/components/InfoItem.vue'
@Component({
  components: {
    InfoItem,
    CommonModal
  }
})
export default class AutoAddVersionModal extends Vue {
  @Prop({
    default: false,
    type: Boolean
  })
  visible!: boolean

  private count = 5

  get localShow() {
    return this.visible
  }

  set localShow(v: boolean) {
    this.$emit('update:visible', v)
  }

  private handleSubmit() {
    this.$emit('submit', this.count)
  }
}
</script>
