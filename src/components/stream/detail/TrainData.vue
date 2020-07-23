<template>
  <div>
    <mtd-table :data="detail.topics">
      <mtd-table-column prop="topicName" label="Kafka topic名称"></mtd-table-column>
      <mtd-table-column prop="readOffsetType" label="类型"></mtd-table-column>
      <mtd-table-column prop="parallelism" label="并发度"></mtd-table-column>
      <mtd-table-column label="操作">
        <template slot-scope="scope">
          <mtd-button type="text-primary" @click="edit(scope.$index, scope.row)">编辑</mtd-button>
          <mtd-button type="text-primary" @click="del(scope.$index)">删除</mtd-button>
        </template>
      </mtd-table-column>
      <!-- <template slot="empty">无 KafKa Topic</template> -->
    </mtd-table>
    <p style="color: #606BE1; cursor: pointer; width: 150px; margin: 10px auto;" @click="showModal">
      <i class="iconfont icon-tianjia1"></i>
      添加Kafka Topic
    </p>
    <AddKafkaTopic
      :show.sync="isShowAddKafka"
      :topic="topicData"
      :index="index"
      @submit="addTopic"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { StreamInfoStore } from '@/stores/stream/detail'
import AddKafkaTopic from './AddKafkaTopic.vue'
import { TopicVo } from '@/types/stream'

@Component({
  components: {
    AddKafkaTopic
  }
})
export default class TrainData extends Vue {
  private detailState = StreamInfoStore.state
  private isShowAddKafka = false
  private topicData = {}
  private index = -1

  get detail() {
    return this.detailState.value
  }

  private addTopic(info: any) {
    if (info.index > -1 && typeof info.index === 'number') {
      StreamInfoStore.editTopic(info.index, info.topic)
    } else {
      StreamInfoStore.addTopic(info.topic)
    }
  }

  private async del(index: number) {
    await this.$mtd.confirm({
      title: '提示',
      message: `您确定要删除吗？`,
      showCancelButton: true,
      okButtonText: '删除',
      okButtonProps: {
        type: 'danger'
      }
    })
    StreamInfoStore.removeTopic(index)
  }

  private edit(index: number, topic: TopicVo) {
    this.index = index
    this.topicData = topic
    this.isShowAddKafka = true
  }

  private showModal() {
    this.index = -1
    this.topicData = {}
    this.isShowAddKafka = true
  }
}
</script>

<style lang="scss" scoped>
</style>
