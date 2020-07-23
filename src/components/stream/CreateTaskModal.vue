<template>
  <mtd-modal v-model="localShow" title="创建流式训练作业" width="622px">
    <p style="background: #FFF6E5; margin-bottom: 20px; padding: 5px;">创建后将以该作业名在实时计算平台同步注册一个实时任务</p>
    <mtd-form :model="form" :rules="formRules" ref="form">
      <mtd-form-item label="项目组" prop="wxProject" required>
        <mtd-select
          type="text"
          v-model="form.wxProject"
          style="width: 400px;"
          @change="fetchQueueList"
        >
          <mtd-option v-for="item in projectList" :key="item" :value="item" :label="item"></mtd-option>
        </mtd-select>
      </mtd-form-item>
      <mtd-form-item label="作业名" prop="jobName" required>
        <mtd-input type="text" v-model="form.jobName" style="width: 400px;"></mtd-input>
      </mtd-form-item>
      <mtd-form-item label="运行队列" prop="queue" required>
        <mtd-select type="text" v-model="form.queue" style="width: 400px;">
          <mtd-option v-for="item in queueList" :key="item" :value="item" :label="item"></mtd-option>
        </mtd-select>
      </mtd-form-item>
      <mtd-form-item label="备注" prop="notes">
        <mtd-textarea v-model="form.notes" style="width: 400px;" rows="3" maxlength="50"></mtd-textarea>
      </mtd-form-item>
    </mtd-form>
    <div slot="footer" class>
      <mtd-button style="margin-right: 15px;" @click="localShow = false">取消</mtd-button>
      <mtd-button type="primary" @click="submit">确定</mtd-button>
    </div>
  </mtd-modal>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
  StreamTaskQueueStore,
  StreamTaskCreaetJobStore,
  WXProjectStore
} from '@/stores/stream/list'
import { StreamTaskAddQuery } from '@/types/stream'

@Component
export default class CreateTaskModal extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean

  private taskQueueState = StreamTaskQueueStore.state

  private WXProjectState = WXProjectStore.state

  private form: StreamTaskAddQuery = {
    wxProject: '',
    jobName: '',
    queue: '',
    notes: ''
  }

  private formRules = {
    wxProject: this.requiredVal('请选择项目组'),
    jobName: [
      this.requiredVal('请填写作业名'),
      {
        validator: this.validateName
      }
    ],
    queue: this.requiredVal('请选择运行队列')
  }

  get localShow() {
    return this.show
  }

  set localShow(v: boolean) {
    // (this.$refs as any).form.resetFields();
    this.$emit('update:show', v)
  }
  get queueList() {
    return this.taskQueueState.list
  }

  get projectList() {
    return this.WXProjectState.value
  }

  private requiredVal(msg: string) {
    return {
      required: true,
      message: msg
    }
  }

  private validateName(
    rule: string,
    value: string,
    cb: (msg?: string) => void
  ) {
    if (/^[a-zA-Z0-9_-]+$/.test(value)) {
      cb()
    } else {
      cb('作业名只能包含字母、数字、中划线、下划线')
    }
  }

  private submit() {
    ;(this.$refs as any).form.validate((valid: boolean) => {
      if (valid) {
        StreamTaskCreaetJobStore.sumbit(this.form).then((v: boolean) => {
          if (v) {
            this.localShow = false
            this.$emit('sumbit')
          }
        })
      }
    })
  }

  private fetchQueueList() {
    StreamTaskQueueStore.fetchQueueList(this.form.wxProject)
  }

  private mounted() {
    WXProjectStore.request()
  }
}
</script>