<template>
  <div class="param-item" v-if="localParam">
    <label class="param-item-label">
      {{param.label}}
      <MtdTooltip v-if="param.tooltip" :content="param.tooltip" placement="top">
        <i class="iconfont icon-dayi"></i>
      </MtdTooltip>
    </label>
    <div v-if="localParam">
      <mtd-button
        class="field-select-btn"
        type="primary"
        :disabled="!canEditGraph"
        v-if="localParam.paramType === 'MULTIFIELD'"
        @click="handleSelectFieldModelShow('MULTIFIELD', localParam.nodeId, localParam.paramId)"
        size="small"
      >字段多选</mtd-button>

      <mtd-button
        class="field-select-btn"
        type="primary"
        :disabled="!canEditGraph"
        v-if="localParam.paramType === 'SINGLEFIELD'"
        @click="handleSelectFieldModelShow('SINGLEFIELD', localParam.nodeId, localParam.paramId)"
        size="small"
      >字段单选</mtd-button>
      <MtdInput
        v-if="localParam.paramType === 'INPUT'"
        style="width: 100%;"
        size="small"
        v-model="localParam.value"
        :disabled="!canEditGraph"
        @blur="handleValueChange(localParam.value)"
        :invalid="!isItemValid"
      />
      <div class="left-wrap">
        <MtdRadioGroup
          v-if="localParam.paramType === 'RADIO'"
          v-model="localParam.value"
          size="small"
          :disabled="!canEditGraph"
          @input="handleValueChange"
        >
          <MtdRadio
            v-for="option in localParam.options"
            :key="option.value"
            :value="option.value"
          >{{option.label}}</MtdRadio>
        </MtdRadioGroup>
      </div>

      <MtdInput
        v-if="localParam.paramType === 'NUMBER'"
        v-model="localParam.value"
        type="number"
        size="small"
        :invalid="!isItemValid"
        :disabled="!canEditGraph"
        style="width: 100%;"
        :style="{'margin-left': isShowNumberRange ? '2px' : '0px'}"
        @blur="handleValueChange(localParam.value)"
      >
        <span
          v-if="isShowNumberRange"
          slot="append"
          style="font-size: 12px"
        >{{`${localParam.min}~${localParam.max}`}}</span>
      </MtdInput>

      <div class="left-wrap">
        <MtdRadioGroup
          v-if="localParam.paramType === 'TAB'"
          v-model="localParam.value"
          size="small"
          :disabled="!canEditGraph"
          @input="handleValueChange"
        >
          <MtdRadioButton
            v-for="option in localParam.options"
            :value="option.value"
            :key="option.value"
          >{{option.label}}</MtdRadioButton>
        </MtdRadioGroup>
      </div>

      <section v-if="localParam.paramType === 'DBLABEL'" class="param-content">
        <p class="label-text">{{localParam.value}}</p>
      </section>

      <MtdSelect
        v-if="localParam.paramType === 'SELECTOR'"
        :filterable="true"
        v-model="localParam.value"
        :disabled="!canEditGraph"
        @input="handleValueChange"
        size="small"
        style="width: 100%;"
      >
        <MtdOption
          v-for="option in localParam.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </MtdSelect>
      <div
        v-if="localParam.paramType === 'TEXTAREA'"
        @blur.capture="handleValueChange(localParam.value)"
      >
        <MtdTextarea
          v-model="localParam.value"
          style="width: 100%"
          :disabled="!canEditGraph"
          rows="4"
          cos="5"
          :invalid="!isItemValid"
        />
      </div>

      <DateParam
        v-if="localParam.paramType === 'DATE'"
        v-model="localParam.value"
        :disabled="!canEditGraph"
        @input="handleValueChange"
      />
      <div v-if="localParam.paramType === 'LABEL'" class="label-param-content">
        <label>
          运行情况:
          <span
            style="border: none; padding: 2px 4px"
            :class="runningStatusStyle"
          >{{runningStatusText}}</span>
        </label>
      </div>
      <div
        v-if="localParam.paramType === 'IDE'"
        class="ide-param-content"
        :class="{'not-complete': !localParam.value}"
      >
        <h6 class="param-title">脚本内容{{localParam.value ? '已填写' : '未填写'}}</h6>
        <MtdButton class="submit-btn" @click="openCodeEditor">打开脚本编辑框</MtdButton>
      </div>
      <FeatureArrayParam
        v-if="localParam.paramType === 'feature_array'"
        v-model="localParam"
        :disabled="!canEditGraph"
        @input="setExternalValue"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.param-item {
  .param-item-label {
    display: block;
    font-size: 12px;
    color: #8a94c2;
    text-align: left;
    font-weight: normal;
    margin-top: 12px;
    margin-bottom: 6px;
    i {
      color: #606be1;
      font-size: 12px;
    }
  }
  .ide-param-content {
    width: 100%;
    height: 88px;
    border: 1px solid #dddeeb;
    border-radius: 1px;
    background: #fff;
    &.not-complete {
      border-color: #ff6459;
      .param-title {
        color: #ff6459;
      }
    }
    .param-title {
      color: #666;
      font-size: 14px;
      font-weight: normal;
      margin-top: 10px;
      margin-bottom: 20px;
    }
    .submit-btn {
      height: 30px;
      line-height: 18px;
      font-size: 12px;
      padding: 0 37px;
      border-radius: 2px;
    }
  }

  .label-param-content {
    background: #fff;
    font-size: 12px;
    display: flex;
    border: 1px solid #dddeeb;
    border-radius: 1px;
    padding: 10px;
    label {
      color: #999;
    }
  }
}
.field-select-btn {
  margin-left: 2px;
  width: 178px;
}
.label-text {
  text-align: left;
}
.left-wrap {
  text-align: left;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { EditorModalDisplayController } from '../../stores/graph/graphVisual/LocalState'
import { ParamVo } from '../../types/graph'
import { GlobalState } from '../../stores/global'
import ScriptParam from './ScriptParam.vue'
import DateParam from './DateParam.vue'
import FeatureArrayParam from '@/components/param/FeatureArrayParam.vue'
import bus from '../../common/bus'

@Component({
  components: {
    FeatureArrayParam,
    DateParam,
    ScriptParam
  }
})
export default class ParamItem extends Vue {
  @Prop({
    required: true
  })
  private param!: ParamVo

  private isItemValid = true

  private localParam!: ParamVo

  get canEditGraph() {
    return (this.$store.state as GlobalState).isCurrentGraphCanBeEdit
  }

  get isShowNumberRange() {
    return this.localParam && this.localParam.min && this.localParam.max
  }

  get runningStatusText() {
    switch (this.localParam.value) {
      case '0':
        return '未运行'
      case '40':
        return '失败'
      case '60':
        return '成功'
      default:
        return '未填写'
    }
  }

  get runningStatusStyle() {
    switch (this.localParam.value) {
      case '0':
        return 'processing-status'
      case '40':
        return 'failed-status'
      case '60':
        return 'success-status'
      default:
        return 'stopped-status'
    }
  }

  private verifyParam() {
    let { value } = this.localParam
    const { min, max } = this.localParam
    value = typeof value === 'string' ? value.trim() : value
    try {
      if (this.localParam.paramType === 'NUMBER' && min && max) {
        const newValue = Number(value)
        value = String(newValue)
        this.isItemValid = !(newValue > max || newValue < min)
      } else {
        this.isItemValid = !(
          ['INPUT', 'TEXTAREA'].includes(this.localParam.paramType) &&
          this.localParam.required &&
          !value
        )
      }
    } catch (e) {
      this.$mtd.message(e)
      this.isItemValid = true
    }
    this.localParam.value = value
  }

  private handleValueChange() {
    this.verifyParam()
    if (this.isItemValid) {
      this.$emit('valueChange', this.localParam.value)
    }
  }

  private setExternalValue(value: ParamVo) {
    this.$emit('valueChange', value)
  }

  private handleSelectFieldModelShow(
    type: string,
    nodeId: number,
    paramId: number
  ) {
    bus.$emit('show-select-field', type, nodeId, paramId)
  }

  private openCodeEditor() {
    const { nodeId, paramId, value } = this.localParam
    EditorModalDisplayController.show({
      isShow: true,
      nodeId,
      paramId,
      value: '' // value as string
    })
  }

  private created() {
    this.localParam = this.param
    this.verifyParam()
  }

  // private beforeDestroy() {
  //     bus.$off('show-select-field');
  // }

  @Watch('param')
  private watchParam(value: ParamVo) {
    this.localParam = value
    this.verifyParam()
  }
}
</script>
