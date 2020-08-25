<template>
  <div class="main-wrap">
    <ComponentPanel class="component-panel" />
    <div class="main-center-wrap">
      <Graph ref="graphRef" :data="data" :nodeStyle="nodeStyle" drection="h">
        <ToolBox />
        <Menu @click="clickMenu">
          <li id="delete">删除</li>
        </Menu>
      </Graph>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ComponentPanel from '@/components/component-panel.vue'
import Graph from '@/components/graph.vue'
import ToolBox from '@/components/tool-box.vue'
import Menu from '@/components/menu.vue'

import GraphStore from '@/stores/graph'

interface CopyReturnValue {
  graphId: number
  graphName: string
}

@Component({
  components: {
    Graph,
    ComponentPanel,
    ToolBox,
    Menu
  }
})
export default class GraphEditor extends Vue {
  data!: IGraphDataType

  nodeStyle = {
    width: 190,
    height: 35,
    rx: 2,
    ry: 2
  }

  clickMenu(e: MouseEvent, menu: IMenu) {
    console.log((e.target as HTMLElement).id, menu)
    menu.show = false
  }

  created() {
    this.data = GraphStore.getData()
  }
}
</script>

<style lang="scss" scoped>
.main-wrap {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
}
.main-center-wrap {
  flex: 1;
}
</style>
