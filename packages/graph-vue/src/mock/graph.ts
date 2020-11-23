export const dagMock: IGraphDataType = {
  graphId: 0,
  nodes: [
    {
      id: 1,
      nodeName: '工具栏悬浮有说明',
      x: 455,
      y: 122.5,
      width: 200,
      height: 50,
      slots: [
        {
          id: 11,
          type: 'in'
        },
        {
          id: 12,
          type: 'out'
        },
        {
          id: 13,
          type: 'out'
        }
      ]
    },
    {
      id: 2,
      nodeName: '拖动添加组件',
      x: 540,
      y: 407.5,
      width: 210,
      height: 30,
      slots: [
        {
          id: 21,
          type: 'in'
        },
        {
          id: 22,
          type: 'in'
        },
        {
          id: 23,
          type: 'out'
        }
      ]
    },
    {
      id: 3,
      nodeName: '拖动插槽连线',
      x: 641,
      y: 284.5,
      width: 150,
      height: 50,
      slots: [
        {
          id: 31,
          type: 'in'
        },
        {
          id: 32,
          type: 'out'
        }
      ]
    },
    {
      id: 4,
      nodeName: '右键可删除',
      x: 297,
      y: 522.5,
      slots: [
        {
          id: 41,
          type: 'in'
        },
        {
          id: 42,
          type: 'out'
        }
      ]
    },
    {
      id: 5,
      nodeName: '交互可配置',
      x: 381,
      y: 234.5,
      slots: [
        {
          id: 51,
          type: 'in'
        },
        {
          id: 52,
          type: 'out'
        }
      ]
    },
    {
      id: 6,
      nodeName: '交互可配置',
      x: 531,
      y: 640.5,
      slots: [
        {
          id: 61,
          type: 'in'
        },
        {
          id: 62,
          type: 'out'
        }
      ]
    },
    {
      id: 7,
      nodeName: '交互可配置',
      x: 280,
      y: 413.5,
      slots: [
        {
          id: 71,
          type: 'in'
        },
        {
          id: 72,
          type: 'in'
        },
        {
          id: 73,
          type: 'out'
        }
      ]
    }
  ],
  edges: [
    {
      fromNodeId: 1,
      toNodeId: 5,
      fromSlotId: 12,
      toSlotId: 51
    },
    {
      fromNodeId: 1,
      toNodeId: 3,
      fromSlotId: 13,
      toSlotId: 31
    },
    {
      fromNodeId: 5,
      toNodeId: 7,
      fromSlotId: 52,
      toSlotId: 71
    },
    {
      fromNodeId: 5,
      toNodeId: 2,
      fromSlotId: 52,
      toSlotId: 21
    },
    {
      fromNodeId: 3,
      toNodeId: 2,
      fromSlotId: 32,
      toSlotId: 21
    },
    {
      fromNodeId: 7,
      toNodeId: 4,
      fromSlotId: 73,
      toSlotId: 41
    },
    {
      fromNodeId: 4,
      toNodeId: 6,
      fromSlotId: 42,
      toSlotId: 61
    },
    {
      fromNodeId: 2,
      toNodeId: 4,
      fromSlotId: 23,
      toSlotId: 41
    }
  ]
}
