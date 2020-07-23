<template>
  <mtd-modal
    v-model="localShow"
    :title="'启动「' + title + '」'"
    width="630px"
    :destroy-on-close="true"
  >
    <mtd-form :model="form" ref="form" :label-width="120">
      <mtd-form-item label="选择启动版本" prop="versionId" required>
        <mtd-select v-model="form.versionId" style="width: 400px;">
          <mtd-option v-for="value in list" :label="value.name" :value="value.id" :key="value.id"></mtd-option>
          <p slot="empty" style="text-align: center; height: 40px; line-height: 40px">
            当前没有可选代码版本，请先到
            <a href="javascrpt:;" @click="goToGitVersion">版本管理</a>
            添加加代码版本
          </p>
        </mtd-select>
      </mtd-form-item>
      <mtd-form-item label="备注" prop="notes" required>
        <mtd-textarea v-model="form.notes" style="width: 400px;" rows="3"></mtd-textarea>
      </mtd-form-item>
    </mtd-form>
    <div slot="footer">
      <mtd-button style="margin-right: 10px;" @click="hideModal">取消</mtd-button>
      <mtd-button type="primary" @click="startup">启动</mtd-button>
    </div>
  </mtd-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { StartupStore } from '@/stores/stream/detail'

@Component
export default class SelectStartupVersionModal extends Vue {
  @Prop({
    type: String
  })
  private title!: string

  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean

  private StartupState = StartupStore.state
  private form = {
    versionId: '',
    notes: ''
  }

  get localShow() {
    return this.show
  }

  set localShow(v: boolean) {
    this.$emit('update:show', v)
  }

  get list() {
    return this.StartupState.list
  }

  @Watch('localShow')
  private handleShowChange(v: boolean) {
    if (v) {
      this.fetchList()
    }
  }

  private hideModal() {
    this.localShow = false
  }

  private goToGitVersion() {
    this.hideModal()
    const { taskId, jobId } = this.$route.params
    this.$router.push({
      name: 'streamDetail',
      params: {
        taskId,
        jobId
      },
      query: {
        tabType: 'git-version'
      }
    })
  }

  private startup() {
    ;(this.$refs.form as any).validate((v: boolean) => {
      if (v) {
        this.hideModal()
        this.$emit('startup', this.form)
      }
    })
  }

  private fetchList() {
    const { taskId, jobId } = this.$route.params
    StartupStore.fetchGitList(
      {
        page: 1,
        size: 200
      },
      {
        taskId,
        jobId
      }
    )
  }
}
</script>

<style lang="scss" scoped>
</style>
