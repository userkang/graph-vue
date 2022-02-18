<template>
  <div
    class="graph-node"
    :class="{ 'graph-node-active': node.hasState('selected') }"
  >
    {{ node.model.label }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { INode } from '@datafe/graph-core'

@Component
export default class Node extends Vue {
  @Prop({
    required: true
  })
  node!: INode
}
</script>
