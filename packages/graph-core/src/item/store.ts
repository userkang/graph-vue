import Graph from '../controller/graph'
import Node from './node'
import Edge from './edge'
import Base from './base'
import { IEdgeModel, INodeModel, IPortModel } from '../types'
import { BaseCfg } from '../types/type'

type Item =
  | Base<INodeModel, BaseCfg>
  | Base<IEdgeModel, BaseCfg>
  | Base<IPortModel, BaseCfg>

export const store: Record<
  string,
  {
    graph: Graph
    nodes: Record<string, Node>
    edges: Record<string, Edge>
    itemMap: Record<string, Item>
  }
> = {}
export const getGraph = (graphId: string) => store[graphId].graph
console.log(store)
