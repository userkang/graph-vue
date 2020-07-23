import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '../static/css/normalize.scss'
import '../static/css/flex.scss'
import '../static/css/variable.scss'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
