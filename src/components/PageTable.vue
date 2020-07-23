<template>
  <div>
    <MtdTable :data="data" @update:sortOrder="handleSortChange">
      <EmptyAndLoading slot="empty" :loadingStatus="loadingStatus" />
      <slot name="columns" />
    </MtdTable>
    <div class="right-page" v-if="isPageShow">
      <MtdPagination
        size="small"
        show-size-changer
        show-total
        :current-page.sync="localPage"
        :page-size.sync="localSize"
        :pageSizeOptions="[20, 50, 100]"
        :total="total"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import EmptyAndLoading from './EmptyAndLoading.vue'
import { SortType } from '@/types/common'

@Component({
  components: {
    EmptyAndLoading
  }
})
export default class PageTable extends Vue {
  @Prop({
    type: Array,
    required: true,
    default: () => []
  })
  private data!: any[]

  @Prop({
    type: Number,
    required: true,
    default: 1
  })
  private page!: number

  @Prop({
    type: Number,
    required: true,
    default: 20
  })
  private size!: number

  @Prop({
    type: Number,
    required: true,
    default: 0
  })
  private total!: number

  @Prop({
    type: Boolean,
    default: true
  })
  private isPageShow!: boolean

  @Prop({
    type: String,
    default: 'LOADED'
  })
  private loadingStatus!: string

  private localPage = this.page
  private localSize = this.size

  private handlePageChange(...value: number[]) {
    const [page, size] = value
    this.$emit('pageChange', {
      page,
      size
    })
  }

  private handleSortChange(value: SortType) {
    this.$emit('sortChange', {
      sort: value.prop,
      order: value.order === 'ascending' ? 'asc' : 'desc'
    })
  }

  @Watch('page')
  private watchPage(value: number) {
    this.localPage = value
  }

  @Watch('size')
  private watchSize(value: number) {
    this.localSize = value
  }
}
</script>
