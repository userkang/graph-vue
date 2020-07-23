<template>
  <mtd-modal v-model="isLocalShow" title="详细信息" width="622px">
    <div>
      <p class="title">副本信息：</p>
      <p class="item">
        <span class="item-label">git 仓库</span>
        <span class="item-value">{{ publishInfo.repos }}</span>
      </p>
      <p class="item">
        <span class="item-label">git 目录</span>
        <span class="item-value">{{ publishInfo.subdir }}</span>
      </p>
      <p class="item">
        <span class="item-label">代码版本</span>
        <span class="item-value">{{ publishInfo.gitVersion }}</span>
      </p>
      <p class="item">
        <span class="item-label">JDK版本</span>
        <span class="item-value">{{ publishInfo.jdkVersion }}</span>
      </p>
      <p class="item">
        <span class="item-label">编译参数</span>
        <span class="item-value">{{ publishInfo.compileArgs }}</span>
      </p>
      <p class="item">
        <span class="item-label">描述</span>
        <span class="item-value">{{ publishInfo.description }}</span>
      </p>
    </div>
    <div>
      <p class="title">发布信息：</p>
      <p class="item">
        <span class="item-label">发布结果</span>
        <span class="item-value">
          <PublishStatusTag :status="publishInfo.publishStatus" />
        </span>
      </p>
      <p class="item">
        <span class="item-label">发布人</span>
        <span class="item-value">{{ publishInfo.publisher }}</span>
      </p>
      <p class="item">
        <span class="item-label">开始时间</span>
        <span class="item-value">{{ publishInfo.startTime }}</span>
      </p>
      <p class="item">
        <span class="item-label">结束时间</span>
        <span class="item-value">{{ publishInfo.endTime }}</span>
      </p>
      <p class="item">
        <span class="item-label">Commit</span>
        <span class="item-value">{{ publishInfo.commit }}</span>
      </p>
      <p class="item">
        <span class="item-label">jar包下载</span>
        <span class="item-value">
          <a :href="publishInfo.jarUrl" target="_blank">{{ publishInfo.jarUrl }}</a>
        </span>
      </p>
    </div>
  </mtd-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import PublishStatusTag from './PublishStatusTag.vue'

@Component({
  components: {
    PublishStatusTag
  }
})
export default class PublishDetailModal extends Vue {
  @Prop({
    type: Boolean
  })
  private show!: boolean

  @Prop({
    type: Object
  })
  private publishInfo!: object

  get isLocalShow() {
    return this.show
  }

  set isLocalShow(v: boolean) {
    this.$emit('update:show', v)
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin-left: -30px;
  margin-bottom: 10px;
}
.item {
  font-size: 14px;
  margin-bottom: 14px;
  &-label {
    display: inline-block;
    width: 80px;
    text-align: right;
    margin-right: 20px;
    color: #999999;
  }
  &-value {
    color: #333333;
  }
}
</style>
