<template>
  <div v-show="value">
    <div
      ref="menu"
      class="graph-vue-menu-wrapper"
      :style="{ top: menu.y + 2 + 'px', left: menu.x + 2 + 'px' }"
    >
      <slot :item="menu"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value'],
  data() {
    return {
      menu: {
        x: 0,
        y: 0
      }
    }
  },
  watch: {
    'menu.y'() {
      const menuHeight = this.$refs.menu.getBoundingClientRect().height
      const clientHeight = document.body.clientHeight

      // 如果超过下边界，需要往上修正菜单的 y 值
      if (this.menu.y + menuHeight > clientHeight) {
        this.menu.y -= menuHeight
      }
    }
  },
  methods: {
    showMenu(e) {
      this.menu = {
        x: e.x,
        y: e.y
      }
    },
    hiddenMenu() {
      if (this.value) {
        this.$emit('input', false)
      }
    }
  },
  mounted() {
    document.addEventListener('contextmenu', this.showMenu)
    document.addEventListener('click', this.hiddenMenu)
  },
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
