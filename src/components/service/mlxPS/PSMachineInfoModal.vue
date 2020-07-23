<template>
  <CommonModal title="机器信息" placement="top" width="500px" @close="handleClose">
    <div class="head-panel">
      <MtdButton
        id="copyMachineBtn"
        type="text"
        class="highlight-text"
        @click="() => {this.$mtd.message('复制成功')}"
        :data-clipboard-text="psMachineText"
      >
        <i class="iconfont icon-chakanquanwen"></i>复制到剪贴板
      </MtdButton>
    </div>
    <MtdTable :data="psMachineValue" class="machine-table-wrap">
      <EmptyIcon slot="empty" />
      <MtdTableColumn label="机器" prop="host" />
      <MtdTableColumn label="端口" prop="port" />
    </MtdTable>
  </CommonModal>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Clipboard from 'clipboard'
import EmptyIcon from '@/components/EmptyIcon.vue'
import CommonModal from '@/components/CommonModal.vue'
import { PSMachineVoType } from '@/types/service'
@Component({
  components: {
    CommonModal,
    EmptyIcon
  }
})
export default class PSMachineInfoModal extends Vue {
  @Prop({
    type: Array,
    required: true
  })
  private psMachineValue!: PSMachineVoType[]

  @Prop({
    type: String,
    required: true
  })
  private psMachineText!: string

  private handleClose() {
    this.$emit('close')
  }

  private mounted() {
    const btnCopy = new Clipboard('#copyMachineBtn')
  }
}
</script>
