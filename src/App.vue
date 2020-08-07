<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class App extends Vue {}
</script>

<style lang="scss">
@import url('//at.alicdn.com/t/font_1805014_qst1gnzsqar.css');
</style>
