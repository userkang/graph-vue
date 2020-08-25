<template>
  <div v-if="graph" v-show="menu.show">
    <div
      @click="menu.show = false"
      class="menu-mask"
      @contextmenu="e => e.preventDefault()"
    ></div>
    <ul
      ref="menu"
      class="menu-tips"
      :style="{ top: menu.y + 2 + 'px', left: menu.x + 2 + 'px' }"
      @click="clickMenu"
    >
      <slot />
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import GraphContent from './graph.vue'

@Component
export default class Menu extends Vue {
  get graph() {
    return (this.$parent as GraphContent).graph
  }

  get menu() {
    if (this.graph) {
      return this.graph.menuController.menu
    }
  }

  clickMenu(e: MouseEvent) {
    this.$emit('click', e, this.graph.menuController.menu)
  }

  @Watch('menu.y')
  handleMenuY() {
    this.$nextTick(() => {
      const menuHeight = (this.$refs
        .menu as HTMLElement).getBoundingClientRect().height
      const clientHeight = document.body.clientHeight

      // 如果超过下边界，需要往上修正菜单的 y 值
      if (this.menu.y + menuHeight > clientHeight) {
        this.menu.y -= menuHeight
      }
    })
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
  li {
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    color: #666;
    font-size: 12px;
    cursor: pointer;
    &:hover {
      color: #333;
      background: #f2f3fa;
    }
  }
}
</style>
