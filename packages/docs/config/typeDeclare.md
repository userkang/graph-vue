### 类型声明

```typescript
export interface IDataModel {
  nodes: INodeModel[]
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
  fromNodeId: string
  toNodeId: string
  fromSlotId?: string
  toSlotId?: string
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
