<template>
  <ul class="time-panel" v-if="formattedStatusValue.submitTime">
    <li>
      <label>开始时间: {{formattedStatusValue.submitTime}}</label>
    </li>
    <li v-if="formattedStatusValue.finishTime">
      <label>结束时间: {{formattedStatusValue.finishTime}}</label>
    </li>
    <li v-if="execTime">
      <label>运行时长: {{execTime}}</label>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.time-panel {
  position: absolute;
  display: flex;
  left: 192px;
  top: 55px;
  font-size: 12px;
  color: #999;
  background: #fff;
  z-index: 999;
  top: 93px;
  li {
    margin-right: 4px;
  }
}
</style>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import {
  parsePreciseTime,
  calculateDuration,
  formatTime
} from '../../common/utils'
import { GraphStatusStore } from '../../stores/graph/graphVisual/GraphContent'
import { ExecStatusVoType } from '../../types/graph'

@Component
export default class TimePanel extends Vue {
  private graphStatusState = GraphStatusStore.state
  private timer = 0
  private execTime = ''

  get graphStatusValue() {
    return this.graphStatusState.value
  }

  get shouldShowExecTime() {
    return ![0, 10].includes(this.graphStatusValue.status)
  }

  get formattedStatusValue() {
    const value = this.graphStatusValue
    return {
      ...value,
      submitTime: value.submitTime
        ? parsePreciseTime(formatTime(value.submitTime))
        : 0,
      finishTime: value.finishTime
        ? parsePreciseTime(formatTime(value.finishTime))
        : 0
    }
  }

  private setExecTime() {
    if (this.graphStatusValue.finishTime) {
      this.execTime = calculateDuration(
        formatTime(this.graphStatusValue.finishTime).getTime() -
          formatTime(this.graphStatusValue.submitTime).getTime()
      )
    } else {
      if (this.graphStatusValue.submitTime) {
        this.execTime = calculateDuration(
          new Date().getTime() -
            formatTime(this.graphStatusValue.submitTime).getTime()
        )
      }
    }
  }

  private detectAndCleanTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = 0
    }
  }

  private setTimer() {
    this.timer = setInterval(() => {
      this.setExecTime()
    }, 1000)
  }

  private mounted() {
    this.detectAndCleanTimer()
    if (this.shouldShowExecTime) {
      this.setExecTime()
      if (!this.graphStatusValue.finishTime) {
        this.setTimer()
      }
    }
  }

  private beforeDestroy() {
    this.detectAndCleanTimer()
  }

  @Watch('graphStatusValue', { deep: true })
  private watchGraphStatus(value: ExecStatusVoType) {
    this.detectAndCleanTimer()
    if (this.shouldShowExecTime) {
      this.setExecTime()
      if (!value.finishTime) {
        this.setTimer()
      }
    }
  }
}
</script>
