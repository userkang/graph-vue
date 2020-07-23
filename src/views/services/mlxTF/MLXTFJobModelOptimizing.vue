<template>
  <section>
    <InfoTitle title="模型优化" isLeftAlign>
      <div class="flex-v-center" slot="content">
        <div class="flex-item" style="text-align: left">
          <mtd-tooltip size="small" placement="top">
            <div slot="content">
              ART是机器学习架构团队推出的第一代优化框架，可以对Bert、Resnet等主流模型进行加速。
              详情参考：
              <a
                href="https://km.sankuai.com/page/226142585"
                target="_blank"
              >ART用户手册</a>
            </div>
            <i class="iconfont icon-dayi"></i>
          </mtd-tooltip>
          <mtd-tag style="margin-left: 8px" size="small" theme="red" type="unbordered">new!</mtd-tag>
        </div>
      </div>
    </InfoTitle>

    <mtd-form :model="optimizingConfig" class="form-class">
      <div class="tips">
        <i class="mtdicon mtdicon-warning-circle"></i>
        提示：开启优化需要使用 tf_1.15_cuda10.0_trt7.0 镜像。优化详情可参考：
        <a
          href="https://km.sankuai.com/page/226142585"
          target="_blank"
        >ART用户手册</a>
      </div>
      <mtd-form-item label="优化开关" prop="switch">
        <mtd-radio-group size="small" v-model="optimizingConfig.optimizing">
          <mtd-radio :value="true">开启</mtd-radio>
          <mtd-radio :value="false">关闭</mtd-radio>
        </mtd-radio-group>
        <mtd-tooltip size="small" placement="top">
          <div slot="content">
            当开启优化后，在启动伸缩组和模型更新时，系统将对模型进行自动优化。详情参考
            <a
              href="https://km.sankuai.com/page/226142585"
              target="_blank"
            >ART用户手册</a>
          </div>
          <i class="iconfont icon-dayi"></i>
        </mtd-tooltip>
      </mtd-form-item>

      <div v-if="optimizingConfig.optimizing">
        <mtd-form-item required label="CUDA版本" prop="cudaVersion">
          <mtd-select v-model="optimizingConfig.cudaVersion" style="width: 260px;" size="small">
            <mtd-option v-for="item in cudaVersionList" :key="item" :label="item" :value="item" />
          </mtd-select>
        </mtd-form-item>
        <mtd-form-item required label="TF版本" prop="tfVersion">
          <mtd-select v-model="optimizingConfig.tfVersion" style="width: 260px;" size="small">
            <mtd-option v-for="item in tfVersionList" :key="item" :label="item" :value="item" />
          </mtd-select>
        </mtd-form-item>
        <mtd-form-item required label="运行时Batch size" prop="batchSize">
          <mtd-input-number
            :min="1"
            v-model="optimizingConfig.batchSize"
            style="width: 260px;vertical-align: middle"
            size="small"
          ></mtd-input-number>
          <mtd-tooltip size="small" placement="top">
            <div slot="content">系统针对特定 Batch size 做特定优化</div>
            <i class="iconfont icon-dayi"></i>
          </mtd-tooltip>
        </mtd-form-item>
        <mtd-form-item required label="GPU型号" prop="gpuType">
          <mtd-select v-model="optimizingConfig.gpuType" style="width: 260px;" size="small">
            <mtd-option v-for="item in gpuList" :key="item" :label="item" :value="item" />
          </mtd-select>
          <mtd-tooltip size="small" placement="top">
            <div slot="content">系统针对特定 GPU 卡做特定优化，请务必保证正确，ZF 机房请统一填写 P40</div>
            <i class="iconfont icon-dayi"></i>
          </mtd-tooltip>
        </mtd-form-item>
        <mtd-form-item label="其他参数">
          <mtd-textarea
            v-model="optimizingConfig.extra"
            size="small"
            style="width: 260px;"
            rows="3"
            maxlength="4096"
          ></mtd-textarea>
        </mtd-form-item>
      </div>
    </mtd-form>
  </section>
</template>

<style lang="scss" scoped>
.form-class {
  background: #f2f5fb;
  border-radius: 1px;
  padding: 16px 20px;
  margin-bottom: 14px;

  .form-item {
    width: 300px;
  }
}
.icon-dayi {
  color: #606be1;
  font-weight: 400;
  vertical-align: middle;
  margin-left: 10px;
}
.tips {
  font-size: 13px;
  color: #ff9801;
  text-align: left;
  margin: 10px 20px;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import InfoTitle from '@/components/InfoTitle.vue'
import { JobModelOptimizingUpdateQuery } from '@/types/mlxTF'
import { MLXTFOptimizingStore } from '@/stores/service/MLXTF'

@Component({
  components: {
    InfoTitle
  }
})
export default class MLXTFJobModelOptimizing extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  optimizingConfig!: JobModelOptimizingUpdateQuery

  optimizingState = MLXTFOptimizingStore.state

  get gpuList() {
    return this.optimizingState.gpuList
  }

  get tfVersionList() {
    return this.optimizingState.tfVersion
  }

  get cudaVersionList() {
    return this.optimizingState.cudaVersion
  }

  mounted() {
    MLXTFOptimizingStore.getGpuType()
    MLXTFOptimizingStore.getTFVersion()
    MLXTFOptimizingStore.getCudaVersion()
  }
}
</script>
