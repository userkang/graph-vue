<template>
  <div>
    <AddServing :show.sync="isShowAddServing" :editData="editData" :isAdd="isAdd" />

    <InfoTitle title="关联服务">
      <div slot="content" class="flex-end-v-center">
        <mtd-button type="primary" size="small" @click="addServing">添加关联服务</mtd-button>
      </div>
    </InfoTitle>

    <mtd-table :data="servingMappings">
      <EmptyAndLoading slot="empty" :loadingStatus="loadingStatus" />
      <mtd-table-column label="服务appkey" width="180px" prop="appkey" />
      <mtd-table-column label="关联时间" prop="createTime" />
      <mtd-table-column label="告警接收人" prop="receiver" />
      <mtd-table-column label="操作">
        <template slot-scope="scope">
          <i
            class="mtdicon mtdicon-edit-o icon-theme"
            style="margin-right: 15px"
            @click="editServing(scope.row)"
          ></i>
          <i class="mtdicon mtdicon-delete-o icon-theme" @click="deleteServing(scope.row.id)"></i>
        </template>
      </mtd-table-column>
    </mtd-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import InfoTitle from '@/components/InfoTitle.vue'
import { DetailStore } from '@/stores/monitor/detail'
import EmptyAndLoading from '@/components/EmptyAndLoading.vue'
import AddServing from '@/components/monitor/modal/AddServing.vue'
import { AlarmServingTemplateMappingVo } from '@/types/monitor'

@Component({
  components: {
    InfoTitle,
    EmptyAndLoading,
    AddServing
  }
})
export default class AssociatedService extends Vue {
  DetailState = DetailStore.state
  isShowAddServing = false
  editData: {} | null = null
  isAdd = true

  get loadingStatus() {
    return this.DetailState.loading
  }

  get servingMappings() {
    return this.DetailState.detail.servingMappings
  }

  addServing() {
    this.isShowAddServing = true
    this.isAdd = true
  }

  editServing(row: AlarmServingTemplateMappingVo) {
    this.isShowAddServing = true
    this.editData = row
    this.isAdd = false
  }

  async deleteServing(id: string) {
    await this.$mtd.confirm({
      title: '确认删除该关联服务？',
      type: 'warning',
      showCancelButton: true,
      okButtonText: '删除',
      okButtonProps: {
        type: 'danger'
      }
    })

    const templateId = this.$route.params.templateId
    await DetailStore.deleteServing(templateId, id)
    await DetailStore.getTemplate(templateId)
  }
}
</script>

<style lang="scss" scoped>
.icon-theme {
  color: #606be1;
  font-size: 14px;
  cursor: pointer;
}
</style>