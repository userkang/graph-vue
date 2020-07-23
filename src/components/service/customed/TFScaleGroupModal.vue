<template>
  <CommonModal :title="`${handleType === 'add' ? '添加' : '编辑'}伸缩组`" @close="handleClose">
    <MtdForm :model="submitForm" :label-width="120">
      <MtdFormItem label="伸缩组" prop="name">
        <MtdInput v-model="submitForm.name" class="scale-form-item" />
      </MtdFormItem>
      <MtdFormItem label="Serving集群" prop="cluster">
        <MtdSelect
          v-model="submitForm.hdfsCluster"
          class="scale-form-item"
          @input="handleClusterChange"
        >
          <MtdOption
            v-for="cluster in scalingClusters"
            :key="cluster"
            :label="cluster"
            :value="cluster"
          />
        </MtdSelect>
      </MtdFormItem>
      <MtdFormItem
              label="运行队列"
              prop="queue"
      >
        <MtdSelect
                v-model="submitForm.queue"
                class="scale-form-item"
        >
          <div>
            <MtdOption
                    v-for="(queue,index) in scalingQueues"
                    :key="index"
                    :label="index"
                    :value="index"
            />
          </div>
        </MtdSelect>
      </MtdFormItem>
      <MtdFormItem label="worker个数" prop="worker">
        <MtdInput
          v-model="submitForm.worker"
          type="number"
          class="scale-form-item"
          @input="handleWorkerChange"
        />
      </MtdFormItem>
      <MtdFormItem label="worker内存 (G)" prop="memory">
        <MtdInput v-model="submitForm.memory" type="number" class="scale-form-item" />
      </MtdFormItem>
      <MtdFormItem label="cpu个数" prop="cpu">
        <MtdInput type="number" v-model="submitForm.cpu" class="scale-form-item" />
      </MtdFormItem>
      <MtdFormItem label="GPU个数" prop="gpu">
        <MtdInput type="number" v-model="submitForm.gpu" class="scale-form-item" />
      </MtdFormItem>
      <MtdFormItem
              label="显存类型"
              prop="queue"
      >
        <MtdSelect
                v-model="submitForm.gcores"
                class="scale-form-item"
        >
          <div>
            <MtdOption
                    v-for="item in gcroes"
                    :key="item"
                    :label="item"
                    :value="item"
            />
          </div>
        </MtdSelect>
      </MtdFormItem>
      <MtdFormItem label="其他参数" prop="extra">
        <MtdTextarea v-model="submitForm.extra" class="scale-form-item" />
      </MtdFormItem>
    </MtdForm>
    <div class="handle-panel has-top">
      <MtdButton
        class="submit-btn"
        @click="handleSubmit"
        :disabled="!isSubmitEnabled"
      >{{isScaleMode ? '确定伸缩启动' : '保存'}}</MtdButton>
      <MtdButton class="cancel-btn gap" @click="handleClose">取消</MtdButton>
    </div>
  </CommonModal>
</template>

<style lang="scss" scoped>
.scale-form-item {
  width: 300px;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'
import { MLXTFScalingQueuesStore } from '@/stores/service/CustomService'
import { ClusterListStore } from '@/stores/common'
import { ScalingGroupQueryType } from '@/types/mlxTF'

@Component({
  components: {
    CommonModal
  }
})
export default class TFScaleGroupModal extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private pageType!: string // pageType is view/rollback/add

  @Prop({
    type: String,
    required: true
  })
  private handleType!: string // handleType is add/edit

  @Prop({
    required: true
  })
  private initScaleGroup!: ScalingGroupQueryType

  @Prop({
    type: Boolean
  })
  private isScaleMode!: boolean

  @Prop({
    type: Boolean
  })
  private filling!: boolean

  private submitForm = {
    name: '',
    hdfsCluster: '',
    queue: '',
    gcores: '',
    worker: 1,
    memory: 4,
    cpu: 1,
    gpu: 0,
    extra: ''
  }
  private clusterListState = ClusterListStore.state
  private scalingQueuesState = MLXTFScalingQueuesStore.state

  get scalingClusters() {
    return this.clusterListState.value
  }

  get scalingQueues() {
    return this.scalingQueuesState.value
  }

  get gcroes() {
    const tempGcroes = this.scalingQueues[this.submitForm.queue]
    if (tempGcroes) {
      this.submitForm.gcores = tempGcroes[0]
    } else {
      this.submitForm.gcores = ''
    }
    return tempGcroes
  }

  private async handleClusterChange(value: string) {
    this.submitForm.queue = ''
    MLXTFScalingQueuesStore.clear()
    await MLXTFScalingQueuesStore.request(value)
  }

  private handleWorkerChange() {
    if (this.submitForm.worker < 1) {
      this.submitForm.worker = 1
    }
  }

  private isSubmitEnabled() {
    return (
      this.submitForm.name &&
      this.submitForm.hdfsCluster &&
      this.submitForm.queue
    )
  }

  private handleSubmit() {
    const {
      name,
      hdfsCluster,
      queue,
      gcores,
      worker,
      memory,
      cpu,
      gpu,
      extra
    } = this.submitForm
    let resourceArg = `-Dworkers=${worker} -Dworker.memory=${memory *
    1024} -Dworker.vcore=${cpu}`
    if (gcores === null || gcores.length === 0 || gpu === 0) {
      resourceArg = resourceArg + ` -Dworker.gpu=${gpu}`
    } else {
      resourceArg = resourceArg + ` -Dworker.` + gcores + `=${gpu}`
    }
    const payload = {
      name,
      hdfsCluster,
      queue,
      resource: resourceArg,
      extra
    }
    if (this.handleType === 'add') {
      this.$emit('addScale', payload)
    } else {
      this.$emit('editScale', payload)
    }
  }

  private handleClose() {
    this.$emit('close')
  }

  private async mounted() {
    if (this.handleType === 'edit' || this.filling) {
      const [worker, memory, cpu, gpu] = this.initScaleGroup.resource
        .trim()
        .split(' ')
        .map(item => Number(item.split('=')[1]))
      this.submitForm = {
        name: this.initScaleGroup.name,
        hdfsCluster: this.initScaleGroup.hdfsCluster,
        queue: this.initScaleGroup.queue,
        extra: this.initScaleGroup.extra,
        gcores: this.initScaleGroup.gcores,
        worker,
        memory: memory / 1024,
        cpu,
        gpu
      }
    }
    await ClusterListStore.request()
  }

  private beforeDestroy() {
    MLXTFScalingQueuesStore.clear()
  }

  @Watch('submitForm', { deep: true })
  private watchSubmitForm() {
    if (this.submitForm.cpu <= 1) {
      this.submitForm.cpu = 1
    }
    if (this.submitForm.gpu <= 0) {
      this.submitForm.gpu = 0
    }
  }
}
</script>
