import Node from './components/node'

const components = [Node]

const install = (Vue) => {
  components.map((component) => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export { Node }

export default {
  install,
  Node
}
