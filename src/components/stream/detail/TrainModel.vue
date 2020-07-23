<template>
  <div>
    <mtd-form :model="detail" :rules="detailRule" :label-width="180" ref="form">
      <div class="df">
        <mtd-form-item required prop="mainFunction">
          <span slot="label">
            主函数名
            <mtd-tooltip placement="top" content="custom，eg：com.sankuai.itc.mlx.stream.Mylauncher">
              <i class="iconfont icon-tianxiebiaodashi" style="color: #606BE1;"></i>
            </mtd-tooltip>
          </span>
          <mtd-input v-model="detail.mainFunction" style="width: 340px"></mtd-input>
        </mtd-form-item>
        <mtd-form-item label="eval_batch_size" prop="evalBatchSize" required>
          <mtd-input style="width: 340px" v-model="detail.evalBatchSize" type="number"></mtd-input>
        </mtd-form-item>
      </div>
      <div class="df">
        <mtd-form-item required prop="psId">
          <span slot="label">
            近线PS
            <mtd-tooltip
              placement="top"
              content="运行的近线ps服务：https://mlp.sankuai.com/ml/#/service/list"
            >
              <i class="iconfont icon-tianxiebiaodashi" style="color: #606BE1;"></i>
            </mtd-tooltip>
          </span>
          <!-- <mtd-input
                    v-model="detail.psId"
                    style="width: 340px"
                >
          </mtd-input>-->
          <mtd-select
            v-model="detail.psId"
            @update:visible="psListToogle"
            @change="psChange"
            style="width: 340px"
          >
            <mtd-option
              v-for="value in psList"
              :label="value.name"
              :value="value.id"
              :key="value.id"
            ></mtd-option>
          </mtd-select>
        </mtd-form-item>
        <mtd-form-item label="shuffle_batch_size" prop="shuffleBatchSize" required>
          <mtd-input v-model="detail.shuffleBatchSize" style="width: 340px" type="number"></mtd-input>
        </mtd-form-item>
      </div>
      <div class="df">
        <mtd-form-item required prop="modelMappingId">
          <span slot="label">
            模型名
            <!-- <mtd-tooltip placement="top" content="任务名会同步成数据表名">
                        <i class="iconfont icon-tianxiebiaodashi" style="color: #606BE1;"></i>
            </mtd-tooltip>-->
          </span>
          <!-- <mtd-input
                    v-model="detail.modelName"
                    style="width: 340px"
                >
          </mtd-input>-->
          <mtd-select
            v-model="detail.modelMappingId"
            @update:visible="modelListToogle"
            @change="modelChange"
            style="width: 340px"
          >
            <mtd-option
              v-for="value in modelList"
              :label="value.name"
              :value="value.id"
              :key="value.id"
            ></mtd-option>
          </mtd-select>
        </mtd-form-item>
        <mtd-form-item required prop="trainingParallel">
          <span slot="label">训练并行度</span>
          <mtd-input min="0" v-model="detail.trainingParallel" style="width: 340px" type="number"></mtd-input>
        </mtd-form-item>
      </div>
      <div class="df">
        <mtd-form-item prop="autoPush">
          <span slot="label">
            增量推送
            <mtd-tooltip placement="top" content="开启该配置后，将实时开启推送">
              <i class="iconfont icon-tianxiebiaodashi" style="color: #606BE1;"></i>
            </mtd-tooltip>
          </span>
          <div style="width: 340px">
            <mtd-switch
              v-model="autoPush"
              size="small"
              :disabled="!detail.psId || !detail.modelMappingId"
              @change="toogleAutoPush"
              :loading="isOptingAutoPush"
            ></mtd-switch>
          </div>
        </mtd-form-item>
        <mtd-form-item required prop="labelParse">
          <span slot="label">
            label_parse
            <mtd-tooltip
              placement="top"
              content="eg: origin_label:parse_label:weight, pay='0:-1:1;1:0:1;3:0:1;5:1:1'"
            >
              <i class="iconfont icon-tianxiebiaodashi" style="color: #606BE1;"></i>
            </mtd-tooltip>
          </span>
          <mtd-input v-model="detail.labelParse" style="width: 340px"></mtd-input>
        </mtd-form-item>
      </div>
      <div class="df">
        <mtd-form-item>
          <span slot="label">
            collector
            <mtd-tooltip
              placement="top"
              content="当前collector配置（ip：port ）为项目组默认配置，使用该配置收集指标可支持用户在平台上查看模型训练指标"
            >
              <i class="iconfont icon-tianxiebiaodashi" style="color: #606BE1;"></i>
            </mtd-tooltip>
          </span>
          <mtd-input disabled v-model="detail.collectorInfo" style="width: 340px"></mtd-input>
        </mtd-form-item>
        <mtd-form-item>
          <span slot="label">
            自定义参数
            <mtd-tooltip
              placement="top"
              content="自定义参数，格式：-key1 value1 -key2 value2，特殊字符需进行转义，运行时可从main的args中获取"
            >
              <i class="iconfont icon-tianxiebiaodashi" style="color: #606BE1;"></i>
            </mtd-tooltip>
          </span>
          <mtd-textarea v-model="detail.customEntryFuntion" rows="3"></mtd-textarea>
        </mtd-form-item>
      </div>
      <div class="df">
        <mtd-form-item required label="使用MLX提取特征" prop="useMlxFeatureExtracter">
          <mtd-radio-group v-model="detail.useMlxFeatureExtracter">
            <mtd-radio :value="true">是</mtd-radio>
            <mtd-radio :value="false">否</mtd-radio>
          </mtd-radio-group>
        </mtd-form-item>
      </div>
      <div class="df">
        <mtd-form-item prop="featureExtracterParallel">
          <span slot="label">
            特征提取并行度
            <mtd-tooltip placement="top" content="feature_extracter.parallel">
              <i class="iconfont icon-tianxiebiaodashi" style="color: #606BE1;"></i>
            </mtd-tooltip>
          </span>
          <mtd-input
            v-model="detail.featureExtracterParallel"
            style="width: 340px"
            :disabled="!detail.useMlxFeatureExtracter"
          ></mtd-input>
        </mtd-form-item>
      </div>
    </mtd-form>
    <OpenAutoPushModal
      v-if="isShowAutoPushModal"
      :type="openType"
      @submit="handleAutoPush"
      @cancel="handleCancel"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { StreamInfoStore, PSAndModelListStore } from '@/stores/stream/detail'
