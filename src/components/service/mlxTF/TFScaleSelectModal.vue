<template>
  <CommonModal title="选择伸缩组" @close="handleClose">
    <MtdSelect filterable multiple clearable v-model="selectedScaleGroups" style="width:400px">
      <MtdOption
        v-for="scaleGroup in scaleGroups"
        :key="scaleGroup.id"
        :label="scaleGroup.name"
        :value="scaleGroup.id"
      />
    </MtdSelect>
    <div class="handle-panel has-top">
      <MtdButton class="submit-btn" @click="handleSubmit">确认</MtdButton>
      <MtdButton class="cancel-btn gap" @click="handleClose">取消</MtdButton>
    </div>
  </CommonModal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import { ScalingGroupVoType } from '@/types/mlxTF'

@Component({
  components: { CommonModal }
})
export default class TFScaleSelectModal extends Vue {
  @Prop({
    required: true
  })
  private scaleGroups!: ScalingGroupVoType[]

  private selectedScaleGroups: number[] = []

  private handleClose() {
    this.$emit('close')
  }

  private handleSubmit() {
    this.$emit('submit', this.selectedScaleGroups)
  }
}
</script>
