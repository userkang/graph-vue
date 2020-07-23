<template>
  <dmc-modal v-model="localShow" title="同步版本" width="500px" @ok="handleSubmit">
    <InfoItem label="目的模型">
      <mtd-select v-model="value" style="width: 200px">
        <mtd-option v-for="item in list" :key="item.id" :label="item.modelName" :value="item.id" />
      </mtd-select>
    </InfoItem>
  </dmc-modal>
</template>

<style lang="scss" scoped>
.info-item {
  line-height: 34px;
}
</style>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import InfoItem from '@/components/InfoItem.vue'
import { SyncModelType } from '@/types/model'

@Component({
  components: {
    CommonModal,
    InfoItem
  }
})
export default class VersionSyncModal extends Vue {
  @Prop({
    default: false,
    type: Boolean
  })
  visible!: boolean

  @Prop({
    type: Number,
    required: true
  })
  private versionId!: number
  @Prop({
    type: Array,
    required: true
  })
  private list!: SyncModelType[]

  private value = ''

  get localShow() {
    return this.visible
  }

  set localShow(v: boolean) {
    this.$emit('update:visible', v)
  }

  private handleSubmit() {
    this.$emit('submit', {
      versionId: this.versionId,
      targetModelId: this.value
    })
  }
}
</script>
