declare interface IGraphDataType {
  // DAG图ID
  graphId?: number
  // 实验节点信息
  nodes: INodeType[]
  // 实验连线信息
  edges: IEdgeType[]
}

declare interface ITransform {
  scale: number
  translateX: number
  translateY: number
  offsetX: number
  offsetY: number
}

declare interface ISlot {
  id: string
  type: string
}

declare interface INodeType {
  id: string
  // 组件名称
  nodeName: string
  // 节点X坐标
  x: number
  // 节点Y坐标
  y: number
  slots?: ISlot[]
}

declare interface IEdgeType {
  // 源节点ID
  fromNodeId: string
  // 目标节点ID
  toNodeId: string
  fromSlotId: string
  toSlotId: string
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
  item?: { [key: string]: unknown }
}

declare interface INodeStyle {
  width: number
  height: number
  rx: number
  ry: number
}

declare interface IDataItem {
  nodes: INodeType[]
  edges: IEdgeType[]
}
