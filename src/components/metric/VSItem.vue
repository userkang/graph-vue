<template>
  <div>
    <div class="ps-item-title">
      <span>模型{{ index + 1 }}</span>
      <span class="ps-item-title-del" @click="removeItem(index)">
        <i class="iconfont icon-shanchuzhibiao"></i>
        删除
      </span>
    </div>
    <div class="ps-item-main">
      <div class="ps-item-main-row">
        <span class="ps-item-main-label">模型名</span>
        <mtd-select
          v-model="info.modelId"
          @change="handleSelectedModelChange"
          size="small"
          style="width: 356px"
        >
          <MtdOption
            v-for="psModelItem in modelList"
            :key="psModelItem.id"
            :value="psModelItem.id"
            :label="psModelItem.modelName"
          />
        </mtd-select>
      </div>
      <div class="ps-item-main-row">
        <span class="ps-item-main-label">模型版本</span>
        <mtd-select
          v-model="info.versionId"
          @change="handleSelectedVersionChange"
          size="small"
          style="width: 356px"
        >
          <MtdOption
            v-for="modelVersion in psModelVersionListValue"
            :key="modelVersion.id"
            :value="modelVersion.id"
            :label="modelVersion.modelPath"
          />
        </mtd-select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ModelVoType, ModelVersionVoType } from '@/types/model'
import { ModelVSVersionListStore } from '@/stores/model'
import { VSListStore } from '@/stores/metric/Metric'
import cloneDeep from 'lodash/cloneDeep'

interface SS {
  modelName: string
  modelId: string
  versionId: string
  modelPath: string
}

// FIXME: notNow 因为 mtd 中 select 组件拿不到 index 和 item（已咨询过chenyu），所以曲线救国
@Component({})
export default class VSItem extends Vue {
  @Prop({
    required: true
  })
  private info!: SS
  @Prop({
    required: true
  })
  private index!: number
  // 模型列表
  @Prop({
    type: Array,
    required: true
  })
  private modelList!: ModelVoType[]
  private psModelVersionListState = ModelVSVersionListStore.state

  get psModelVersionListValue() {
    return this.psModelVersionListState.value
  }

  private async handleSelectedModelChange(id: number) {
    const model = this.modelList.find((item: ModelVoType) => item.id === id)
    this.$emit('changeModelName', (model && model.modelName) || '', this.index)
    await ModelVSVersionListStore.request({
      modelId: id
    })
  }
  private handleSelectedVersionChange(id: number) {
    const model = this.psModelVersionListValue.find(
      (item: ModelVersionVoType) => item.id === id
    )
    this.$emit('changeModelPath', (model && model.modelPath) || '', this.index)
  }

  private removeItem(index: number) {
    this.$emit('removeItem', index)
  }
}
</script>

<style lang="scss" scoped>
.ps-item {
  font-size: 12px;
  padding: 8px 12px;
  margin-bottom: 10px;
  border-radius: 1px;
  background: #f1f4fa;
  &-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 9px;
    color: #464646;
    &-del {
      color: #666666;
      cursor: pointer;
      i {
        font-size: 12px;
        color: red;
      }
    }
  }
  &-main {
    div:first-child {
      margin-bottom: 10px;
    }
    &-row {
      display: flex;
    }
    &-label {
      display: inline-block;
      width: 48px;
      color: #666;
      line-height: 26px;
      text-align: right;
      margin-right: 12px;
    }
  }
}
</style>
