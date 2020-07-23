<template>
  <mtd-modal v-model="localShow" title="新增版本" width="630px">
    <mtd-form :model="form" :rules="rules" ref="form">
      <mtd-form-item label="名称" prop="name" required>
        <mtd-input v-model="form.name" style="width: 400px;" :disabled="type === 'SHOW'"></mtd-input>
      </mtd-form-item>
      <mtd-form-item label="git仓库" prop="repos" required>
        <mtd-input v-model="form.repos" style="width: 400px;" :disabled="type !== 'ADD'"></mtd-input>
        <div class="mtd-form-item-helper">注意git给stash_data_storm账号可读授权</div>
      </mtd-form-item>
      <mtd-form-item label="git目录" prop="subdir" required>
        <mtd-input
          v-model="form.subdir"
          placeholder="示例./demo"
          style="width: 400px;"
          :disabled="type !== 'ADD'"
        ></mtd-input>
      </mtd-form-item>
      <mtd-form-item label="代码版本" prop="gitVersion" required>
        <mtd-input
          v-model="form.gitVersion"
          placeholder="git commit/tag.branch"
          style="width: 400px;"
          :disabled="type !== 'ADD'"
        ></mtd-input>
      </mtd-form-item>
      <mtd-form-item label="编译参数" prop="mvnArgs">
        <mtd-input
          v-model="form.mvnArgs"
          placeholder="作业编译的maven参数"
          style="width: 400px;"
          :disabled="type !== 'ADD'"
        ></mtd-input>
      </mtd-form-item>
      <mtd-form-item label="描述" prop="notes" required>
        <mtd-input v-model="form.notes" style="width: 400px;" :disabled="type === 'SHOW'"></mtd-input>
      </mtd-form-item>
    </mtd-form>
    <div slot="footer" v-if="type !== 'SHOW'">
      <mtd-button style="margin-right: 10px;" @click="hideModal">取消</mtd-button>
      <mtd-button type="primary" @click="submit">{{ type === 'EDIT' ? '修改': '添加' }}</mtd-button>
    </div>
    <div slot="footer" v-else>
      <mtd-button type="primary" @click="hideModal">确定</mtd-button>
    </div>
  </mtd-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
function getDefaultGitVersionInfo() {
  return {
    name: '',
    repos: '',
    gitVersion: '',
    subdir: '',
    mvnArgs: '',
    notes: ''
  }
}

@Component
export default class AddVersionModal extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean

  @Prop({
    type: String,
    default: 'ADD'
  })
  private type!: string

  @Prop({
    type: Object
  })
  private gitVersion!: object

  private form = {}

  get localShow() {
    return this.show
  }

  set localShow(v: boolean) {
    this.$emit('update:show', v)
  }

  get rules() {
    return {
      name: this.requireStr(),
      repos: this.requireStr(),
      gitVersion: this.requireStr(),
      subdir: this.requireStr(),
      mvnArgs: this.requireStr(),
      notes: this.requireStr()
    }
  }

  private requireStr() {
    return [
      {
        required: true,
        message: '不能为空'
      }
    ]
  }

  @Watch('gitVersion')
  private handleVersionChange() {
    this.form = cloneDeep(this.gitVersion) as any
  }

  private submit() {
    ;(this.$refs.form as any).validate((v: boolean) => {
      if (v) {
        if (this.type === 'EDIT') {
          this.$emit(
            'edit',
            Object.assign(getDefaultGitVersionInfo(), this.form)
          )
        } else {
          this.$emit(
            'submit',
            Object.assign(getDefaultGitVersionInfo(), this.form)
          )
        }
        this.hideModal()
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