import { PSPushConfigFetchStore } from '@/stores/service/mlxPS/mlxPSModelPanel'
import { PsVo, PsModelMappingVo, StreamJobVo } from '@/types/stream'
import OpenAutoPushModal from '@/components/service/mlxPS/OpenAutoPushModal.vue'
import {
  OpenPushPayload,
  MLXPSAutoPushStore
} from '@/stores/service/mlxPS/mlxPSModel'

@Component({
  components: {
    OpenAutoPushModal
  }
})
export default class TrainModel extends Vue {
  private detailState = StreamInfoStore.state
  private psAndModelState = PSAndModelListStore.state
  private autoPush = false
  private isShowAutoPushModal = false
  private isOptingAutoPush = false
  private openType = (this.detail as StreamJobVo).hasFetcherInfo ? '' : 'ADD'
  private curModleId!: number | string
  private psId!: number

  get detail() {
    return this.detailState.value
  }

  get detailRule() {
    return {
      mainFunction: this.requiredVal('请填写主函数名'),
      evalBatchSize: this.requiredPositive('eval_batch_size'),
      shuffleBatchSize: this.requiredPositive('shuffle_batch_size'),
      psId: this.requiredVal('请选择近线PS'),
      modelMappingId: this.requiredVal('请选择模型名'),
      trainingParallel: this.requiredPositive('训练并行度'),
      labelParse: this.requiredVal('请填写 label_parse'),
      featureExtracterParallel: this.requiredUp()
    }
  }

  get psList() {
    return this.psAndModelState.psList
  }

  get modelList() {
    return this.psAndModelState.modelList
  }

