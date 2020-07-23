<template>
  <li class="param-wrap">
    <div class="param-title">
      <i class="slide"></i>
      <i
        class="iconfont icon-daohangxialasanjiao fold-param-icon"
        :class="{ 'fold-status': isFold }"
        @click="changeFold"
      ></i>
      <h4 class="comp-name">{{paramTab.tabLabel}}</h4>
    </div>
    <section class="param-content" v-show="!isFold">
      <ParamItem
        v-for="(param, index) in paramTab.params"
        :key="param.paramId"
        :param="param"
        @valueChange="(value) => handleValueChange(value, param.paramId, index)"
      />
    </section>
  </li>
</template>

<style lang="scss" scoped>
.param-wrap {
  padding-bottom: 12px;
  margin-top: 12px;
  border-bottom: 1px solid #e4e8f5;
  .param-title {
    display: flex;
    position: relative;
    height: 22px;
    .slide {
      position: absolute;
      display: inline-block;
      left: 0;
      top: 4px;
      background: #606be1;
      width: 2px;
      height: 14px;
    }
    .comp-name {
      position: absolute;
      top: 0;
      left: 20px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #666666;
      margin-left: 4px;
    }
    .fold-param-icon {
      color: #d3d8eb;
      font-size: 12px;
      position: absolute;
      top: 0;
      left: 10px;
      &.fold-status {
        transform: rotate(-90deg);
      }
    }
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ParamTabVo } from '../../types/graph'
import { NodeParamStore } from '../../stores/graph/graphVisual/GraphVisual'
import ParamItem from './ParamItem.vue'
import LoadingIcon from '../LoadingIcon.vue'
@Component({
  components: {
    LoadingIcon,
    ParamItem
  }
})
export default class NodeParam extends Vue {
  @Prop({
    required: true
  })
  private paramTab!: ParamTabVo

  private isFold = false

  private changeFold() {
    this.isFold = !this.isFold
  }

  private async handleValueChange(
    value: number | string | boolean,
    paramId: number,
    tabIndex: number
  ) {
    await NodeParamStore.setSingleParamValue({
      paramId,
      value,
      tabIndex
    })
  }
}
</script>
