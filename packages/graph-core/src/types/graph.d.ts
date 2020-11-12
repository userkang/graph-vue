declare interface IDataModel {
  // DAG图ID
  graphId?: number | string
  // 实验节点信息
  nodes: INodeModel[]
  // 实验连线信息
  edges: IEdgeModel[]
  [key: string]: unknown
}

declare interface ITransform {
  scale: number
  translateX: number
  translateY: number
  offsetX: number
  offsetY: number
}

declare interface ISlotModel {
  id?: string
  type?: string
  x?: number
  y?: number
  [key: string]: unknown
}

declare interface INodeModel {
  id?: string
  slots?: ISlotModel[]
  [key: string]: unknown
}

declare interface IEdgeModel {
  id?: string
  // 源节点ID
  fromNodeId: string
  // 目标节点ID
  toNodeId: string
  fromSlotId?: string
  toSlotId?: string
  [key: string]: unknown
}

declare interface IRectInfo {
  width: number
  height: number
  rx: number
  ry: number
}

declare interface IMenu {
  show: boolean
  x: number
  y: number
  type: string
  item?: INodeType | IEdgeType
}

declare interface INodeStyle {
  width: number
  height: number
  rx: number
  ry: number
}
