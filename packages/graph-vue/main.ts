import * as components from './components/index'

export * from 'graph-logic'
export * from './components/index'

export default {
  install(Vue) {
    Object.keys(components).forEach(key => {
      Vue.component(key, components[key])
    })
  }
}
