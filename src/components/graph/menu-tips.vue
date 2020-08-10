<template>
  <div ref="menubox" v-show="menu.show">
    <div
      @click="menu.show = false"
      class="menu-mask"
      @contextmenu="e => e.preventDefault()"
    ></div>
    <ul
      ref="menu"
      class="menu-tips"
      :style="{ top: menu.y + 2 + 'px', left: menu.x + 2 + 'px' }"
    >
      <template v-if="menu.type === 'node'">
        <li @click="deleteNode">
          删除
        </li>
        <li>
          复制
        </li>
      </template>
      <template v-else>
        <li @click="deleteLine">
          删除
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { NodeStore } from '@/stores/graph/node'
import { EdgeStore } from '../../stores/graph/edge'

@Component
export default class MenuTips extends Vue {
  @Prop({
    required: true
  })
  menu!: IMenu

  async deleteNode() {
    await NodeStore.deleteNode(this.menu.data)
    this.menu.show = false
  }

  async deleteLine() {
    await EdgeStore.deleteEdge(this.menu.data)
    this.menu.show = false
  }

  @Watch('menu.y')
  handleMenuY() {
    this.$nextTick(() => {
      const menuHeight = (this.$refs
        .menu as HTMLElement).getBoundingClientRect().height
      const clientHeight = document.body.clientHeight

      // 如果超过下边界，需要往上修正菜单的 y 值
      if (this.menu.y + menuHeight > clientHeight) {
        this.menu.y = clientHeight - menuHeight - 5
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
