<template>
  <div
    class="graph-vue-node"
    :class="{ 'graph-vue-node-active': node.hasState('selected') }"
  >
    {{ node.model.label }}
  </div>
</template>

<script>
import { defineComponent } from 'vue-demi'
export default defineComponent({
  props: ['node']
})
</script>

<style lang="scss">
.graph-vue-node {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #666;
  border-width: 1px;
  border-style: solid;
  border-radius: 2px;
  box-sizing: border-box;
  cursor: pointer;
  border-color: #dedfec;
  background: rgba(252, 252, 251, 0.9);
}
.graph-vue-node-active {
  border-color: #606be1;
  background: rgba(185, 200, 245, 0.9);
}
</style>
