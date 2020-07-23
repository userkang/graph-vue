<template>
  <div>
    <MtdTable :data="psVersionListValue" style="margin-top: -8px">
      <EmptyAndLoading :loadingStatus="loadingStatus" slot="empty" />
      <MtdTableColumn label="版本ID" prop="id">
        <template slot-scope="scope">
          <MtdButton
            type="text"
            class="highlight-text"
            @click="refreshPage(scope.row.id)"
          >{{scope.row.id}}</MtdButton>
        </template>
      </MtdTableColumn>
      <MtdTableColumn label="创建时间" prop="createTime"></MtdTableColumn>
      <MtdTableColumn label="状态">
        <template slot-scope="scope">
          <span
            :class="[statusStyleFunc(scope.row.status)]"
            style="font-size: 12px"
          >{{statusLabelFunc(scope.row.status)}}</span>
        </template>
      </MtdTableColumn>
      <MtdTableColumn label="操作">
        <template slot-scope="scope">
          <span class="highlight-text table-link-btn" @click="handleRemove(scope.row.id)">删除</span>
          <span
            v-if="scope.$index === 0 && psType === 1"
            class="highlight-text table-link-btn"
            @click="isShowFailRecoverModal = true"
          >故障恢复</span>
        </template>
      </MtdTableColumn>
    </MtdTable>

    <FailRecoverModal :show.sync="isShowFailRecoverModal" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
  MLXPSVersionsStore,
  MLXPSInfoStore
} from '@/stores/service/mlxPS/mlxPS'
import {
  serviceStatusLabelFunc,
  serviceStatusStyleFunc
} from '@/metaData/mlxPS'
import PageTable from '@/components/PageTable.vue'
import EmptyAndLoading from '@/components/EmptyAndLoading.vue'
import { RemovePSResourceStore } from '@/stores/service/mlxPS/mlxPSResource'
import FailRecoverModal from '@/components/service/mlxPS/FailRecoverModal.vue'

@Component({
  components: {
    EmptyAndLoading,
    PageTable,
    FailRecoverModal
  }
})
export default class MlxPsHistory extends Vue {
  @Prop({
    type: Number,
    required: true
  })
  private id!: number

  private psVersionListState = MLXPSVersionsStore.state
  private psInfoState = MLXPSInfoStore.state

  private statusLabelFunc = serviceStatusLabelFunc
  private statusStyleFunc = serviceStatusStyleFunc

  private isShowFailRecoverModal = false

  get psType() {
    return this.psInfoState.value.type
  }

  get psVersionListValue() {
    return this.psVersionListState.value
  }

  get loadingStatus() {
    return this.psVersionListState.loadingStatus
  }

  private refreshPage(versionId: number) {
    if ((window as any).__ENV__ === 'development') {
      location.href = `${location.origin}/#/service/mlxps/${this.id}/version/${versionId}`
    } else {
      if (location.href.includes('/ml/')) {
        location.href = `${location.origin}/ml/#/service/mlxps/${this.id}/version/${versionId}`
      } else {
        location.href = `${location.origin}/ml#/service/mlxps/${this.id}/version/${versionId}`
      }
    }
    location.reload()
  }

  private async fetchPSVersionList() {
    await MLXPSVersionsStore.request(this.id)
  }

  private async handleRemove(id: number) {
    await this.$mtd.confirm({
      type: 'warning',
      title: '确认删除?',
      okButtonProps: {
        type: 'danger'
      },
      showCancelButton: true
    })

    await RemovePSResourceStore.request(id)
    await this.fetchPSVersionList()
  }
}
</script>

<style lang="scss" scoped>
.table-link-btn {
  margin-right: 10px;
}
</style>