  // 验证不为空
  private requiredVal(mes: string) {
    return {
      required: true,
      message: mes
    }
  }

  // 验证不能小于零
  private requiredUp() {
    return [
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

  // autoPush 在开始的时候获取一次，其余的在 modelList 有返回
  @Watch('detail.creator')
  private async getAutoPush() {
    const { psId, modelMappingId: mappingId } = this.detail as StreamJobVo
    if (psId && mappingId) {
      const value = await PSAndModelListStore.fetchModelInfo({
        psId,
        mappingId
      })
      this.autoPush = value.autoPush
    }
    this.curModleId = mappingId
    this.psId = psId
    this.psListToogle(true)
    this.modelListToogle(true)
  }

  // 实时获取
  private psListToogle(v: boolean) {
    const { wxProject } = this.detail as StreamJobVo
    if (v && wxProject) {
      PSAndModelListStore.fetchPsList({
        projectName: wxProject
      })
    }
  }

  private psChange(id: number) {
    StreamInfoStore.resetModel()
    PSAndModelListStore.resetModelList()
    this.autoPush = false
  }

  private modelListToogle(v: boolean) {
    const psId = (this.detail as StreamJobVo).psId
    if (v && psId) {
      PSAndModelListStore.fetchModelList({
        psId,
        curModelId: psId === this.psId ? this.curModleId : ''
      })
    }
  }

  private modelChange(id: number) {
    const modelInfo: PsModelMappingVo | undefined = this.modelList.find(
      (item: PsModelMappingVo) => {
        return item.id === id
      }
    )
    this.autoPush = modelInfo!.autoPush
  }

  private async toogleAutoPush(v: boolean) {
    const { psId } = this.detail as StreamJobVo
    if (psId) {
      const data = await PSPushConfigFetchStore.fetchModelInfo({ psId })
      if (data.namespace) {
        this.openType = v ? 'OPEN' : 'CLOSE'
      } else {
        this.openType = 'ADD'
      }
      this.isShowAutoPushModal = true
      this.isOptingAutoPush = true
    }
  }

  private async handleAutoPush(data: OpenPushPayload) {
    this.isShowAutoPushModal = false
    this.isOptingAutoPush = false
    const { psId, modelMappingId: mappingId } = this.detail as StreamJobVo
    if (this.openType === 'ADD') {
      await MLXPSAutoPushStore.addFetcher(data, {
        psId
      })
    }
    // else {
    //     await MLXPSAutoPushStore.updateFetcher(data, {
    //         psId
    //     });
    // }
    await MLXPSAutoPushStore.request({
      mappingId: mappingId as number,
      type: this.openType === 'CLOSE' ? 'close' : 'open'
    })
    // this.refreshStrem();
  }

  private handleCancel() {
    this.isShowAutoPushModal = false
    this.isOptingAutoPush = false
    this.getAutoPush()
    // this.refreshStrem()
  }

  private refreshStrem() {
    const { taskId, jobId } = this.$route.params
    StreamInfoStore.fetchStreamInfo({ taskId, jobId })
  }

  // @Watch('psList')
  // private handlePsIdChange(psId: number) {
  //     const psInfo: PsVo | undefined = this.psList.find((item: PsVo) => item.id === this.detail.psId);
  //     // if (!psInfo) {
  //     //     return;
  //     // }
  //     PSAndModelListStore.fetchModelList({
  //         psAppId: psInfo.psAppId
  //     });
  // }

  // @Watch('modelList')
  // private handleModelListChange(v: PsModelMappingVo[]) {
  //     debugger
  //     this.selectModelName(this.detail.modelMappingId);
  // }

  // private selectModelName(v: number) {
  //     const modelInfo: PsModelMappingVo = this.modelList.find((item: PsModelMappingVo) => item.mappingId === v);
  //     this.autoPush = modelInfo.autoPush;
  // }
}
</script>

<style lang="scss" scoped>
::v-deep .mtd-form-item-label {
  color: #999;
}
.df {
  display: flex;
}
</style>

