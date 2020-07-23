<template>
  <div class="treeScorll">
    <div class="search-label">
      我的项目组
      <a
        style="float: right; padding-right: 13px"
        class="highlight-text"
        href="http://data.sankuai.com/rent/#/project"
        target="_blank"
      >前往加入项目组</a>
    </div>
    <div class="select-multiple">
      <mtd-input
        class="select-input"
        ref="input"
        icon="search"
        placeholder="输入项目组名称搜索"
        v-model="value"
      ></mtd-input>
      <mtd-dropdown-menu class="select-tree">
        <mtd-dropdown-menu-item
          class="select-tree-node"
          v-for="item in datasource"
          :key="item.id"
          @click="handleNodeClick(item)"
        >{{item.name}}</mtd-dropdown-menu-item>
      </mtd-dropdown-menu>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Tree } from 'element-ui'
import { WXProjectVoType } from '../../types/graph'

interface DataItem {
  label: string
  key: number
}

@Component({
  components: {
    ElemTree: Tree
  }
})
export default class SelectAppTemplate extends Vue {
  @Prop({
    type: Array
  })
  private data!: WXProjectVoType[]

  private value = ''

  get datasource() {
    return this.data.filter(item => item.name.includes(this.value))
  }

  private handleNodeClick(data: DataItem) {
    this.$emit('change', data)
  }
}
</script>
<style lang='scss' scoped>
.treeScorll {
  .select-multiple {
    outline: none;
    display: inline-block;
    position: relative;
    .select-input {
      width: 308px;
      margin: 0 12px;
    }
    .select-tree {
      min-width: 332px;
      max-height: 158px;
      overflow-y: auto;
      margin-top: 10px;
      .select-tree-node {
        padding-left: 12px;
        height: 34px;
      }
    }
  }
  .search-label {
    font-family: PingFang-SC-Bold;
    font-size: 12px;
    color: #666666;
    height: 35px;
    line-height: 35px;
    margin-left: 12px;
    font-weight: 500;
  }
}
</style>
<style lang="scss">
.el-popover {
  padding: 0 !important;
  border: none !important;
  background: #fff;
  margin-top: 4px !important;
}
</style>
