<template>
  <div style="background: #FFF; padding: 6px 2px">
    <template v-if="!disabled">
      <MtdInput
        v-for="param in initValue.options"
        :key="param.value"
        size="small"
        :placeholder="param.label"
        style="margin-bottom: 4px"
        v-model="param.val"
      />
      <MtdButton size="small" class="submit-btn" style="width: 160px" @click="addParam">
        <i class="iconfont icon-jiqi-fangda" style="font-size: 12px"></i>添加
      </MtdButton>
    </template>
    <ul>
      <li v-for="(paramItem, index) in initValue.value" :key="index" class="feature-param-item">
        <template v-for="(param, key, index) in paramItem">
          {{param}}
          <span v-if="index !== Object.keys(paramItem).length - 1">/</span>
        </template>
        <i v-if="!disabled" class="iconfont icon-yibohui close-icon" @click="removeParam(index)"></i>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.close-icon {
  font-size: 12px;
  color: #606be1;
  cursor: pointer;
}

.feature-param-item {
  color: #666;
  padding: 4px 6px;
  margin: 10px 5px 0;
  border-bottom: 1px solid #ccc;
  text-align: left;
  word-break: break-all;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ParamVo } from '@/types/graph'

@Component
export default class FeatureArrayParam extends Vue {
  @Prop({
    required: true
  })
  private value!: ParamVo

  @Prop({
    type: Boolean,
    required: true
  })
  private disabled!: boolean

  private initValue = this.parseParam()

  // get isAddDisabled() {
  //     for (const item of this.initValue.options) {
  //         if (!(item as any).val) {
  //             return true;
  //         }
  //     }
  //     return false;
  // }

  private parseParam() {
    let options = this.value.options
    if (options.length > 0) {
      options = options.map(item => ({
        ...item,
        val: ''
      }))
    }
    const value = JSON.parse(this.value.value as string)
    const mappingValue = {
      ...this.value,
      value,
      options
    }
    return mappingValue
  }

  private removeParam(index: number) {
    const paramValue = this.initValue.value
    ;(paramValue as any[]).splice(index, 1)
    this.$emit('input', JSON.stringify(paramValue))
  }

  private addParam() {
    const newItem: any = {}
    this.initValue.options.forEach((item: any) => {
      newItem[item.value] = item.val
    })
    ;(this.initValue.value as any[]).push(newItem)
    this.$emit('input', JSON.stringify(this.initValue.value))
  }

  @Watch('value')
  private watchValue() {
    this.initValue = this.parseParam()
  }
}
</script>
