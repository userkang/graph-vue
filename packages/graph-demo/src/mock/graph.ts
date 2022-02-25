import { INodeModel } from '@datafe/graph-core'

let nextId = 0
const generateTreeNode = (): INodeModel => {
  const nodeId = nextId++
  const id = String(nodeId)
  return {
    id,
    label: id,
    nodeId
  }
}

export const dagMock = () => {
  return {
    nodes: [
      {
        id: '1',
        label: '工具栏悬浮有说明',
        nodeId: 232,
        x: 400,
        y: 100,
        width: 200,
        height: 50
      },
      {
        id: '2',
        label: '拖动添加组件',
        x: 540,
        y: 407.5,
        width: 210,
        height: 30,
        slots: [
          {
            type: 'in',
            id: 'slot3'
          },
          {
            type: 'in',
            id: 'slot4'
          },
          {
            type: 'out',
            id: 'slot5'
          }
        ]
      },
      {
        id: '3',
        label: '拖动插槽连线',
        x: 641,
        y: 284.5
      },
      {
        id: '4',
        label: '右键可删除',
        x: 297,
        y: 522.5
      },
      {
        id: '5',
        label: '交互可配置',
        x: 381,
        y: 234.5
      },
      {
        id: '6',
        label: '交互可配置',
        x: 531,
        y: 640.5
      },
      {
        id: '7',
        label: '交互可配置',
        x: 280,
        y: 413.5,
        slots: [
          {
            type: 'in',
            id: 'slot14'
          },
          {
            type: 'in',
            id: 'slot15'
          },
          {
            type: 'out',
            id: 'slot16'
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
        toSlotId: 'slot3',
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
        fromSlotId: 'slot16',
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
        fromSlotId: 'slot5',
        id: 'edge6'
      },
      {
        fromNodeId: '5',
        toNodeId: '7',
        toSlotId: 'slot14',
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
    const node = stack.shift()
    node.children = [generateTreeNode(), generateTreeNode()]
    stack.push(node.children[0], node.children[1])
  }
  return head
}
