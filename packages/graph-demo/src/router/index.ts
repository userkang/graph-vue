import Vue from 'vue'
import Router from 'vue-router'

import { DAG, Tree, MindMap, NodeCell, MindLayout } from './components'

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
    },
    {
      path: '/nodeCell',
      name: 'nodeCell',
      component: NodeCell
    },
    {
      path: '/multiNodeCell',
      name: 'multiNodeCell',
      component: () =>
        import(
          /* webpackChunkName: "CircleLayout"*/
          '../views/MultiNodeCell.vue'
        )
    },
    {
      path: '/circleLayout',
      name: 'circleLayout',
      component: () =>
        import(
          /* webpackChunkName: "CircleLayout"*/
          '../views/CircleLayout.vue'
        )
    },
    {
      path: '/nodePort',
      name: 'nodePort',
      component: () =>
        import(
          /* webpackChunkName: "NodePort"*/
          '../views/NodePort.vue'
        )
    },
    {
      path: '/mindLayout',
      name: 'mindLayout',
      component: MindLayout
    }
  ]
})
