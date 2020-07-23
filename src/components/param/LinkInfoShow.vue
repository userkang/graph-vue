<template>
  <div class="param-wrap">
    <div class="param-title">
      <i class="slide"></i>
      <i
        class="iconfont icon-daohangxialasanjiao fold-param-icon"
        :class="{ 'fold-status': isFold }"
        @click="changeFold"
      ></i>
      <h4 class="comp-name">连接信息</h4>
    </div>
    <section class="param-content" v-show="!isFold" v-for="(inSlotsItem, index) in linkConfig.inSlots" :key="index+inSlotsItem.slotName">
      <label class="param-item-label">
        输入桩{{inSlotsItem.slotIndex}}
      </label>
      <p class="label-text">{{inSlotsItem.slotName}}</p>
    </section>

    <section
      class="param-content"
      v-show="!isFold"
      :key="outSlotsItem.slotIndex+index"
      v-for="(outSlotsItem,index) in linkConfig.outSlots"
    >
      <label class="param-item-label">输出桩{{outSlotsItem.slotIndex}}</label>
      <p class="label-text">{{outSlotsItem.slotName}}</p>
    </section>
  </div>
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
.label-text {
  text-align: left;
  color: #666;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { LinkConfigVo } from '../../types/graph'
@Component({
  components: {}
})
export default class LinkInfoShow extends Vue {
  @Prop(Object)
  private linkConfig!: LinkConfigVo

  private isFold = false

  private changeFold() {
    this.isFold = !this.isFold
  }
}
</script>
