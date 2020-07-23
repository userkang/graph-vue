<template>
  <div class="param-wrap">
    <div class="param-title">
      <i class="slide"></i>
      <i
        class="iconfont icon-daohangxialasanjiao fold-param-icon"
        :class="{ 'fold-status': isFold }"
        @click="changeFold"
      ></i>
      <h4 class="comp-name">相关配置</h4>
    </div>
    <section class="param-content" v-show="!isFold">
      <div class="extra-info-item" v-for="item in localExtraInfo" :key="item.key">
        <label class="param-item-label">{{ item.label }}</label>
        <span class="label-text">{{ item.status === 0 ? '未配置,' : '已配置,' }}</span>
        <mtd-button type="text" @click="handleClick(item.url)">
          {{
          item.status === 0 ? '前往配置' : !item.name ? '查看配置' : item.name
          }}
        </mtd-button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.extra-info-item {
  white-space: nowrap;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ActiveNodeExtraInfoStore } from '@/stores/workflow/graphVisual/activeNode'

@Component
export default class NodeExtraInfo extends Vue {
  private isFold = false

  private activeNodeExtraInfoState = ActiveNodeExtraInfoStore.state

  get activeNodeExtraInfo() {
    return this.activeNodeExtraInfoState.value
  }

  private changeFold() {
    this.isFold = !this.isFold
  }

  private handleClick(url: string) {
    window.open(url, '_blank')
  }

  get localExtraInfo() {
    return [
      // 本期暂不支持 DQC 和 SLA，入口隐藏
      this.activeNodeExtraInfo.dqcUrl && {
        key: 'dqc',
        label: 'DQC',
        status: this.activeNodeExtraInfo.dqcStatus === 'ONLINE' ? 1 : 0,
        url: this.activeNodeExtraInfo.dqcUrl,
        name: this.activeNodeExtraInfo.dqcName
      },
      {
        key: 'cantor',
        label: '调度',
        status: this.activeNodeExtraInfo.cantorStatus,
        url: this.activeNodeExtraInfo.cantorUrl,
        name: this.activeNodeExtraInfo.cantorName
      }
      // {
      //   key: 'sla',
      //   label: 'SLA',
      //   status: this.activeNodeExtraInfo.slaStatus,
      //   url: this.activeNodeExtraInfo.slaUrl
      // }
    ].filter(Boolean)
  }
}
</script>
