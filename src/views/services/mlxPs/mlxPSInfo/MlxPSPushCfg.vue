<template>
  <section style="margin-bottom: 40px">
    <ServiceSectionTitle title="推送配置" />
    <MtdTable :data="list">
      <p slot="empty">
        <a href="javascript:;" @click="addFetcher">
          <i class="iconfont icon-liucheng-shenqingxinbiao"></i>
          添加增量推送
        </a>
      </p>
      <MtdTableColumn label="Mafka Appkey" prop="appkey" />
      <MtdTableColumn label="Mafka Topic" prop="topic" />
      <MtdTableColumn label="Namespace" prop="namespace" />
      <MtdTableColumn label="shardNum" prop="shardNum" />
      <MtdTableColumn label="fetcher版本" prop="fetcherVersion" />
      <MtdTableColumn label="操作" width="120px">
        <template slot-scope="scope">
          <!-- <template v-if="!isServiceRunning">
          </template>-->
          <i
            class="iconfont icon-Dashboard-mingchengbianji highlight-text"
            style="margin-right: 20px;"
            @click="showEditFetcher"
          ></i>
          <!-- <template v-else>
                        <MtdTooltip content="需先停止服务才能更改" placement="top">
                            <i class="iconfont icon-Dashboard-mingchengbianji"></i>
                        </MtdTooltip>
                        <MtdTooltip content="需先停止服务才能更改" placement="top">
                            <i class="iconfont icon-Dashboard-shanchu"></i>
                        </MtdTooltip>
          </template>-->
        </template>
      </MtdTableColumn>
    </MtdTable>

    <OpenAutoPushModal
      v-if="isShowModal"
      :type="openType"
      @submit="handleAutoPush"
      @cancel="handleCancel"
    />
  </section>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import EmptyIcon from '@/components/EmptyIcon.vue'
import ServiceSectionTitle from '@/components/service/ServiceSectionTitle.vue'
import OpenAutoPushModal from '@/components/service/mlxPS/OpenAutoPushModal.vue'
import { PSPushConfigFetchStore } from '@/stores/service/mlxPS/mlxPSModelPanel'
import {
  OpenPushPayload,
  MLXPSAutoPushStore
} from '@/stores/service/mlxPS/mlxPSModel'
import { PsFetcherInfoVo } from '@/types/stream'

@Component({
  components: {
    ServiceSectionTitle,
    OpenAutoPushModal
  }
})
export default class MlxPSPushCfg extends Vue {
  private isShowModal = false
  private list: PsFetcherInfoVo[] = []
  // private isServiceRunning = false;

  get openType() {
    return this.list.length > 0 ? 'EDIT' : 'ADD'
  }

  private async handleAutoPush(data: OpenPushPayload) {
    this.isShowModal = false
    const psId = this.$route.params.id
    if (this.openType === 'ADD') {
      await MLXPSAutoPushStore.addFetcher(data, {
        psId
      })
    } else {
      await MLXPSAutoPushStore.updateFetcher(data, {
        psId
      })
    }
    this.getFetcherInfo()
  }

  private handleCancel() {
    this.isShowModal = false
  }

  private addFetcher() {
    this.isShowModal = true
  }

  private async getFetcherInfo() {
    const value = await PSPushConfigFetchStore.fetchModelInfo({
      psId: this.$route.params.id
    })

    if (value.topic) {
      this.list = [value]
    }
  }

  private async showEditFetcher() {
    await this.$mtd.confirm({
      title: '编辑推送配置',
      message: '重新编辑推送配置，当前所有流式训练将停止推送，是否继续编辑？',
      width: '430px',
      showCancelButton: true,
      type: 'error',
      okButtonText: '编辑',
      okButtonProps: {
        type: 'danger'
      }
    })
    this.isShowModal = true
  }

  private mounted() {
    this.getFetcherInfo()
  }
}
</script>


<style lang="scss" scoped>
.resource-handle-panel {
  i {
    font-size: 14px;
    display: inline-block;
    margin-right: 20px;
  }
}
</style>
