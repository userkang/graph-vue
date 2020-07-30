import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/normalize.scss'
// import './assets/css/flex.scss'
import './assets/css/variable.scss'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
