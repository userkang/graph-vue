<template>
  <CommonModal placement="top" title="一键分组" width="450px" @close="handleClose">
    <MtdForm :model="groupingForm" :labelWidth="120" :rules="groupingRule">
      <MtdFormItem label="分片数">
        <MtdInput style="width: 220px" disabled v-model="shardNum" />
      </MtdFormItem>
      <MtdFormItem label="当前已有机器数">
        <MtdInput style="width: 220px" disabled v-model="machineNum" />
      </MtdFormItem>
      <MtdFormItem label="副本数量" required prop="groupNum">
        <MtdInput style="width: 220px" v-model="groupingForm.groupNum" placeholder="请输入需要创建的副本数量" />
      </MtdFormItem>
      <MtdFormItem label="所需机器数">
        <MtdInput style="width: 220px" disabled v-model="needMachineNum" />
        <div v-if="showWarning" style="color: red;font-size: 12px">所需机器数多于已有机器数，请修改副本数量！</div>
      </MtdFormItem>
    </MtdForm>

    <div class="handle-panel">
      <MtdButton class="submit-btn" @click="handleSubmit" :disabled="isSubmitDisabled">创建</MtdButton>
      <MtdButton class="cancel-btn gap" @click="handleClose">取消</MtdButton>
    </div>
  </CommonModal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import {
  MLXClusterMachineListStore,
  MLXClusterDuplicationStore
} from '@/stores/service/MLXCluster'

@Component({
  components: {
    CommonModal
  }
})
export default class GroupingModal extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private clusterId!: string

  @Prop({
    type: Number,
    required: true
  })
  private shardNum!: number

  @Prop({
    type: Number,
    required: true
  })
  private machineNum!: number

  private groupingForm = {
    groupNum: ''
  }

  private showWarning = false

  get groupingRule() {
    const rules: any = {}
    rules.groupNum = [
      {
        required: true,
        message: '请填写副本数量'
      },
      {
        validator: this.validateNum
      }
    ]

    return rules
  }

  get needMachineNum() {
    const needNum = this.shardNum * Number(this.groupingForm.groupNum)
    if (needNum > this.machineNum) {
      this.showWarning = true
    } else {
      this.showWarning = false
    }
    return needNum
  }

  get isSubmitDisabled() {
    if (!this.groupingForm.groupNum || this.showWarning) {
      return true
    }
    return false
  }

  private validateNum(rule: string, value: string, cb: (msg?: string) => void) {
    if (/^\d+$/.test(value)) {
      cb()
    } else {
      this.groupingForm.groupNum =
        value.match(/\d+/) === null ? '' : String(value.match(/\d+/))
      cb('只能填入数字')
    }
  }

  private handleClose() {
    this.$emit('close')
  }

  private async handleSubmit() {
    const msg = await MLXClusterMachineListStore.groupingMachine(
      this.clusterId,
      this.groupingForm.groupNum
    )
    if (msg) {
      this.handleClose()
      this.$mtd.message({
        message: msg,
        type: 'success',
        showClose: true
      })
      MLXClusterMachineListStore.getMachineList(this.clusterId)
      MLXClusterDuplicationStore.request(this.clusterId)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>