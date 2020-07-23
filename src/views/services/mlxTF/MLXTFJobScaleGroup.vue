<template>
  <section>
    <TFScaleGroupModal
      v-if="isScaleModalShow"
      :isScaleMode="isScaleMode"
      :pageType="pageType"
      :handleType="handleType"
      :initScaleGroup="currentScaleGroup"
      :filling="filling"
      @addScale="handleAddScale"
      @editScale="handleEditScale"
      @close="isScaleModalShow = false"
    />
    <ServiceSectionTitle title="伸缩组信息" isLeftAlign>
      <mtd-button size="small" class="submit-btn" @click="showAddScaling">
        <i></i>
        添加伸缩组
      </mtd-button>
    </ServiceSectionTitle>
    <MtdTable :data="scalingGroups">
      <EmptyIcon slot="empty" />
      <MtdTableColumn label="伸缩组" prop="name" width="135" />
      <MtdTableColumn label="状态" v-if="isShowStatus" width="100px">
        <template slot-scope="scope">
          <span
            :class="tfStatusMapping(scope.row.status).class"
          >{{tfStatusMapping(scope.row.status).text}}</span>
        </template>
      </MtdTableColumn>
      <MtdTableColumn label="队列" min-width="235" prop="queue" show-overflow-tooltip />
      <MtdTableColumn label="worker个数" align="center" width="90">
        <template slot-scope="scope">{{scope.row.resource | resourceFilter(1)}}</template>
      </MtdTableColumn>
      <MtdTableColumn label="worker内存" align="center" width="90">
        <template slot-scope="scope">{{scope.row.resource | resourceFilter(2)}}</template>
      </MtdTableColumn>
      <MtdTableColumn label="CPU个数" align="center" width="90">
        <template slot-scope="scope">{{scope.row.resource | resourceFilter(3)}}</template>
      </MtdTableColumn>
      <MtdTableColumn label="GPU个数" align="center" width="90">
        <template slot-scope="scope">{{scope.row.resource | resourceFilter(4)}}</template>
      </MtdTableColumn>
      <MtdTableColumn label="显存类型" width="90" prop="gcores" />
      <MtdTableColumn label="其他参数" prop="extra" show-overflow-tooltip />
      <MtdTableColumn label="操作" width="260">
        <template slot-scope="scope">
          <mtd-button
            size="small"
            class="handle-btn"
            v-if="isShowEditOrDelete(scope.row.status)"
            @click="showEditScale({index: scope.$index, payload: scope.row})"
          >{{isScaleMode ? '伸缩' : '编辑'}}</mtd-button>
          <mtd-button
            class="delete-btn handle-btn"
            size="small"
            v-if="isShowEditOrDelete(scope.row.status)"
            @click="handleDeleteScale(scope.$index)"
          >删除</mtd-button>
          <mtd-button
            v-if="isShowStart(scope.row.status) && !isStarting"
            type="primary"
            class="handle-btn"
            size="small"
            @click="handleStartScale(scope.row.id)"
          >启动</mtd-button>
          <mtd-button
            v-if="isShowStop(scope.row.status)"
            class="delete-btn handle-btn"
            size="small"
            @click="handleStopScale(scope.row.id)"
          >停止</mtd-button>
          <mtd-button
            size="small"
            v-if="isShowOpenApp(scope.row.status)"
            class="highlight-text"
            @click="goAppDetail(scope.row.id)"
          >查看日志</mtd-button>
        </template>
      </MtdTableColumn>
    </MtdTable>
  </section>
</template>

