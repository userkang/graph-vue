<template>
  <span>
    {{statusMap[statusItem.status].label}}
    <i
      style="font-style: normal"
      :class="[statusMap[statusItem.status].textClass]"
    >{{statusItem.num}}</i>
    条
    <template v-if="!isEnd">，</template>
  </span>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { GraphStatusItem } from '../stores/graph/GraphHistory'
import { execStatusMap } from '../metaData/graph'

@Component
export default class StatusTag extends Vue {
  @Prop({})
  private statusItem!: GraphStatusItem

  @Prop({
    type: Boolean
  })
  private isEnd!: boolean

  private statusMap = execStatusMap
}
</script>
