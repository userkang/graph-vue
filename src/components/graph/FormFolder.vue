<template>
  <div class="form-folder">
    <div class="fold-table-icon-wrap" @click="handleFold">
      <svg width="9" height="60" fill="blue">
        <polygon points="0 6, 0 54, 9 60, 9 0, 0 6" fill="#F7F9FF" />
        <path d="M9 0, L0 6, L0 54, L9 60" stroke="#E4E8F5" stroke-width="1" fill="transparent" />
        <rect x="3" y="22" width="3" height="3" rx="1.5" ry="1.5" fill="#8A94C2" />
        <rect x="3" y="28" width="3" height="3" rx="1.5" ry="1.5" fill="#8A94C2" />
        <rect x="3" y="34" width="3" height="3" rx="1.5" ry="1.5" fill="#8A94C2" />
      </svg>
    </div>
    <div id="rightScaleLine" class="scale-line"></div>
  </div>
</template>

<style lang="scss" scoped>
.form-folder {
  position: relative;
  width: 8px;
  background: transparent;
  z-index: 1001;
  .fold-table-icon-wrap {
    position: absolute;
    top: calc(50% - 30px);
    left: 0;
    width: 9px;
    height: 60px;
    color: #8a94c2;
    box-sizing: border-box;
    cursor: pointer;
    .fold-table-icon {
      display: inline-block;
      width: 100%;
      height: 100%;
      background: #f7f9ff;
      clip-path: polygon(0 6px, 0 54px, 9px 60px, 9px 0, 0 6px);
    }
  }
  .scale-line {
    position: absolute;
    top: -44px;
    bottom: 0;
    right: -2px;
    width: 3px;
    &:hover {
      cursor: col-resize;
      background: #606be1;
    }
  }
}
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { HistoryListController } from '@/stores/graph/graphVisual/HistoryList'

@Component
export default class FormFolder extends Vue {
  private scaleLine!: HTMLDivElement
  private formPanel!: HTMLElement
  private initX = 0
  private initFormPanelWidth = 0
  private graphListState = HistoryListController.state

  private handleFold() {
    this.$store.commit('changeRightTableFold')
  }

  private handleMouseMove(e: MouseEvent) {
    const moveX = this.initX - e.clientX
    document.body.style.userSelect = 'none'
    this.scaleLine.style.background = '#606be1'
    this.formPanel.style.width = this.initFormPanelWidth + moveX + 'px'
    this.graphListState.resize = !this.graphListState.resize
  }

  private handleMouseUp() {
    document.removeEventListener('mousemove', this.handleMouseMove, true)
    document.removeEventListener('mouseup', this.handleMouseUp, true)
    document.body.style.userSelect = 'auto'
    this.scaleLine.style.background = ''
  }

  private handleMouseDown(e: MouseEvent) {
    this.initX = e.clientX
    this.initFormPanelWidth = this.formPanel.getBoundingClientRect().width
    document.addEventListener('mousemove', this.handleMouseMove, true)
    document.addEventListener('mouseup', this.handleMouseUp, true)
  }

  private mounted() {
    this.scaleLine = document.getElementById('rightScaleLine') as HTMLDivElement
    this.formPanel = document.querySelector('.form-panel-wrap') as HTMLElement

    this.scaleLine.addEventListener('mousedown', this.handleMouseDown, true)
  }
}
</script>
