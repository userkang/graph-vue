declare interface IDagType {
  // DAG图ID
  dagId: number
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

declare interface INodeType {
  nodeId: number
  // 组件名称
  nodeName: string
  // 组件描述
  nodeDesc: string
  // 节点X坐标
  posX: number
  // 节点Y坐标
  posY: number
}

declare interface IEdgeType {
  // 连线ID
  edgeId?: number | string
  // 源节点ID
  fromNodeId: number
  // 目标节点ID
  toNodeId: number
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
  data: number
  type: string
}
