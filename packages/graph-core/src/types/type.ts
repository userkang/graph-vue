import {
  EdgeInfo,
  IDirection,
  IEdge,
  IEdgeModel,
  INode,
  INodeModel,
  IPort,
  IPortModel,
  NodeInfo
} from '.'
import Store from '../controller/store'

export type itemId = string

export interface BaseCfg {
  id: itemId
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
  direction: IDirection
  store: Store
}

export interface IEdgeCfg extends EdgeInfo {
  store: Store
}

export interface IPortCfg {
  store: Store
  x: number
  y: number
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

export type move = { moveX: number; moveY: number }

export type Item = INode | IEdge | IPort

export type itemClass<T extends Item> = new (...args: any[]) => T

export type valuesType<T> = T extends readonly (infer U)[] ? U : never

export interface ManyToOneEvent<M, S> {
  type: 'add' | 'remove'
  member: M
  one: S
}
