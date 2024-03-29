let nextId = 0
const generateTreeNode = () => {
  const nodeId = nextId++
  const id = String(nodeId)
  return {
    id,
    label: id,
    nodeId,
    width: 60,
    height: 60
  }
}

export const dagMock = () => {
  return {
    nodes: [
      {
        id: '1',
        label: '工具栏悬浮有说明',
        nodeId: 232,
        x: 680,
        y: 263
      },
      {
        id: '2',
        label: '拖动添加组件',
        x: 795,
        y: 533,
        ports: [
          {
            type: 'in',
            id: 'port3'
          },
          {
            type: 'in',
            id: 'port4'
          },
          {
            type: 'out',
            id: 'port5'
          }
        ]
      },
      {
        id: '3',
        label: '拖动插槽连线',
        x: 795,
        y: 443
      },
      {
        id: '4',
        label: '右键可删除',
        x: 565,
        y: 533
      },
      {
        id: '5',
        label: '交互可配置',
        x: 565,
        y: 353
      },
      {
        id: '6',
        label: '交互可配置',
        x: 680,
        y: 623
      },
      {
        id: '7',
        label: '交互可配置',
        x: 565,
        y: 443,
        ports: [
          {
            type: 'in',
            id: 'port14'
          },
          {
            type: 'in',
            id: 'port15'
          },
          {
            type: 'out',
            id: 'port16'
          }
        ]
      }
    ],
    edges: [
      {
        fromNodeId: '1',
        toNodeId: '5',
        id: 'edge1'
      },
      {
        fromNodeId: '3',
        toNodeId: '2',
        toPortId: 'port3',
        id: 'edge2'
      },
      {
        fromNodeId: '1',
        toNodeId: '3',
        id: 'edge3'
      },
      {
        fromNodeId: '7',
        toNodeId: '4',
        fromPortId: 'port16',
        id: 'edge4'
      },
      {
        fromNodeId: '4',
        toNodeId: '6',
        id: 'edge5'
      },
      {
        fromNodeId: '2',
        toNodeId: '6',
        fromPortId: 'port5',
        id: 'edge6'
      },
      {
        fromNodeId: '5',
        toNodeId: '7',
        toPortId: 'port14',
        id: 'edge7'
      }
    ]
  }
}

export const treeMock = (times: number) => {
  if (times <= 1) {
    return
  }
  const head = generateTreeNode()
  const stack = [head]
  for (let i = 0; i < times; i++) {
    const node = stack.shift() as any
    node.children = [generateTreeNode(), generateTreeNode()]
    stack.push(node.children[0], node.children[1])
  }
  return head
}

export const mindMapMock = () => {
  return {
    id: '1',
    label: '工具栏悬浮有说明',
    nodeId: 232,
    ports: [{ type: 'out', id: 'port1' }],
    isCollapsed: false,
    children: [
      {
        id: '2',
        label: '拖动添加组件',
        isCollapsed: false
      },
      {
        id: '3',
        label: '拖动插槽连线',
        isCollapsed: false
      },
      {
        id: '4',
        label: '交互可配置',
        isCollapsed: false
      }
    ]
  }
}
