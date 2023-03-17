import Vue from 'vue'
import { Graph, IDataModel, ILayout, IAction } from 'graph-logic'

export declare class GraphVue extends Vue {
  graph: Graph
  action: IAction
  data: IDataModel
  layout: ILayout
}
