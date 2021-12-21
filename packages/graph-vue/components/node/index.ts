import Node from './node.vue'
/* istanbul ignore next */
// @ts-ignore
Node.install = Vue => {
  // @ts-ignore
  Vue.component(Node.name, Node)
}
export default Node
