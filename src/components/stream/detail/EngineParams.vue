<template>
  <mtd-form :model="detail" :rules="detailRule" :label-width="180" ref="form">
    <div style="display: flex;">
      <mtd-form-item label="运行队列" prop="queue" required>
        <mtd-select v-model="detail.queue" style="width: 340px">
          <mtd-option v-for="item in queueList" :key="item" :label="item" :value="item"></mtd-option>
        </mtd-select>
      </mtd-form-item>
      <mtd-form-item label="JM内存/MB" prop="jmMem" required>
        <mtd-input v-model="detail.jmMem" style="width: 340px" type="number"></mtd-input>
      </mtd-form-item>
    </div>
    <div style="display: flex;">
      <mtd-form-item label="SAVEPOINT" prop="startType" required>
        <mtd-select v-model="detail.startType" style="width: 340px">
          <mtd-option
            v-for="item in savepointList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></mtd-option>
        </mtd-select>
      </mtd-form-item>
      <mtd-form-item label="TM数量" prop="tmNum" required>
        <mtd-input v-model="detail.tmNum" style="width: 340px" type="number"></mtd-input>
      </mtd-form-item>
    </div>
    <div style="display: flex;">
      <mtd-form-item label="并行度" prop="parallelism" required>
        <mtd-input v-model="detail.parallelism" style="width: 340px" type="number"></mtd-input>
      </mtd-form-item>
      <mtd-form-item label="TM内存" prop="tmMem" required>
        <mtd-input v-model="detail.tmMem" style="width: 340px" type="number"></mtd-input>
      </mtd-form-item>
    </div>
  </mtd-form>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
  StreamInfoStore,
  TaskQueueStore,
  SavePointStore
} from '@/stores/stream/detail'

@Component
export default class EngineParams extends Vue {
  private detailState = StreamInfoStore.state
  private queueState = TaskQueueStore.state
  private savepointState = SavePointStore.state
  get detail() {
    return this.detailState.value
  }
  get queueList() {
    return this.queueState.list
  }
  get savepointList() {
    return this.savepointState.list
  }

  // validate rules
  get detailRule() {
    return {
      queue: this.requiredVal('请选择运行队列'),
      jmMem: this.requiredPositive('JM内存/MB'),
      startType: this.requiredVal('请选择SAVEPOINT'),
      tmNum: this.requiredPositive('TM数量'),
      hadoopUser: this.requiredVal('请填写hadoop用户'),
      tmMem: this.requiredPositive('TM内存'),
      parallelism: this.requiredPositive('并行度')
    }
  }

  // 验证不为空
  private requiredVal(mes: string) {
    return {
      required: true,
      message: mes
    }
  }

  // 验证不为空且不小于零
  private requiredPositive(name: string) {
    return [
      {
        required: true,
        message: `请填写${name}`
      },
      {
        validator: (rule: string, value: number, cb: (v?: string) => void) => {
          if (value < 0) {
            cb('不能小于0')
          } else {
            cb()
          }
        }
      }
    ]
  }

  private validate() {
    return new Promise((resolve, reject) => {
      ;(this.$refs.form as any).validate((v: boolean) => {
        v ? resolve(v) : reject(v)
      })
    })
  }
}
</script>

<style lang="scss" scoped>
::v-deep .mtd-form-item-label {
  color: #999;
}
</style>
