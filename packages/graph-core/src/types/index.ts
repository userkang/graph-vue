import Node from '../item/node'
import Edge from '../item/edge'
import Port from '../item/port'

export type IEdge = Edge
export type IPort = Port
export type INode = Node

export interface States {
  selected: boolean
  linked: boolean
  enable: boolean
  locked: boolean
  hide: boolean
  [key: string]: boolean
}

export interface BaseCfg {
  id: string
  model: INodeModel | IEdgeModel | IPortModel
  zIndex?: number
  states: States
  view?: any
  [key: string]: any
}

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

export interface INodeCfg extends NodeInfo {
  [key: string]: any
}

export interface EdgeInfo {
  path?: (
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) => string
}

export interface IEdgeCfg extends EdgeInfo {
  [key: string]: any
}
export interface IGraphConfig {
  // svg 容器
  container: string | HTMLElement
  // 图的方向： LR 从左到右， TB 自上到下
  direction: IDirection
  // 节点的宽高 单位：px
  nodeInfo?: NodeInfo
  edgeInfo?: EdgeInfo
  defaultNode?: INodeModel
  // 默认的行为配置
  action: string[]
}

export interface ICfg extends IGraphConfig {
  container: HTMLElement
  nodes: INodeModel[]
  edges: IEdgeModel[]
  nodeInfo?: NodeInfo
  action: string[]
  isRender?: boolean
  [key: string]: any
}

export interface INodeStackData {
  model: INodeModel
  rect: {
    x: number
    y: number
    width: number
    height: number
  }
  state: Record<string, boolean>
}
export interface IEdgeStackData {
  model: IEdgeModel
  state: Record<string, boolean>
}
export interface IStack {
  addNodes: Record<string, INodeStackData>
  removeNodes: Record<string, INodeStackData>
  beforeNodes: Record<string, INodeStackData>
  afterNodes: Record<string, INodeStackData>
  beforeTransform: { x: number; y: number } | null
  afterTransform: { x: number; y: number } | null
  addEdges: Record<string, IEdgeStackData>
  removeEdges: Record<string, IEdgeStackData>
  beforeEdges: Record<string, IEdgeStackData>
  afterEdges: Record<string, IEdgeStackData>
}

export interface IDataStack {
  nodes?: INodeModel[]
  edges?: IEdgeModel[]
}

export interface ILayout {
  type?: string
  options?: IDagreLayout | ICircleLayout
  data?: { nodes: INode[]; edges: IEdge[] }
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

export type GetArrayElementType<T extends readonly any[]> =
  T extends readonly (infer U)[] ? U : never
