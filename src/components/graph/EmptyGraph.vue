<template>
  <div class="empty-graph">
    <img src="../../assets/emptyGraph.png" alt="emptyGraph" />
    <div class="handle-area">
      <h3>抱歉，您没有选择任何实验！</h3>
      <p>
        还没有创建任何实验，
        <a href="javascript:void(0)" class="highlight-text" @click="openCreateModal">去创建</a>
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
