### 类型声明

```typescript
export interface IDataModel {
  nodes: INodeModel[]
  edges: IEdgeModel[]
  [key: string]: unknown
}
export interface IPortModel {
  id?: string
  type?: string
  [key: string]: unknown
}
export interface INodeModel {
  id?: string
  width?: number
  height?: number
  ports?: IPortModel[]
  [key: string]: unknown
}
export interface IEdgeModel {
  id?: string
  fromNodeId: string
  toNodeId: string
  fromPortId?: string
  toPortId?: string
  [key: string]: unknown
}
export interface IGraphConfig {
  container: string | HTMLElement
  drection: 'LR' | 'TB'
  nodeInfo: {
    width: number
    height: number
  }
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

export interface ILayout {
  align?: 'UL' | 'UR' | 'DL' | 'DR'
  nodesep?: number
  edgesep?: number
  ranksep?: number
  marginx?: number
  marginy?: number
}
```
