<template>
  <div class="left-nav-wrap">
    <mtd-sidebar
      :data="navList"
      item-key="key"
      :active-key="$route.meta.identifier"
      :collapse="isFold"
      :expand-keys="expandKeys"
      @collapse-change="handleCollapseChange"
      @menu-expand-change="handleExpandChange"
      title="机器学习平台"
    ></mtd-sidebar>
  </div>
</template>


<style lang="scss" scoped>
@import '../../../static/css/variable.scss';

.left-nav-wrap {
  height: 100%;
  background: #f4f4f4;
  box-shadow: 1px 0 4px 0 #dddddd;

  ::v-deep .mtd-sidebar {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #666;
  }

  ::v-deep .mtd-sidebar-header {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #333;
  }

  ::v-deep .mtdicon-collapse {
    &::after {
      content: '';
      position: absolute;
      top: -21px;
      right: -6px;
      background-color: #ebeef7;
      margin-top: 4px;
      width: 30px;
      height: 52px;
      clip-path: polygon(0 6px, 2px 4px, 100% 0, 100% 100%, 2px 48px, 0 46px);
      z-index: -1;
    }
  }
}
</style>

<script lang="ts">
import { Vue, Component, Emit, Prop, Watch } from 'vue-property-decorator'
import { leftNavData } from '../../metaData/graph'

@Component
export default class LeftNavBar extends Vue {
  @Prop({
    required: true
  })
  private isFold!: boolean

  @Prop({
    type: Array,
    required: true
  })
  private expandKeys!: string[]

  private host = 'mlp.sankuai.com'

  private navList = leftNavData

  private handleCollapseChange(collaspe: boolean) {
    this.$emit('on-fold')
  }

  private handleExpandChange({ expandKeys }: any) {
    this.$emit('update:expandKeys', expandKeys)
  }
}
</script>
