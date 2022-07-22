import {
  EdgeInfo,
  IDirection,
  IEdgeModel,
  INode,
  INodeModel,
  IPortModel,
  NodeInfo
} from '.'

export interface BaseCfg {
  id: string
  model: INodeModel | IEdgeModel | IPortModel
  zIndex?: number
  states: {
    selected: boolean
    linked: boolean
    enable: boolean
    locked: boolean
    hide: boolean
    [key: string]: boolean
  }
  view?: any
  [key: string]: any
}

export interface INodeCfg extends NodeInfo {
  cfg?: INodeCfg
  width: number
  height: number
  direction?: IDirection
  [key: string]: any
}

export interface IEdgeCfg extends EdgeInfo {
  [key: string]: any
}

export interface IPortCfg {
  nodeId: string
  x: number
  y: number
  node: INode
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

export type GetArrayElementType<T extends readonly any[]> =
  T extends readonly (infer U)[] ? U : never

export interface IRect {
  x: number
  y: number
  width: number
  height: number
}
