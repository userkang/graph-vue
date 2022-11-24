import Node from '../item/node'
import Edge from '../item/edge'
import Port from '../item/port'

export type IEdge = Edge
export type IPort = Port
export type INode = Node

export interface IDataModel {
  // 实验节点信息
  nodes: INodeModel[]
  // 实验连线信息
  edges: IEdgeModel[]
}

export type IPosition = 'top' | 'left' | 'right' | 'bottom' | 'center'
export type IDirection = 'TB' | 'LR' | 'BT' | 'RL'

export interface IPortModel {
  id?: string
  type?: 'in' | 'out'
  position?: IPosition
  [key: string]: any
}

export interface INodeModel {
  id?: string
  width?: number
  height?: number
  x?: number
  y?: number
  parentId?: string
  collapsed?: boolean
  ports?: IPortModel[]
  [key: string]: any
}

export interface ITreeDataModel extends INodeModel {
  children?: ITreeDataModel[]
}

export interface IEdgeModel {
  id?: string
  // 源节点ID
  fromNodeId?: string
  // 目标节点ID
  toNodeId?: string
  fromPortId?: string
  toPortId?: string
  [key: string]: any
}

export interface NodeInfo {
  width?: number
  height?: number
  html?: (node: Node) => HTMLElement | string
}

export interface EdgeInfo {
  path?: (
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) => string
}

export interface IGraphConfig {
  // svg 容器
  container: string | HTMLElement
  // 图的方向： LR 从左到右， TB 自上到下
  direction?: IDirection
  // 节点的宽高 单位：px
  nodeInfo?: NodeInfo
  edgeInfo?: EdgeInfo
  defaultNode?: INodeModel
  // 默认的行为配置
  action?: string[]
}

export interface ICfg extends IGraphConfig {
  container: HTMLElement
  direction: IDirection
  action: string[]

  nodes: INodeModel[]
  edges: IEdgeModel[]
  brushing?: boolean
}

export interface IDataStack {
  nodes?: INodeModel[]
  edges?: IEdgeModel[]
}

export interface ILayout {
  type?: string
  options?: IDagreLayout | ICircleLayout
  data?: {
    nodes: INode[]
    edges: Array<IEdge | { fromNodeId: string; toNodeId: string }>
  }
}

export interface IDagreLayout {
  rankdir?: IDirection
  align?: 'UL' | 'UR' | 'DL' | 'DR'
  nodesep?: number
  edgesep?: number
  ranksep?: number
  marginx?: number
  marginy?: number
}

export interface ICircleLayout {
  clockwise?: boolean
  startAngle?: number
  addRadius?: number
}

export type IAction = Array<
  | 'brush-select'
  | 'click-select'
  | 'connect-edge'
  | 'drag-node'
  | 'drag-blank'
  | 'wheel-move'
  | 'wheel-zoom'
>

export interface IGraphEvent {
  e: MouseEvent
  x: number
  y: number
  data: Record<string, string | null>
  target: Node | Edge | Port | undefined
  [key: string]: any
}
