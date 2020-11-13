import Graph from '../controller/graph'
import Node from '../item/node'
import Edge from '../item/edge'
import Slot from '../item/slot'

export type IGraph = Graph
export type IEdge = Edge
export type ISlot = Slot
export type INode = Node

export interface IDataModel {
  // DAG图ID
  graphId?: number | string
  // 实验节点信息
  nodes: INodeModel[]
  // 实验连线信息
  edges: IEdgeModel[]
  [key: string]: unknown
}

export interface ISlotModel {
  id?: string
  type?: string
  x?: number
  y?: number
  [key: string]: unknown
}

export interface INodeModel {
  id?: string
  slots?: ISlotModel[]
  [key: string]: unknown
}

export interface IEdgeModel {
  id?: string
  // 源节点ID
  fromNodeId: string
  // 目标节点ID
  toNodeId: string
  fromSlotId?: string
  toSlotId?: string
  [key: string]: unknown
}
