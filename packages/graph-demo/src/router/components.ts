export const GraphContainer = () =>
  import(
    /* webpackChunkName: "graphContainer"*/
    '../views/graph-editor.vue'
  )

export const DAG = () =>
  import(
    /* webpackChunkName: "dag"*/
    '../views/templates/DAG.vue'
  )

export const Tree = () =>
  import(
    /* webpackChunkName: "tree"*/
    '../views/templates/Tree.vue'
  )
