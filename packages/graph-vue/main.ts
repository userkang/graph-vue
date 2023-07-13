import * as components from './components/index'

export * from './components/index'
export * from '@datafe/graph-core'

export default {
  install(Vue) {
    Object.keys(components).forEach(key => {
      Vue.component(key, components[key])
    })
  }
}
