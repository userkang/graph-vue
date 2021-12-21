import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/normalize.scss'
import './assets/css/variable.scss'

import graph from '../../graph-vue/index'

Vue.config.productionTip = false

console.log(graph)
Vue.use(graph)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
