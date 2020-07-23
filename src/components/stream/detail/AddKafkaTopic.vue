<template>
  <mtd-modal v-model="localShow" title="添加Kafka Topic" width="630px">
    <mtd-form :model="form" :rules="rules" :label-width="110" ref="form">
      <!-- <mtd-form-item required label="读写类型" prop="read">
        <mtd-radio-group v-model="form.read">
          <mtd-radio :value="true">读</mtd-radio>
          <mtd-radio :value="false">写</mtd-radio>
        </mtd-radio-group>
      </mtd-form-item>-->
      <mtd-form-item required label="topic类型" prop="auth">
        <mtd-radio-group v-model="form.auth">
          <mtd-radio :value="true">权限</mtd-radio>
          <mtd-radio :value="false">非权限</mtd-radio>
        </mtd-radio-group>
      </mtd-form-item>
      <mtd-form-item required label="Topic名称" prop="topicName">
        <mtd-select v-model="form.topicName" style="width: 260px;" allow-create filterable>
          <mtd-option
            v-for="value in topicList"
            :label="value.topicName"
            :value="value.topicName"
            :key="value.topicName + value.namespace"
          />
        </mtd-select>
      </mtd-form-item>
      <mtd-form-item required label="并发度" prop="parallelism">
        <mtd-input
          type="number"
          v-model="form.parallelism"
          style="width: 260px;"
          placeholder="输入数字"
        ></mtd-input>
      </mtd-form-item>
      <mtd-form-item required label="offset类型" prop="readOffsetType">
        <mtd-radio-group v-model="form.readOffsetType">
          <mtd-radio value="LASTTIME">接上次</mtd-radio>
          <mtd-radio value="EARLIEST">最旧</mtd-radio>
          <mtd-radio value="LATEST">最新</mtd-radio>
          <mtd-radio value="TIMESTAMP" v-if="form.auth">过去某时间点</mtd-radio>
        </mtd-radio-group>
      </mtd-form-item>
      <mtd-form-item
        required
        label="过去时间点"
        prop="readTimestamp"
        v-if="form.readOffsetType === 'TIMESTAMP' && form.auth"
      >
        <mtd-date-picker
          type="datetime"
          :value="form.readTimestamp ? new Date(form.readTimestamp) : null"
          placeholder="选择时间"
          :options="dateOptions"
          style="width: 260px;"
          @input="handleInput"
        ></mtd-date-picker>
      </mtd-form-item>
    </mtd-form>
    <div slot="footer">
      <mtd-button style="margin-right: 10px;" @click="hideModal">取消</mtd-button>
      <mtd-button type="primary" @click="sumbit">{{ isEdit ? '修改': '添加' }}</mtd-button>
    </div>
  </mtd-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { TaskTopicStore, StreamInfoStore } from '@/stores/stream/detail'
import { TopicVo, StreamJobVo } from '@/types/stream'
import { cloneDeep } from 'lodash'

function getDefaultTopic() {
  return {
    topicName: '',
    read: true,
    auth: true,
    readTimestamp: null,
    parallelism: 1,
    readOffsetType: 'LASTTIME'
  }
}

@Component
export default class AddKafkaTopic extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean

  @Prop({
    type: Object,
    default: () => {
      return {
        topicName: '',
        read: true,
        auth: 'true',
        readTimestamp: null,
        parallelism: 1,
        readOffsetType: 'LASTTIME'
      }
    }
  })
  private topic!: object

  @Prop({
    type: Number
  })
  private index!: number

  private taskTopicState = TaskTopicStore.state

  private rules = {
    parallelism: [
      {
        required: true,
        message: '请填写并发度'
      },
      {
        validator: this.testNum
      }
    ],
    topicName: [
      {
        required: true,
        message: '请填写Topic名称'
      }
    ]
  }

  private form = getDefaultTopic()

  private detailState = StreamInfoStore.state

  get detail() {
    return this.detailState.value
  }

  get isEdit() {
    return this.index > -1 && typeof this.index === 'number'
  }

  get localShow() {
    return this.show
  }

  set localShow(val: boolean) {
    this.$emit('update:show', val)
  }

  get dateOptions() {
    const shortcuts = [
      {
        text: '今天',
        value() {
          return new Date()
        }
      },
      {
        text: '昨天',
        value() {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24)
          return date
        }
      },
      {
        text: '一周前',
        value() {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
          return date
        }
      }
    ]
    return {
      shortcuts,
      disabledDate(date: Date) {
        return date && date.getTime() > Date.now()
      }
    }
  }

  get topicList() {
    return this.taskTopicState.list
  }

  @Watch('topic')
  private handleTopicChange() {
    this.form = cloneDeep(Object.assign(getDefaultTopic(), this.topic)) as any
  }

  @Watch('form.auth')
  private handleAuthChange(auth: any) {
    if (!auth && this.form.readOffsetType === 'TIMESTAMP') {
      this.form.readOffsetType = 'LASTTIME'
    }

    TaskTopicStore.fetchTopic({
      auth,
      wxProject: (this.detail as StreamJobVo).wxProject,
      read: this.form.read
    })
  }

  @Watch('show')
  private handleShowChange(v: boolean) {
    if (v) {
      this.handleAuthChange(this.form.auth)
    }
  }

  private testNum(rule: string, value: any, cb: (error?: Error) => void) {
    if (value >= 0) {
      cb()
    } else {
      cb(new Error('不能小于0'))
    }
  }

  private handleInput(v: Date) {
    v.setHours(0)
    this.form.readTimestamp = v.getTime() as any
  }
  private sumbit() {
    ;(this.$refs.form as any).validate((v: boolean) => {
      if (v) {
        this.hideModal()
        this.$emit('submit', {
          topic: this.form,
          index: this.index
        })
      }
    })
  }

  private hideModal() {
    this.localShow = false
  }
}
</script>

<style lang="scss" scoped>
</style>
