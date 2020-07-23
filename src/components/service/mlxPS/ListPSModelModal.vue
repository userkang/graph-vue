<template>
  <CommonModal @close="handleClose" title="PS模型列表" width="900px">
    <mtd-table :data="psList">
      <mtd-table-column prop="modelName" label="model_name"></mtd-table-column>
      <mtd-table-column prop="groupName" label="group_name:model_index"></mtd-table-column>
      <mtd-table-column prop="lastAccessTime" label="last_access_time"></mtd-table-column>
      <mtd-table-column label="操作">
        <template slot-scope="scope">
          <mtd-button
            v-if="scope.row.metricOperator"
            @click="lookupMlx(scope.row)"
            class="table-link-btn"
            type="text-primary"
          >查看指标</mtd-button>
          <!-- <span class="checkPS">查看指标</span> -->
          <mtd-button v-else type="text-primary" disabled>查看指标</mtd-button>
        </template>
      </mtd-table-column>
    </mtd-table>
  </CommonModal>
</template>

<style lang="scss" scoped>
.checkPS {
  color: #606be1;
  font-size: 13px;
  cursor: pointer;
  &-disable {
    color: #bbb;
    cursor: auto;
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommonModal from '@/components/CommonModal.vue'

@Component({
  components: { CommonModal }
})
export default class ListPSModelModal extends Vue {
  @Prop({
    required: true
  })
  private psList!: []

  private lookupMlx(data: any) {
    this.$emit('lookupMlx', {
      modelName: data.modelName
    })
    this.handleClose()
  }

  private handleClose() {
    this.$emit('close')
  }
}
</script>
