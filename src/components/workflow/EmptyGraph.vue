<template>
  <div class="empty-graph">
    <img src="../../assets/emptyGraph.png" alt="emptyGraph" />
    <div class="handle-area">
      <h3>抱歉，您没有选择任何工作流！</h3>
      <p style="margin-top: 15px">
        用户手册请参考：
        <a
          href="https://km.sankuai.com/page/367720058"
          target="_blank"
          class="highlight-text"
        >用户手册</a>
      </p>
      <p style="margin-top: 5px">
        请求支持请联系：
        <span style="user-select: all">xiaoyongsheng</span>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.empty-graph {
  display: flex;
  margin-top: 200px;
  justify-content: center;
  align-items: center;
  text-align: left;
  img {
    width: 180px;
    height: 110px;
  }
  .handle-area {
    margin-left: 30px;
    h3 {
      font-weight: normal;
      color: #2f3361;
    }
    p {
      color: #666;
    }
  }
}
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class EmptyGraph extends Vue {
  private openCreateModal() {
    this.$emit('openCreateModal')
  }
}
</script>
