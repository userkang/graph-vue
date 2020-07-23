<template>
  <span class="tag" :class="[status]">{{ text }}</span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class JobStatus extends Vue {
  @Prop({
    type: String
  })
  private status!: string

  get text() {
    let text
    switch (this.status) {
      case 'DOWN':
        text = '已创建'
        break
      case 'RUNNING':
        text = '运行中'
        break
      case 'DEPLOYING':
        text = '部署中'
        break
      case 'KILLING':
        text = '停止中'
        break
      case 'FAILED':
        text = '部署失败'
        break
      case 'KILLED':
        text = '已停止'
        break
    }
    return text
  }
}
</script>

<style lang="scss" scoped>
.tag {
  display: inline-block;
  font-size: 12px;
  height: 20px;
  line-height: 16px;
  padding: 3px 8px;
  border-radius: 1px;
}
.DOWN {
  color: #fea92d;
  background: rgba(254, 169, 45, 0.1);
}
.RUNNING {
  color: #606be1;
  background: rgba(96, 107, 225, 0.1);
}
.DEPLOYING {
  color: #118bff;
  background: #f1f8ff;
}
.KILLING {
  color: #ff6459;
  background: rgba(255, 100, 89, 0.1);
}
.FAILED {
  color: #ff6459;
  background: rgba(255, 100, 89, 0.1);
}
</style>
