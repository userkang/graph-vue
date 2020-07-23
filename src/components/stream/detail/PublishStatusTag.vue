<template>
  <span class="text" :class="[status]">{{ text }}</span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class PublishStatusTag extends Vue {
  @Prop({
    type: String
  })
  private status!: string

  get text() {
    switch (this.status) {
      case 'SUCCESS':
        return '成功'
        break
      case 'FAILURE':
        return '失败'
        break
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
  font-size: 13px;
}
.SUCCESS {
  color: #5abb3c;
}
.FAILURE {
  color: #ff6459;
}
</style>
