export const dagMock: IGraphDataType = {
  graphId: 0,
  nodes: [
    {
      nodeId: 0,
      nodeName: '拖动我',
      nodeDesc: '演示组件一',
      posX: 120,
      posY: 0
    },
    {
      nodeId: 1,
      nodeName: '到右侧',
      nodeDesc: '演示组件二',
      posX: 0,
      posY: 170
    },
    {
      nodeId: 2,
      nodeName: '组件三',
      nodeDesc: '演示组件三',
      posX: 120,
      posY: 85
    },
    {
      nodeId: 3,
      nodeName: '组件三',
      nodeDesc: '演示组件三',
      posX: 240,
      posY: 170
    }
  ],
  edges: [
    { fromNodeId: 0, toNodeId: 2 },
    { fromNodeId: 2, toNodeId: 1 },
    { fromNodeId: 2, toNodeId: 3 }
  ]
}
