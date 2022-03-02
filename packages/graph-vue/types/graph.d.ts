import Vue from 'vue'
import { Graph, IDataModel, ILayout, IAction } from '@datafe/graph-core'

export declare class GraphVue extends Vue {
  graph: Graph
  action: IAction
  data: IDataModel
  layout: ILayout
}
