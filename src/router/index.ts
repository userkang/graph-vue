import Vue from 'vue'
import Router from 'vue-router'

import { Graph } from './comonents'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/graph',
    },
    {
      path: '/graph',
      component: Graph,
    },
  ],
})
