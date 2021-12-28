import { INodeModel } from '@datafe/graph-core'
export const dagMock = {
  nodes: [
    {
      id: '1',
      label: '工具栏悬浮有说明',
      nodeId: 232,
      x: 400,
      y: 100
    },
    {
      id: '2',
      label: '拖动添加组件',
      x: 540,
      y: 407.5,
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

const treeNodes = new Array(14).fill(1).map(i => generateTreeNode())
treeNodes[1].children = [treeNodes[2], treeNodes[3], treeNodes[4], treeNodes[5]]
treeNodes[3].children = [treeNodes[6], treeNodes[7]]
treeNodes[7].children = [treeNodes[11]]
treeNodes[4].children = [treeNodes[8]]
treeNodes[8].children = [treeNodes[12]]
treeNodes[5].children = [treeNodes[9], treeNodes[10]]
treeNodes[9].children = [treeNodes[13]]
export const treeMock = treeNodes[1]
