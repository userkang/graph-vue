import Node from '../item/node'
import Edge from '../item/edge'
import Slot from '../item/slot'

export type IEdge = Edge
export type ISlot = Slot
export type INode = Node

export interface IDataModel {
  // 实验节点信息
  nodes: INodeModel[]
  // 实验连线信息
  edges: IEdgeModel[]
  [key: string]: unknown
}

export interface ISlotModel {
  id?: string
  type?: string
  [key: string]: unknown
}

export interface INodeModel {
  id?: string
  width?: number
  height?: number
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

export interface IGraphConfig {
  // svg 容器
  container: string | HTMLElement
  // 图的方向： LF 从左到右， TB 自上到下
  drection: 'LF' | 'TB'
  // 节点的宽高 单位：px
  nodeInfo: {
    width: number
    height: number
  }
  // 默认的行为配置
  action: string[]
}

export interface IStack {
  type: string
  data: IDataStack
}

export interface IDataStack {
  nodes?: INodeModel[]
  edges?: IEdgeModel[]
}
