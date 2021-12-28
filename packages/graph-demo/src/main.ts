import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/normalize.scss'
import './assets/css/variable.scss'
import '@ss/mtd-vue/lib/theme2/index.css'

// 引入组件库
import MTD from '@ss/mtd-vue'

Vue.use(MTD)

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
