<template>
  <div>
    <LoadingIcon v-if="isLoading" class="modal-loading-wrap" />
    <div v-else>
      <dmc-modal v-model="localShow" title="注册服务" width="550px">
        <MtdForm :model="registryForm">
          <MtdFormItem required label="服务类型" prop="serviceType">
            <MtdSelect v-model="registryForm.serviceType" style="width: 300px">
              <MtdOption
                v-for="serviceItem in serviceTypeList"
                :key="serviceItem.value"
                :value="serviceItem.value"
                :label="serviceItem.label"
              />
            </MtdSelect>
          </MtdFormItem>
          <MtdFormItem v-if="registryForm.serviceType === 'mlxps'" label="部署类型" prop="psType">
            <MtdSelect v-model="registryForm.psType" style="width: 300px">
              <MtdOption
                v-for="psType in psTypeList"
                :key="psType.value"
                :value="psType.value"
                :label="psType.label"
              />
            </MtdSelect>
          </MtdFormItem>
          <MtdFormItem label="AppKey" prop="appKey" v-show="isShowAppKey">
            <MtdSelect v-model="registryForm.appKey" :filterable="true" style="width: 300px">
              <MtdOption
                v-for="appKey in appKeyListValue"
                :label="appKey"
                :value="appKey"
                :key="appKey"
              />
            </MtdSelect>
          </MtdFormItem>
          <MtdFormItem v-if="isPSNameShow" label="PS名称" prop="psName">
            <MtdInput v-model="registryForm.psName" style="width: 300px" placeholder="最长为40字符" />
          </MtdFormItem>
          <MtdFormItem v-if="registryForm.serviceType === 'mlxps'" label="启动方式" prop="deployType">
            <MtdRadioGroup v-model="registryForm.deployType" size="small">
              <MtdRadio
                v-for="deployType in deployTypeList"
                :value="deployType.value"
                :key="deployType.value"
              >{{deployType.label}}</MtdRadio>
            </MtdRadioGroup>
          </MtdFormItem>
          <MtdFormItem
            v-if="registryForm.serviceType === 'mlxps_cluster'"
            label="shardNum"
            prop="sharedNum"
          >
            <MtdInput type="number" style="width: 300px" v-model="registryForm.sharedNum" />
          </MtdFormItem>
          <MtdFormItem v-if="registryForm.serviceType === 'mlxps_cluster'" label="环境" prop="env">
            <MtdRadioGroup size="small" v-model="registryForm.env">
              <MtdRadio
                v-for="envItem in envTypes"
                :key="envItem.value"
                :value="envItem.value"
              >{{envItem.label}}</MtdRadio>
            </MtdRadioGroup>
          </MtdFormItem>
          <MtdFormItem v-if="isServiceNameShow" label="服务名" prop="serviceName" required>
            <MtdInput v-model="registryForm.serviceName" style="width: 300px" />
          </MtdFormItem>
          <MtdFormItem v-if="registryForm.serviceType === 'customed_serving'" label="环境镜像">
            <span>CentOS7-CUDA8</span>
          </MtdFormItem>
          <MtdFormItem
            label="环境镜像"
            prop="envImage"
            v-if="registryForm.serviceType === 'img_base_serving'"
          >
            <MtdSelect v-model="registryForm.envImage" style="width: 300px">
              <MtdOption />
            </MtdSelect>
          </MtdFormItem>
          <MtdFormItem
            v-if="registryForm.serviceType === 'img_base_serving'"
            label="图像服务类型"
            prop="imageType"
            required
          >
            <MtdSelect v-model="registryForm.imageType" style="width: 300px">
              <MtdOption />
            </MtdSelect>
          </MtdFormItem>
          <MtdFormItem label="备注" prop="desc">
            <MtdTextarea v-model="registryForm.desc" style="width: 300px" />
          </MtdFormItem>
        </MtdForm>

        <div slot="footer">
          <MtdButton class="cancel-btn gap" @click="handleCloseRegistry">取消</MtdButton>
          <MtdButton
            class="submit-btn"
            :disabled="isRegistryBtnDisabled"
            @click="handleSubmitRegistry"
          >创建</MtdButton>
        </div>
      </dmc-modal>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.registry-service-modal {
  .btn-wrap {
    display: flex;
    flex-direction: row-reverse;
  }
}

