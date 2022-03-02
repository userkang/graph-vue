<template>
  <div v-show="value">
    <ul
      ref="menu"
      class="graph-vue-menu-wrapper"
      :style="{ top: menu.y + 2 + 'px', left: menu.x + 2 + 'px' }"
    >
      <slot :item="menu"></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class Menu extends Vue {
  @Prop({
    required: true
  })
  value!: boolean

  menu = {
    x: 0,
    y: 0
  }

  @Watch('menu.y')
  handleMenuY() {
    setTimeout(() => {
      const menuHeight = (
        this.$refs.menu as HTMLElement
      ).getBoundingClientRect().height
      const clientHeight = document.body.clientHeight

      // 如果超过下边界，需要往上修正菜单的 y 值
      if (this.menu.y + menuHeight > clientHeight) {
        this.menu.y -= menuHeight
      }
    })
  }

  showMenu(e: MouseEvent) {
    this.menu = {
      x: e.x,
      y: e.y
    }
  }

  hiddenMenu() {
    if (this.value) {
      console.log(this.value)
      this.$emit('input', false)
    }
  }

  mounted() {
    document.addEventListener('contextmenu', this.showMenu)
    document.addEventListener('click', this.hiddenMenu)
  }

  beforeDestroy() {
    document.removeEventListener('contextmenu', this.showMenu)
    document.removeEventListener('click', this.hiddenMenu)
  }
}
</script>

<style lang="scss">
.graph-vue-menu-wrapper {
  width: 120px;
  position: fixed;
  z-index: 100;
  background: #fff;
  box-shadow: 0 0 4px 0 rgba(50, 57, 131, 0.25);
  border-radius: 1px;
}
</style>