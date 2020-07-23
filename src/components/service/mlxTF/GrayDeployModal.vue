<template>
  <mtd-modal v-model="localShow" :width="850" @open="init">
    <div slot="title">
      <span class="modal-title">灰度更新</span>
      <ToolTip>灰度过程中，默认禁用机器，不响应外部请求</ToolTip>
    </div>
    <div class="title">模型选择</div>
    <InfoItem label="模型" label-width="58px">
      <mtd-select @change="modelChange" v-model="grayModel" size="small" style="width:220px">
        <mtd-option v-for="item in modelList" :key="item.id" :value="item" :label="item.name"></mtd-option>
      </mtd-select>
    </InfoItem>

    <InfoItem label-width="58px" label="模型路径">{{grayModel.modelPath}}</InfoItem>

    <div v-if="grayModel">
      <InfoItem label-width="58px" label="版本">
        <mtd-select
          @change="versionChange"
          v-model="modelVersions"
          size="small"
          style="width:220px"
          multiple
        >
          <mtd-option
            v-for="item in versionList"
            :key="item.id"
            :value="item"
            :label="item.modelPath"
          ></mtd-option>
        </mtd-select>
      </InfoItem>
      <InfoItem v-if="grayModel" label-width="58px" label="版本路径">
        <div
          style="margin-bottom: 5px"
          v-for="item in modelVersions"
          :key="item.id"
        >{{item.modelPath}}</div>
      </InfoItem>
    </div>
    <div style="height: 10px"></div>

    <div v-if="grayModel && modelVersions.length">
      <div class="title">实例选择</div>
      <div class="table-info">
        <div class="table-info-item">当前可灰度实例数：{{instanceList.instanceNum}}</div>
        <div class="table-info-item">当前已灰度实例数：{{instanceList.runningNum}}</div>
        <div class="table-info-item">
          计划灰度实例数：
          <mtd-input-number
            v-model="instanceNum"
            size="small"
            :step="1"
            :min="0"
            :max="instanceList.instanceNum"
            style="width:110px;vertical-align: middle"
            @change="inputChange"
          />
        </div>
      </div>
      <mtd-table
        :data="instanceList.scalingGroups"
        :selection="outerSelection"
        @select="outerSelectionChange"
        @select-all="selectAll"
        :row-key="getRowKey"
        :expand-row-keys="expands"
      >
        <EmptyAndLoading slot="empty" :loadingStatus="loadingStatus" />
        <mtd-table-column type="expand">
          <template slot-scope="props">
            <mtd-table
              :data="props.row.instanceVos"
              size="small"
              :show-header="false"
              :selection="innerSelection"
              @select="innerSelectionChange"
            >
              <mtd-table-column width="48"></mtd-table-column>
              <mtd-table-column type="selection" width="34"></mtd-table-column>
              <mtd-table-column>
                <template slot-scope="scope">{{scope.row.host + ':' + scope.row.port}}</template>
              </mtd-table-column>
            </mtd-table>
          </template>
        </mtd-table-column>
        <mtd-table-column type="selection" width="34"></mtd-table-column>
        <mtd-table-column label="伸缩组" prop="name"></mtd-table-column>
        <mtd-table-column label="serving集群" prop="hdfsCluster"></mtd-table-column>
        <mtd-table-column label="运行队列" width="120" prop="queue"></mtd-table-column>
        <mtd-table-column label="worker个数" align="center">
          <template slot-scope="scope">{{scope.row.resource | resourceFilter(1)}}</template>
        </mtd-table-column>
        <mtd-table-column label="worker内存" align="center">
          <template slot-scope="scope">{{scope.row.resource | resourceFilter(2)}}</template>
        </mtd-table-column>
        <mtd-table-column label="CPU个数" align="center">
          <template slot-scope="scope">{{scope.row.resource | resourceFilter(3)}}</template>
        </mtd-table-column>
        <mtd-table-column label="GPU个数" align="center">
          <template slot-scope="scope">{{scope.row.resource | resourceFilter(4)}}</template>
        </mtd-table-column>
      </mtd-table>
    </div>
    <div slot="footer">
      <mtd-button @click="localShow = false">取消</mtd-button>
      <mtd-button type="primary" @click="confirm" :disabled="!innerSelection.length">灰度更新</mtd-button>
    </div>
  </mtd-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import {
  GrayModelListStore,
  ScalingGroupInstanceStore,
  MLXTFModelVersionsStore,
  GrayJobStore,
  TemplateModelVersionListVoType,
  TemplateModelVersionVoType
} from '@/stores/service/MLXTF'
import {
  JobGrayInstanceQuery,
  SimplifiedModelVo,
  ScalingGroupGrayVo,
  ScalingGroupInstanceVo,
  ServingInstanceVo
} from '@/types/mlxTF'
import EmptyAndLoading from '../../../components/EmptyAndLoading.vue'
import InfoItem from '@/components/InfoItem.vue'
import ToolTip from '@/components/ToolTip.vue'

