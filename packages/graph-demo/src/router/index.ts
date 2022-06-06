import Vue from 'vue'
import Router from 'vue-router'

import { GraphContainer, DAG, Tree } from './components'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/graphContainer/dag'
    },
    {
      path: '/graphContainer',
      redirect: '/graphContainer/dag',
      component: GraphContainer,
      children: [
        { name: 'dag', path: 'dag', component: DAG },
        { name: 'tree', path: 'tree', component: Tree }
      ]
    }
  ]
})
