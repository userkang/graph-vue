<template>
  <div class="test-slot">
    <slot name="node" v-bind:user="user"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class TestSlot extends Vue {
  user = {
    firstName: 'zhang',
    lastName: 'san'
  }
}
</script>

<style lang="scss" scoped></style>
