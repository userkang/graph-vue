<template>
  <CommonModal placement="top" title="添加机器资源" width="600px" @close="handleClose">
    <div>
      <InfoItem label="机器信息">
        <div style="max-height: 50vh; overflow-y: auto">
          <MtdTable :data="machineList">
            <MtdTableColumn label="IP" prop="host">
              <template slot-scope="scope">
                <MtdInput v-model="scope.row.host" size="small" class="machine-item-input" />
              </template>
            </MtdTableColumn>
            <MtdTableColumn label="端口" prop="port">
              <template slot-scope="scope">
                <MtdInput v-model="scope.row.port" size="small" class="machine-item-input" />
                <i
                  class="iconfont icon-biaoqianguanbi"
                  style="display: inline-block; cursor: pointer; margin-left: 10px;color: #D7DAE2;"
                  @click="removeMachine(scope.$index)"
                ></i>
              </template>
            </MtdTableColumn>
          </MtdTable>
        </div>
      </InfoItem>
      <MtdButton size="small" @click="appendMachine">
        <i class="iconfont icon-jiqi-fangda" style="font-size: 12px"></i>
        添加
      </MtdButton>
    </div>

    <div class="handle-panel">
      <MtdButton class="submit-btn" @click="handleSubmit" :disabled="isSubmitDisabled">添加</MtdButton>
      <MtdButton class="cancel-btn gap" @click="handleClose">取消</MtdButton>
    </div>
  </CommonModal>
</template>

<style lang="scss" scoped>
.machine-item-input {
  width: 140px;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import InfoItem from '@/components/InfoItem.vue'
import { ipRegexp, portRegexp } from '@/common/utils'
import {
  ClusterMachineInfo,
  MLXClusterMachineListStore
} from '@/stores/service/MLXCluster'

@Component({
  components: {
    InfoItem,
    CommonModal
  }
})
export default class AddMachineModal extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private clusterId!: string

  private duplicationName = ''
  private ipRegexp = ipRegexp
  private portRegexp = portRegexp
  private machineList: ClusterMachineInfo[] = []

  get isSubmitDisabled() {
    if (this.machineList.length < 1) {
      return true
    }
    return false
  }

  private handleClose() {
    this.$emit('close')
  }

  private checkMachineList() {
    // tslint:disable-next-line
    const ipReg = /^([1-9]|([1-9][0-9])|(1[0-9][0-9])|(2[0-4][0-9])|(25[0-5]))(\.([0-9]|([1-9][0-9])|(1[0-9][0-9])|(2[0-4][0-9])|(25[0-5]))){3}$/

    for (const item of this.machineList) {
      if (!ipReg.test(item.host)) {
        this.$mtd.message({
          type: 'warning',
          message: '其中IP格式错误'
        })
        return false
      }

      if (
        isNaN(Number(item.port)) ||
        (!isNaN(Number(item.port)) && Number(item.port) > 65536)
      ) {
        this.$mtd.message({
          type: 'warning',
          message: '其中端口格式错误'
        })
        return false
      }
    }
    return true
  }

  private async handleSubmit() {
    if (!this.checkMachineList()) {
      return
    }

    const res = await MLXClusterMachineListStore.addMachine(
      this.clusterId,
      this.machineList
    )

    if (res.code === 0) {
      this.$mtd.message({
        message: '添加成功',
        type: 'success'
      })
      await MLXClusterMachineListStore.getMachineList(this.clusterId)
      this.handleClose()
    }
  }

  private appendMachine() {
    this.machineList.push({
      seq: this.machineList.length + 1,
      host: '',
      port: ''
    })
  }

  private removeMachine(index: number) {
    this.machineList.splice(index, 1)
  }
}
</script>
