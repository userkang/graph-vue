<template>
  <div>
    <InfoTitle title="基础信息" />
    <InfoItem label="创建人">{{ detail.creator }}</InfoItem>
    <InfoItem label="更新时间">{{ detail.updateTime }}</InfoItem>
    <InfoItem label="创建时间">{{ detail.createTime }}</InfoItem>
    <InfoItem label="描述">
      <div v-if="isDescriptionEdit">
        <mtd-textarea rows="3" maxlength="50" v-model="editDesciption" size="small" />
        <i class="mtdicon mtdicon-close-thick confirm-icon" @click="isDescriptionEdit = false"></i>
        <i class="mtdicon mtdicon-check-thick confirm-icon" @click="submitDescription"></i>
      </div>
      <div v-else>
        <span>{{ detail.description }}</span>
        <i class="iconfont icon-Dashboard-mingchengbianji edit-icon" @click="goEditDescription"></i>
      </div>
    </InfoItem>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import InfoItem from '@/components/InfoItem.vue'
import InfoTitle from '@/components/InfoTitle.vue'
import { DetailStore } from '@/stores/monitor/detail'

@Component({
  components: {
    InfoItem,
    InfoTitle
  }
})
export default class BasicInfo extends Vue {
  DetailState = DetailStore.state
  isDescriptionEdit = false
  editDesciption = ''

  goEditDescription() {
    this.isDescriptionEdit = true
    this.editDesciption = this.detail.description
  }

  async submitDescription() {
    const templateId = this.$route.params.templateId
    await DetailStore.modifyTemplate(templateId, {
      name: this.detail.name,
      description: this.editDesciption
    })

    await DetailStore.getTemplate(templateId)
    this.isDescriptionEdit = false
  }

  get detail() {
    return this.DetailState.detail
  }
}
</script>

<style lang="scss" scoped>
.edit-icon {
  font-size: 14px;
  color: #606be1;
  cursor: pointer;
  margin-left: 10px;
}
.confirm-icon {
  font-size: 16px;
  color: #606be1;
  cursor: pointer;
  margin-left: 10px;
}
</style>