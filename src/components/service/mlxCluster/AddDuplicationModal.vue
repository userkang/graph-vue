<template>
  <CommonModal placement="top" title="添加副本" width="500px" @close="handleClose">
    <div>
      <mtd-form :model="form" ref="form" :label-width="88" :rules="formRules">
        <mtd-form-item required label="副本名:" prop="duplicationName">
          <MtdInput v-model="form.duplicationName" style="width: 300px" />
        </mtd-form-item>
      </mtd-form>
      <InfoItem label="机器信息">
        <div style="max-height: 50vh; overflow-y: auto; padding-right: 50px">
          <div class="info-title">机器名称</div>
          <div class="item-wrap" v-for="(item, key) in selectCount" :key="key">
            <MtdSelect type="text" v-model="selection[key]" size="small" style="width: 100%">
              <MtdOption
                v-for="item in machineList"
                :key="item.detailId"
                :label="`${item.name}(${item.host})`"
                :value="item.detailId"
              />
            </MtdSelect>
          </div>
        </div>
      </InfoItem>
    </div>

    <div class="handle-panel">
      <MtdButton class="submit-btn" @click="handleSubmit">添加</MtdButton>
      <MtdButton class="cancel-btn gap" @click="handleClose">取消</MtdButton>
    </div>
  </CommonModal>
</template>

<style lang="scss" scoped>
.machine-item-input {
  width: 140px;
}
.info-title {
  height: 30px;
  line-height: 30px;
  background: #edf0fa;
  text-align: center;
  color: #464646;
  font-size: 12px;
}
.item-wrap {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import InfoItem from '@/components/InfoItem.vue'
import {
  MLXClusterMachineListStore,
  MLXClusterDuplicationStore,
  MLXClusterDuplicationAddStore
} from '@/stores/service/MLXCluster'
import { ClusterMachineVoType } from '@/types/mlxCluster'

@Component({
  components: {
    InfoItem,
    CommonModal
  }
})
export default class AddDuplicationModal extends Vue {
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

  private form = {
    duplicationName: ''
  }
  private MLXClusterMachineListState = MLXClusterMachineListStore.state
  private selection: string[] = []

  get selectCount() {
    return Array.from(Array(this.shardNum))
  }

  get duplicationNameList() {
    return MLXClusterDuplicationStore.state.value.map(item => {
      return item.name
    })
  }

  get machineList() {
    const list = this.MLXClusterMachineListState.list.filter(
      (item: ClusterMachineVoType) => {
        if (item.federationId || this.selection.includes(item.detailId)) {
          return false
        } else {
          return true
        }
      }
    )
    return list
  }

  get formRules() {
    return {
      duplicationName: [
        {
          required: true,
          message: '请填写副本名'
        },
        {
          validator: this.validatorName
        }
      ]
    }
  }

  private validatorName(
    rule: string,
    value: string,
    cb: (msg?: string) => void
  ) {
    if (this.duplicationNameList.includes(value)) {
      cb('该副本名已存在')
    } else {
      cb()
    }
  }

  private handleClose() {
    this.$emit('close')
  }

  private async handleSubmit() {
    if (this.selection.length < this.shardNum) {
      this.$mtd.message({
        message: '请先选择机器信息',
        type: 'warning'
      })
      return
    }

    ;(this.$refs['form'] as any).validate(async (valid: boolean) => {
      if (valid) {
        await MLXClusterDuplicationAddStore.request({
          clusterId: this.clusterId,
          name: this.form.duplicationName,
          federationDetails: this.selection
        })

        MLXClusterDuplicationStore.request(this.clusterId)
        MLXClusterMachineListStore.getMachineList(this.clusterId)
        this.handleClose()
      }
    })
  }
}
</script>