<style lang="scss" scoped>
.handle-btn {
  margin-right: 7px;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ServiceSectionTitle from '@/components/service/ServiceSectionTitle.vue'
import {
  MLXTFGroupType,
  ScaleGroupHandlePayload,
  ScalingGroupQueryType,
  ScalingGroupVoType
} from '@/types/mlxTF'
import EmptyIcon from '@/components/EmptyIcon.vue'
import TFScaleGroupModal from '@/components/service/mlxTF/TFScaleGroupModal.vue'
import { defaultScaleGroup } from '@/mock/mlxTF'
import {
  MLXTFScaleAddStore,
  MLXTFScaleEditStore,
  MLXTFScaleDeleteStore,
  MLXTFScaleStartStore,
  MLXTFScaleStopStore,
  MLXTFScaleEditAndStartStore
} from '@/stores/service/MLXTF'
import { JOBStatus, tfStatusMapping } from '@/metaData/mlxTF'
import { processingStatus, canStopStatus } from '@/metaData/mlxTF'

@Component({
  components: {
    TFScaleGroupModal,
    EmptyIcon,
    ServiceSectionTitle
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
export default class MLXTFJobScaleGroup extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private id!: string

  @Prop({
    type: String,
    required: true
  })
  private templateId!: string

  @Prop({
    type: Number,
    required: true
  })
  private jobId!: number

  @Prop({
    type: String,
    required: true
  })
  private pageType!: string // view 查看页面, rollback 回滚页面， add 新建页面 edit 编辑页面

  @Prop({
    type: Array,
    required: true
  })
  private scalingGroups!: MLXTFGroupType[]

  private isScaleMode = false
  private isStarting = false
  private currentIndex = 0
  private handleType = 'add' // add/edit scaleGroup
  private isScaleModalShow = false
  private tfStatusMapping = tfStatusMapping
  private currentScaleGroup: MLXTFGroupType = defaultScaleGroup()
  private filling = false

  get isSubmitImmediately() {
    return ['add', 'rollback'].includes(this.pageType)
  }
  get isShowStatus() {
    return this.pageType === 'view'
  }

  private isShowOpenApp(status: number) {
    return ['view', 'edit'].includes(this.pageType) && status !== JOBStatus.INIT
  }
  private isShowEditOrDelete(status: number) {
    return !(this.pageType === 'view' && processingStatus.includes(status))
  }
  private isShowStart(status: number) {
    return this.pageType === 'view' && !processingStatus.includes(status)
  }
  private isShowStop(status: number) {
    return this.pageType === 'view' && canStopStatus.includes(status)
  }

  private showAddScaling() {
    if (this.scalingGroups.length) {
      const val: MLXTFGroupType = this.scalingGroups.slice(-1)[0]
      this.currentScaleGroup = val
      this.currentScaleGroup.gcores = ''
      this.filling = true
    }
    this.handleType = 'add'
    this.isScaleModalShow = true
  }

  private goAppDetail(scalingGroupId: string) {
    this.$router.push({
      name: 'mlxTFJobApp',
      params: {
        id: this.id,
        scalingGroupId
      },
      query: {
        templateId: this.templateId,
        jobId: String(this.jobId)
      }
    })
  }

  private async handleAddScale(val: ScalingGroupQueryType) {
    this.isScaleModalShow = false
    if (this.isSubmitImmediately) {
      this.$emit('addScale', val)
    } else {
      await MLXTFScaleAddStore.request({
        id: this.id,
        jobId: this.jobId,
        templateId: this.templateId,
        value: val
      })
      this.$emit('refresh')
    }
  }

  private showEditScale(val: ScaleGroupHandlePayload) {
    this.isScaleMode =
      this.pageType === 'view' &&
      (val.payload as ScalingGroupVoType).status === JOBStatus.RUNNING
    this.currentIndex = val.index
    this.currentScaleGroup = val.payload as ScalingGroupVoType
    this.handleType = 'edit'
    this.isScaleModalShow = true
  }

  private async handleEditScale(val: ScalingGroupQueryType) {
    this.isScaleModalShow = false
    if (this.isSubmitImmediately) {
      this.$emit('editScale', {
        index: this.currentIndex,
        payload: val
      })
    } else {
      if (this.isScaleMode) {
        await MLXTFScaleEditAndStartStore.request({
          id: this.id,
          templateId: this.templateId,
          jobId: this.jobId,
          scaleGroupId: String(
            (this.currentScaleGroup as ScalingGroupVoType).status
          ),
          value: val
        })
      } else {
        await MLXTFScaleEditStore.request({
          id: this.id,
          jobId: this.jobId,
          templateId: this.templateId,
          scaleGroupId: String(
            (this.scalingGroups as ScalingGroupVoType[])[this.currentIndex].id
          ),
          value: val
        })
      }
      this.$emit('refresh')
    }
  }

  private async handleDeleteScale(index: number) {
    try {
      await this.$mtd.confirm({
        title: '删除伸缩组',
        message: '确认删除该伸缩组吗？'
      })

      if (this.isSubmitImmediately) {
        this.$emit('deleteScale', index)
      } else {
        await MLXTFScaleDeleteStore.request({
          id: this.id,
          jobId: this.jobId,
          templateId: this.templateId,
          scaleGroupId: String(
            (this.scalingGroups as ScalingGroupVoType[])[index].id
          )
        })
        this.$emit('refresh')
      }
      // tslint:disable-next-line
    } catch (e) {}
  }

  private async handleStartScale(scaleGroupId: string) {
    this.isStarting = true
    await MLXTFScaleStartStore.request({
      id: this.id,
      templateId: this.templateId,
      jobId: this.jobId,
      scaleGroupId
    })
    this.isStarting = false
    this.$emit('refresh')
  }

  private async handleStopScale(scaleGroupId: string) {
    await this.$mtd.confirm({
      type: 'warning',
      title: '提示',
      message: '确定停止该伸缩组吗？',
      showCancelButton: true,
      okButtonText: '停止',
      okButtonProps: {
        type: 'danger'
      }
    })

    await MLXTFScaleStopStore.request({
      id: this.id,
      templateId: this.id,
      jobId: this.jobId,
      scaleGroupId
    })
    this.$emit('refresh')
  }
}
</script>
