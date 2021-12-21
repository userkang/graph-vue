<template>
  <div id="app">
    <Node />
    <!-- <router-view /> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Node } from '@datafe/graph-vue'

@Component({
  components: {
    Node,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import url('//at.alicdn.com/t/font_1805014_otecrmgzsf.css');
</style>
