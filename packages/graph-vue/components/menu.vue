<template>
  <div v-show="value">
    <ul
      ref="menu"
      class="menu-tips"
      :style="{ top: menu.y + 2 + 'px', left: menu.x + 2 + 'px' }"
    >
      <slot :item="menu"></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import GraphContent from './graph.vue'

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

  get graph() {
    return (this.$parent as GraphContent).graph
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

  showMenu(e: MouseEvent, data) {
    this.menu = {
      x: e.x,
      y: e.y
    }
  }

  hiddenMenu() {
    if (this.value) {
      this.$emit('input', false)
    }
  }

  mounted() {
    this.graph.on('contextmenu', this.showMenu)
    document.addEventListener('click', this.hiddenMenu)
  }

  beforeDestroy() {
    document.removeEventListener('click', this.hiddenMenu)
  }
}
</script>

<style lang="scss" scoped>
.menu-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
}
.menu-tips {
  width: 120px;
  position: fixed;
  z-index: 100;
  background: #fff;
  box-shadow: 0 0 4px 0 rgba(50, 57, 131, 0.25);
  border-radius: 1px;
}
</style>
