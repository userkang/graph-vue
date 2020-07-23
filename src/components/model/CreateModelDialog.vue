<template>
  <dmc-modal
    v-model="localShow"
    title="创建模型"
    width="480px"
    okButtonText="创建"
    @ok="handleSubmit"
    @cancel="handleClose"
    @close="handleClose"
  >
    <MtdForm :model="createForm" :rules="createRule" ref="createForm">
      <MtdFormItem label="模型名" prop="name" required>
        <MtdInput v-model="createForm.name" style="width: 260px" />
      </MtdFormItem>
      <MtdFormItem label="格式" prop="format" required>
        <MtdSelect v-model="createForm.format" style="width: 260px">
          <MtdOption
            v-for="modelType in modelTypeList"
            :key="modelType.value"
            :label="modelType.label"
            :value="modelType.value"
          />
        </MtdSelect>
      </MtdFormItem>
      <MtdFormItem label="存储引擎" prop="engine" required>
        <MtdSelect v-model="createForm.engine" style="width: 260px">
          <MtdOption value="hdfs" label="HDFS" />
        </MtdSelect>
      </MtdFormItem>
      <MtdFormItem label="集群" prop="cluster" required>
        <MtdSelect v-model="createForm.cluster" style="width: 260px">
          <MtdOption
            v-for="cluster in modelCluster"
            :key="cluster"
            :label="cluster"
            :value="cluster"
          />
        </MtdSelect>
      </MtdFormItem>
      <MtdFormItem label="存储路径" prop="path" required>
        <MtdTextarea v-model="createForm.path" />
        <a
          style="display: block"
          v-if="createForm.format === 'CUSTOMED'"
          href="http://xt.sankuai.com/upload/udfs"
          target="_blank"
          class="highlight-text"
        >上传本地模型</a>
      </MtdFormItem>
      <MtdFormItem label="备注">
        <MtdTextarea v-model="createForm.desc" />
      </MtdFormItem>
    </MtdForm>
  </dmc-modal>
</template>

<style lang="scss" scoped>
.create-modal-dialog {
  .form-item {
    display: flex;
    margin-bottom: 24px;
    &__label {
      width: 180px;
      text-align: right;
    }
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { modelTypeList } from '@/metaData/model'
import CommonModal from '@/components/CommonModal.vue'
@Component({
  components: { CommonModal }
})
export default class CreateModalDialog extends Vue {
  @Prop({
    default: false,
    type: Boolean
  })
  visible!: boolean

  @Prop({
    type: Array,
    required: true
  })
  private modelCluster!: string[]
  private modelTypeList = modelTypeList
  private createForm = {
    name: '',
    format: 'MLX',
    engine: 'hdfs',
    cluster: 'DEFAULT',
    path: '',
    desc: ''
  }

  get localShow() {
    return this.visible
  }

  set localShow(v) {
    this.$emit('update:visible', v)
  }

  get createRule() {
    const validator = (
      rule: string,
      value: string,
      callback: (value?: Error) => void
    ) => {
      if (value.trim() === '') {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    return {
      name: {
        validator,
        trigger: 'blur'
      },
      format: {
        validator,
        trigger: 'blur'
      },
      engine: {
        validator,
        trigger: 'blur'
      },
      cluster: {
        validator,
        trigger: 'blur'
      },
      path: {
        validator,
        trigger: 'blur'
      }
    }
  }

  private handleClose() {
    ;(this.$refs.createForm as any).resetFields()
    this.localShow = false
  }

  private handleSubmit() {
    ;(this.$refs.createForm as any).validate((valid: boolean) => {
      if (valid) {
        const { name, format, engine, cluster, path, desc } = this.createForm
        this.$emit('submit', {
          modelName: name,
          modelType: format,
          storage: engine,
          hdfsCluster: cluster,
          modelPrefixPath: path,
          description: desc,
          autoExamine: false
        })
      }
    })
  }
}
</script>
