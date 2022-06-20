import Vue from 'vue'
import Router from 'vue-router'

import { DAG, Tree, MindMap } from './components'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dag'
    },
    {
      path: '/dag',
      name: 'dag',
      component: DAG
    },
    {
      path: '/tree',
      name: 'tree',
      component: Tree
    },
    {
      path: '/mindMap',
      name: 'mindMap',
      component: MindMap
    }
  ]
})