.modal-loading-wrap {
  z-index: 9999;
  position: absolute;
  top: -33px;
  left: 0px;
  width: 100%;
  background: white;
  height: 60px;
}
</style>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import { serviceTypeList, psTypeList, deployTypeList } from '@/metaData/mlxPS'
import {
  AddMlxPSStore,
  AppKeyListStore,
  MLXClusterAddStore
} from '@/stores/service/ServiceList'
import { MLXTFCreateStore } from '@/stores/service/MLXTF'
import { defaultRegistryServiceMock } from '@/mock/service'
import CommonModal from '@/components/CommonModal.vue'
import LoadingIcon from '@/components/LoadingIcon.vue'

@Component({
  components: {
    LoadingIcon,
    CommonModal
  }
})
export default class RegistryServiceDialog extends Vue {
  @Prop({
    default: false,
    type: Boolean
  })
  visible!: boolean

  @Prop({
    type: String,
    default: ''
  })
  private modelType!: string

  private registryForm = defaultRegistryServiceMock()
  private isLoading = false
  private serviceTypeList = serviceTypeList
  private psTypeList = psTypeList
  private deployTypeList = deployTypeList
  private maxPSNameLength = 40
  private envTypes = [
    { label: 'prod(生产)', value: 'prod' },
    { label: 'staging(测试)', value: 'staging' }
  ]
  private appKeyListState = AppKeyListStore.state

  get appKeyListValue() {
    return this.appKeyListState.value
  }

  get serviceType() {
    return this.registryForm.serviceType
  }

  get isPSNameShow() {
    return ['mlxps', 'mlxps_cluster'].includes(this.registryForm.serviceType)
  }

  get isServiceNameShow() {
    return ['img_base_serving', 'customed_serving'].includes(
      this.registryForm.serviceType
    )
  }

  get isShowAppKey() {
    return (
      ['mlxps_cluster', 'tf_serving', 'customed'].includes(
        this.registryForm.serviceType
      ) ||
      (this.registryForm.serviceType === 'mlxps' &&
        this.registryForm.psType === 1)
    )
  }

  get isRegistryBtnDisabled() {
    if (this.registryForm.serviceType === 'mlxps') {
      // psType 1 近线  3离线
      if (this.registryForm.psType === 1) {
        return (
          !this.registryForm.appKey ||
          !this.registryForm.psName ||
          String(this.registryForm.psName).length > this.maxPSNameLength
        )
      } else {
        return (
          !this.registryForm.psName ||
          String(this.registryForm.psName).length > this.maxPSNameLength
        )
      }
    } else if (this.registryForm.serviceType === 'mlxps_cluster') {
      return !this.registryForm.appKey || !this.registryForm.psName
    } else if (this.registryForm.serviceType === 'tf_serving') {
      return !this.registryForm.appKey
    }
  }

  get localShow() {
    return this.visible
  }

  set localShow(v) {
    this.$emit('update:visible', v)
  }

  private handleCloseRegistry() {
    this.localShow = false
  }

  private async handleSubmitRegistry() {
    this.isLoading = true
    switch (this.registryForm.serviceType) {
      case 'mlxps':
        await AddMlxPSStore.request({
          appkey: this.registryForm.appKey,
          deploy: this.registryForm.deployType,
          description: this.registryForm.desc,
          name: this.registryForm.psName,
          type: this.registryForm.psType
        })
        break
      case 'mlxps_cluster':
        await MLXClusterAddStore.request({
          appkey: this.registryForm.appKey,
          environment: this.registryForm.env,
          name: this.registryForm.psName,
          shardNum: this.registryForm.sharedNum,
          description: this.registryForm.desc
        })
        break
      case 'tf_serving':
      case 'customed':
        await MLXTFCreateStore.request({
          appkey: this.registryForm.appKey,
          description: this.registryForm.desc,
          type: this.registryForm.serviceType
        })
        break
    }
    this.$emit('submit', this.registryForm.serviceType)
  }

  // 传入默认的服务类型
  private mounted() {
    this.registryForm.serviceType = this.modelType
  }

  @Watch('serviceType')
  private watchServiceType(value: string) {
    this.registryForm = {
      ...defaultRegistryServiceMock(),
      serviceType: value
    }
  }
}
</script>
