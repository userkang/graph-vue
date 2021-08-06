<template>
  <div class="demo">
    <button @click="openGit">view me on sankuai</button>
    <div align="left">
      <img src="../../guide/assets/graph.gif" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    openGit() {
      window.open(
        'http://dev.sankuai.com/code/repo-detail/~zhangkangkang02/mlp-graph/file/list'
      )
    }
  }
})
</script>
<style scoped></style>