interface InstanceItem {
  scalingGroupId: number
  templateId: number
  jobId: number
  hdfsCluster: string
  queue: string
  host: string
  name: string
  port: string
}

@Component({
  components: {
    EmptyAndLoading,
    InfoItem,
    ToolTip
  },
  filters: {
    resourceFilter(value: string, num: number) {
      const match = value.match(
        /-Dworkers=(\d+) -Dworker.memory=(\d+) -Dworker.vcore=(\d+) -Dworker.g.*=(\d+)/
      )

      if (num === 2) {
        const memory = match ? match[2] : ''
        return Number(memory) / 1024 + 'G'
      }

      return match ? match[num] : ''
    }
  }
})
export default class GrayDeployModal extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  show = false

  @Prop()
  id!: string

  @Prop()
  templateId!: string

  @Prop()
  jobId!: string

  scalingGroupInstanceState = ScalingGroupInstanceStore.state
  grayModelListState = GrayModelListStore.state
  versionState = MLXTFModelVersionsStore.state
  grayModel: SimplifiedModelVo | string = ''
  modelId = 0
  instanceNum = 0
  modelVersions = []
  versionIds: string[] = []
  instances: JobGrayInstanceQuery[] = []
  outerSelection: ScalingGroupGrayVo[] = []
  innerSelection: ScalingGroupInstanceVo[] = []
  expands: number[] = []

  get loadingStatus() {
    const loading = this.scalingGroupInstanceState.loading
    if (loading === 'LOADING') {
      this.scalingGroupInstanceState.value.scalingGroups = []
    }
    return loading
  }

  get modelList() {
    return this.grayModelListState.value
  }

  get versionList(): TemplateModelVersionVoType {
    const res: TemplateModelVersionListVoType[] = this.versionState.value.filter(
      item => {
        if (item.modelId === (this.grayModel as SimplifiedModelVo).id) {
          return true
        }
      }
    )

    return res.length ? (res[0] as any).versions : []
  }

  get instanceList() {
    return this.scalingGroupInstanceState.value
  }

  get localShow() {
    return this.show
  }

  set localShow(v: boolean) {
    this.$emit('update:show', v)
  }

  async init() {
    this.grayModel = ''
    this.modelVersions = []

    const servingId = this.id
    const templateId = this.templateId

    MLXTFModelVersionsStore.request({ id: servingId, templateId })
  }

  getInstanceInfo() {
    if (!this.modelId || !this.modelVersions.length) {
      return
    }

    // 每次请求重置选项数组
    this.innerSelection = []

    ScalingGroupInstanceStore.request({
      servingId: this.id,
      templateId: this.templateId,
      jobId: this.jobId,
      query: {
        num: this.instanceNum,
        modelId: this.modelId,
        modelVersionIds: this.versionIds
      }
    })
  }

  modelChange(v: SimplifiedModelVo) {
    this.modelId = v.id
    this.modelVersions = []
    this.getInstanceInfo()
  }

  versionChange(v: TemplateModelVersionVoType[]) {
    this.versionIds = v.map(item => {
      return item.id
    })

    this.getInstanceInfo()
  }

  inputChange(v: number) {
    if (v > this.instanceList.instanceNum) {
      this.$mtd.message({
        type: 'warning',
        message: '计划灰度实例数不能大于可灰度实例数'
      })
      return
    }

    this.getInstanceInfo()
  }

  outerSelectionChange(v: ScalingGroupGrayVo[], row: ScalingGroupGrayVo) {
    if (this.outerSelection.includes(row)) {
      row.instanceVos.forEach(item => {
        this.innerSelection.push(item)
        item.pick = true
      })
    } else {
      row.instanceVos.forEach(item => {
        item.pick = false
      })
      this.innerSelection = this.innerSelection.filter(item => {
        return item.pick
      })
    }
  }

  innerSelectionChange(
    v: ScalingGroupInstanceVo[],
    row: ScalingGroupInstanceVo
  ) {
    if (this.innerSelection.includes(row)) {
      row.pick = true
    } else {
      row.pick = false
    }

    // 每次内部选项发生变化，遍历外部选项是否关联变化
    this.instanceList.scalingGroups.forEach((item: ScalingGroupGrayVo) => {
      // 统计内部选项已选树目
      let tempLength = 0
      item.instanceVos.forEach((value: ScalingGroupInstanceVo) => {
        if (value.pick) {
          tempLength++
        }
      })
      // 当内部已选树目大于 0，外部选项保持勾选。否则外部选项不再勾选
      if (tempLength > 0) {
        if (!this.outerSelection.includes(item)) {
          this.outerSelection.push(item)
        }
      } else {
        this.outerSelection = this.outerSelection.filter(
          value => !(value.id === item.id)
        )
      }
    })
  }

  selectAll() {
    const pick = !!this.outerSelection.length

    this.instanceList.scalingGroups.forEach(item => {
      item.instanceVos.forEach(value => {
        value.pick = pick
        if (pick) {
          this.innerSelection.push(value)
        } else {
          this.innerSelection = []
        }
      })
    })
  }

  getRowKey(row: ScalingGroupGrayVo) {
    return row.id
  }

  // 初始化内外选项勾选
  @Watch('instanceList.scalingGroups')
  handlePick(v: ScalingGroupGrayVo[]) {
    this.$nextTick(() => {
      v.forEach((item: ScalingGroupGrayVo) => {
        const instanceLength = item.instanceVos.length
        let tempLength = 0
        item.instanceVos.forEach((value: ScalingGroupInstanceVo) => {
          if (value.pick) {
            this.innerSelection.push(value)
            tempLength++
          }
        })
        if (tempLength > 0) {
          // 如果内选项部分勾选，需要展开该选项
          if (tempLength < instanceLength) {
            this.expands.push(item.id)
          }
          // 如果内选项有勾选，外选项就得勾选
          this.outerSelection.push(item)
        }
      })
    })
  }

  @Watch('innerSelection', {
    immediate: true
  })
  handleinstanceNum(v: ScalingGroupInstanceVo[]) {
    this.instanceNum = v.length
  }

  confirm() {
    GrayJobStore.request({
      servingId: this.id,
      templateId: this.templateId,
      jobId: this.jobId,
      params: {
        models: [
          {
            modelId: this.modelId,
            modelVersionIds: this.versionIds
          }
        ],
        instances: this.innerSelection
      }
    })

    this.localShow = false
  }
}
</script>

<style lang="scss" scoped>
.modal-title {
  margin-right: 5px;
  vertical-align: top;
}
.title {
  font-weight: 800;
  margin-bottom: 15px;
}
.info-item {
  margin-bottom: 20px;
}
.table-info {
  margin: 10px 0 10px 0;
  font-size: 12px;
  color: #666;
  .table-info-item {
    display: inline-block;
    margin-right: 30px;
  }
}
</style>