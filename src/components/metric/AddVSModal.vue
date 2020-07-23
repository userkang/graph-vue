<template>
  <div>
    <mtd-modal v-model="isShowVs" width="482px">
      <div slot="title" class="title">
        <span class="title-main">添加对比</span>
        <span class="title-sub">指标类型：MLX</span>
      </div>

      <VSItem
        class="ps-item"
        v-for="(el, $index) in vsList"
        :key="el.id"
        :index="$index"
        :info="el"
        :modelList="modelList"
        @changeModelName="changeModelName"
        @changeModelPath="changeModelPath"
        @removeItem="removeItem"
      />
      <div class="addPS" @click="addItem" v-if="vsList.length < this.max">
        <i class="iconfont icon-jiqi-fangda addPS-icon"></i>
        <span>添加模型</span>
        <span class="addPS-declare">（最多可以添加{{ this.max }}个模型）</span>
      </div>
      <div slot="footer">
        <mtd-button style="margin-right: 15px;" @click="cancel">取消</mtd-button>
        <mtd-button type="primary" @click="contrast">对比</mtd-button>
      </div>
    </mtd-modal>
  </div>
</template>


<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ModelVoType } from '@/types/model'
import { MetricModelListStore } from '@/stores/model'
import { VSListStore } from '@/stores/metric/Metric'
import cloneDeep from 'lodash/cloneDeep'
import { VSItemType } from '@/types/metric'

import VSItem from './VSItem.vue'

const initialOption: VSItemType = {
  modelName: '',
  modelId: '',
  modelPath: '',
  versionId: ''
}

function getInitialOption() {
  return {
    modelName: '',
    modelId: '',
    modelPath: '',
    versionId: ''
  }
}

@Component({
  components: {
    VSItem
  }
})
export default class AddVSModal extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean

  @Prop({
    type: Number,
    default: 3
  })
  private max!: number

  // 模型列表
  @Prop({
    type: Array,
    required: true
  })
  private modelList!: ModelVoType[]
  private psModelVersionListState = MetricModelListStore.state
  // 模型列表
  private VSListState = VSListStore.state

  private vsList: VSItemType[] = []

  @Watch('VSListState', {
    immediate: true
  })
  private watchVSListState(v: VSItemType[]) {
    const list = cloneDeep(v)
    if (!list.length) {
      list.push(getInitialOption())
    }
    this.vsList = list
  }

  get isShowVs() {
    return this.show
  }
  set isShowVs(val: boolean) {
    this.$emit('update:show', val)
  }

  get psModelVersionListValue() {
    return this.psModelVersionListState.value
  }

  private removeItem(index: number) {
    this.vsList.splice(index, 1)
  }

  private addItem() {
    this.vsList.push({
      ...initialOption
    })
  }

  private contrast() {
    this.isShowVs = false
    const list = this.vsList.filter(
      (item: VSItemType) => item.modelId && item.versionId
    )
    VSListStore.setState(list)
  }

  private changeModelName(v: string, index: number) {
    const info = this.vsList[index]
    info.modelName = v
    info.modelPath = ''
    info.versionId = ''
  }

  private changeModelPath(v: string, index: number) {
    const info = this.vsList[index]
    info.modelPath = v
  }
  private cancel() {
    this.isShowVs = false
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  color: #333;
  &-main {
    margin-right: 12px;
  }
  &-sub {
    font-size: 12px;
    color: #666;
  }
}

.addPS {
  height: 30px;
  font-size: 12px;
  line-height: 30px;
  text-align: center;
  color: #666;
  margin-bottom: 10px;
  border: 1px dashed #dddeeb;
  border-radius: 1px;
  &-icon {
    color: #606be1;
    font-size: 12px;
    margin-right: 6px;
  }
  &-declare {
    color: #999;
  }
}
</style>

