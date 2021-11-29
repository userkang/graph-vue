<template>
  <div class="tooltip-wrap" ref="wrap">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class ToolTip extends Vue {
  @Prop({
    type: String,
    default: ''
  })
  message: string

  @Prop({
    type: String,
    default: 'right'
  })
  placement: string

  tooltip: HTMLDivElement = null
  wrap: HTMLDivElement = null

  showTimer = null
  closeTimer = null

  async handleMouseEnter() {
    clearTimeout(this.closeTimer)
    this.tooltip.style.display = 'block'

    this.showTimer = setTimeout(() => {
      this.tooltip.style.opacity = '1'
    }, 0)
  }

  handleMouseLeave() {
    clearTimeout(this.showTimer)
    this.tooltip.style.opacity = '0'
    this.closeTimer = setTimeout(() => {
      this.tooltip.style.display = 'none'
    }, 500)
  }

  created() {
    this.$nextTick(() => {
      const wrap = this.$refs.wrap as HTMLDivElement
      console.log(wrap)
      const {
        width: wrapWidth,
        height: wrapHeight,
        left: wrapLeft,
        top: wrapTop,
        right: wrapRight,
        bottom: wrapBottom
      } = wrap.getBoundingClientRect()

      const tooltipHeight = 30
      const tooltipShift = 20
      const tooltip = document.createElement('div')
      tooltip.classList.add('tooltip')
      tooltip.innerHTML = `<span>${this.message}</span>`

      tooltip.style.height = `${tooltipHeight}px`
      tooltip.style.lineHeight = `${tooltipHeight}px`

      switch (this.placement) {
        case 'top':
          tooltip.classList.add('top')
          tooltip.style.left = `${wrapLeft + wrapWidth / 2}px`
          tooltip.style.top = `${wrapTop - tooltipHeight - tooltipShift}px`
          tooltip.style.transform = 'translateX(-50%)'
          break
        case 'right':
          tooltip.classList.add('right')
          tooltip.style.left = `${wrapRight + tooltipShift}px`
          tooltip.style.top = `${wrapTop +
            wrapHeight / 2 -
            tooltipHeight / 2}px`
          break
        case 'bottom':
          tooltip.classList.add('bottom')
          tooltip.style.left = `${wrapLeft + wrapWidth / 2}px`
          tooltip.style.top = `${wrapBottom + tooltipShift}px`
          tooltip.style.transform = 'translateX(-50%)'
          break
        case 'left':
          tooltip.classList.add('left')
          tooltip.style.left = `${wrapLeft - tooltipShift}px`
          tooltip.style.top = `${wrapTop +
            wrapHeight / 2 -
            tooltipHeight / 2}px`
          tooltip.style.transform = 'translateX(-100%)'

          break
        default:
          break
      }

      wrap.appendChild(tooltip)

      wrap.addEventListener('mouseenter', this.handleMouseEnter)

      wrap.addEventListener('mouseleave', this.handleMouseLeave)

      this.tooltip = tooltip
      this.wrap = wrap
    })
  }

  beforeDestroy() {
    this.wrap.addEventListener('mouseenter', this.handleMouseEnter)
    this.wrap.addEventListener('mouseleave', this.handleMouseLeave)
  }
}
</script>

<style scoped lang="scss">
.tooltip-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>


<style lang="scss">
$main-color: #575c95;
.tooltip {
  position: fixed;
  z-index: 3000;
  background-color: $main-color;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  display: none;
  opacity: 0;
  transition: all 0.5s;
  &::after {
    position: absolute;
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    background: $main-color;
  }
  &.right::after {
    left: -5px;
    top: 50%;
    transform: translate(0, -50%) rotate(45deg);
  }
  &.top::after {
    left: 50%;
    top: 100%;
    transform: translate(-50%, -50%) rotate(45deg);
  }
  &.bottom::after {
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%) rotate(45deg);
  }
  &.left::after {
    right: -5px;
    top: 50%;
    transform: translate(0, -50%) rotate(45deg);
  }
}
</style>
