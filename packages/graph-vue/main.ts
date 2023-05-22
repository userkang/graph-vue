import { defineComponent } from 'vue-demi'
import GraphVue from './components/graph.vue'
import ToolBox from './components/tool-box.vue'
import Menu from './components/menu.vue'
import MiniMap from './components/minimap.vue'

const components = { GraphVue, ToolBox, Menu, MiniMap }

export { GraphVue, ToolBox, Menu, MiniMap }

export * from '@datafe/graph-core'

export default {
  install(Vue) {
    Object.keys(components).forEach(key => {
      Vue.component(key, defineComponent(components[key]))
    })
  }
}
