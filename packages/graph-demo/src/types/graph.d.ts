declare interface IGraphDataType {
  // DAG图ID
  graphId?: number
  // 实验节点信息
  nodes: INodeType[]
  // 实验连线信息
  edges: IEdgeType[]
}

declare interface IMenu {
  show: boolean
  x: number
  y: number
  type: string
  item?: { [key: string]: unknown }
}
