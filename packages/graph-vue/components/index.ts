import GraphVue from './graph.vue'
import ToolBox from './tool-box.vue'
import Menu from './menu.vue'
import MiniMap from './minimap.vue'

// @ts-ignore
GraphVue.install = Vue => {
  // @ts-ignore
  Vue.component(GraphVue.name, GraphVue)
}

// @ts-ignore
ToolBox.install = Vue => {
  // @ts-ignore
  Vue.component(ToolBox.name, ToolBox)
}

// @ts-ignore
Menu.install = Vue => {
  // @ts-ignore
  Vue.component(Menu.name, Menu)
}

// @ts-ignore
MiniMap.install = Vue => {
  // @ts-ignore
  Vue.component(MiniMap.name, MiniMap)
}

export { GraphVue, ToolBox, Menu, MiniMap }
