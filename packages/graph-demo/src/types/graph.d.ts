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
  id: number
  type: string
}

declare interface INodeType {
  id: number
  // 组件名称
  label: string
  width?: number
  height?: number
  // 节点X坐标
  x: number
  // 节点Y坐标
  y: number
  slots?: ISlot[]
}

declare interface IEdgeType {
  // 源节点ID
  fromNodeId: number
  // 目标节点ID
  toNodeId: number
  fromSlotId: number
  toSlotId: number
}

declare interface IMenu {
  show: boolean
  x: number
  y: number
  type: string
  item?: { [key: string]: unknown }
}

declare interface IDataItem {
  nodes: INodeType[]
  edges: IEdgeType[]
}
