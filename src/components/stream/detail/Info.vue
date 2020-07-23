<template>
  <div class="wrap">
    <div class="base">
      <InfoItem label="创建人">{{ detail.creator }}</InfoItem>
      <InfoItem label="创建时间">{{ detail.createTime }}</InfoItem>
      <InfoItem label="更新时间">{{ detail.updateTime }}</InfoItem>
    </div>
    <div class="base" style="margin-top: 20px;">
      <InfoItem label="备注">
        <mtd-textarea v-model="detail.notes" rows="1" maxlength="50"></mtd-textarea>
      </InfoItem>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { StreamInfoStore } from '@/stores/stream/detail'
import InfoItem from '../../../components/InfoItem.vue'

@Component({
  components: {
    InfoItem
  }
})
export default class Info extends Vue {
  private detailState = StreamInfoStore.state
  get detail() {
    return this.detailState.value
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  font-size: 14px;
  .base {
    display: flex;
    justify-content: space-between;
    padding: 0 100px;
  }
}
</style>
