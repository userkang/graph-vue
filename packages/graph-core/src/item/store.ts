import Graph from '../controller/graph'
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
    itemMap: Record<string, Item>
  }
> = {}
export const getGraph = (graphId: string) => store[graphId].graph
