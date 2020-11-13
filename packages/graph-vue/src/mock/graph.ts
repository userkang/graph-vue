export const dagMock: IGraphDataType = {
  graphId: 0,
  nodes: [
    {
      id: '1',
      nodeName: '工具栏悬浮有说明',
      x: 455,
      y: 122.5,
      slots: [
        {
          id: '1-1',
          type: 'in'
        },
        {
          id: '1-2',
          type: 'out'
        },
        {
          id: '1-3',
          type: 'out'
        }
      ]
    },
    {
      id: '2',
      nodeName: '拖动添加组件',
      x: 540,
      y: 407.5,
      slots: [
        {
          id: '2-1',
          type: 'in'
        },
        {
          id: '2-2',
          type: 'in'
        },
        {
          id: '2-3',
          type: 'out'
        }
      ]
    },
    {
      id: '3',
      nodeName: '拖动插槽连线',
      x: 641,
      y: 284.5,
      slots: [
        {
          id: '3-1',
          type: 'in'
        },
        {
          id: '3-2',
          type: 'out'
        }
      ]
    },
    {
      id: '4',
      nodeName: '右键可删除',
      x: 297,
      y: 522.5,
      slots: [
        {
          id: '4-1',
          type: 'in'
        },
        {
          id: '4-2',
          type: 'out'
        }
      ]
    },
    {
      id: '5',
      nodeName: '交互可配置',
      x: 381,
      y: 234.5,
      slots: [
        {
          id: '5-1',
          type: 'in'
        },
        {
          id: '5-2',
          type: 'out'
        }
      ]
    },
    {
      id: '6',
      nodeName: '交互可配置',
      x: 531,
      y: 640.5,
      slots: [
        {
          id: '6-1',
          type: 'in'
        },
        {
          id: '6-2',
          type: 'out'
        }
      ]
    },
    {
      id: '7',
      nodeName: '交互可配置',
      x: 280,
      y: 413.5,
      slots: [
        {
          id: '7-1',
          type: 'in'
        },
        {
          id: '7-2',
          type: 'in'
        },
        {
          id: '7-3',
          type: 'out'
        }
      ]
    }
  ],
  edges: [
    {
      fromNodeId: '1',
      toNodeId: '5',
      fromSlotId: '1-2',
      toSlotId: '5-1'
    },
    {
      fromNodeId: '1',
      toNodeId: '3',
      fromSlotId: '1-3',
      toSlotId: '3-1'
    },
    {
      fromNodeId: '5',
      toNodeId: '7',
      fromSlotId: '5-2',
      toSlotId: '7-1'
    },
    {
      fromNodeId: '5',
      toNodeId: '2',
      fromSlotId: '5-2',
      toSlotId: '2-1'
    },
    {
      fromNodeId: '3',
      toNodeId: '2',
      fromSlotId: '3-2',
      toSlotId: '2-1'
    },
    {
      fromNodeId: '7',
      toNodeId: '4',
      fromSlotId: '7-3',
      toSlotId: '4-1'
    },
    {
      fromNodeId: '4',
      toNodeId: '6',
      fromSlotId: '4-2',
      toSlotId: '6-1'
    },
    {
      fromNodeId: '2',
      toNodeId: '4',
      fromSlotId: '2-3',
      toSlotId: '4-1'
    }
  ]
}
