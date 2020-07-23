<template>
  <LoadingIcon v-if="loadingStatus === 'LOADING' || loadingStatus === true" />
  <EmptyIcon v-else />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import LoadingIcon from './LoadingIcon.vue'
import EmptyIcon from './EmptyIcon.vue'
@Component({
  components: { EmptyIcon, LoadingIcon }
})
export default class EmptyAndLoading extends Vue {
  @Prop({
    type: [String, Boolean], // NOTE: 之所以有String类型是为了兼容历史代码
    default: 'LOADING'
  })
  private loadingStatus!: string
}
</script>
