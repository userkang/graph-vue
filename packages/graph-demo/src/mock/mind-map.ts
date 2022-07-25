export const dataMock = {
  nodes: [
    {
      id: '1',
      label: '主题',
      nodeId: 232,
      ports: [
        {
          type: 'out',
          id: 'port1'
        }
      ],
      isCollapsed: false,
      children: [
        {
          id: '2',
          label: '分支1',
          isCollapsed: false
        },
        {
          id: '3',
          label: '分支2',
          isCollapsed: false
        },
        {
          id: '4',
          label: '分支3',
          isCollapsed: false
        }
      ]
    },
    {
      label: '新节点',
      isCollapsed: false,
      id: 'node14'
    },
    {
      label: '新节点',
      isCollapsed: false,
      id: 'node17'
    },
    {
      id: '2',
      label: '分支1',
      isCollapsed: false
    },
    {
      id: '3',
      label: '分支2',
      isCollapsed: false
    },
    {
      id: '4',
      label: '分支3',
      isCollapsed: false
    },
    {
      label: '新节点',
      isCollapsed: false,
      id: 'node15'
    },
    {
      label: '新节点',
      isCollapsed: false,
      id: 'node16',
      width: 180,
      height: 40
    },
    {
      label: '新节点',
      isCollapsed: false,
      id: 'node18'
    },
    {
      label: '新节点',
      isCollapsed: false,
      id: 'node19'
    },
    {
      label: '新节点',
      isCollapsed: false,
      id: 'node20'
    },
    {
      label: '新节点',
      isCollapsed: false,
      id: 'node23'
    },
    {
      label: '新节点',
      isCollapsed: false,
      id: 'node24'
    },
    {
      label: '新节点',
      isCollapsed: false,
      id: 'node25'
    },
    {
      label: '新节点',
      isCollapsed: false,
      id: 'node26'
    }
  ],
  edges: [
    {
      fromNodeId: '1',
      toNodeId: '2',
      id: 'edge18'
    },
    {
      fromNodeId: '1',
      toNodeId: '3',
      id: 'edge19'
    },
    {
      fromNodeId: '1',
      toNodeId: '4',
      id: 'edge20'
    },
    {
      fromNodeId: '2',
      toNodeId: 'node14',
      id: 'edge21'
    },
    {
      fromNodeId: '3',
      toNodeId: 'node15',
      id: 'edge22'
    },
    {
      fromNodeId: '2',
      toNodeId: 'node16',
      id: 'edge23'
    },
    {
      fromNodeId: 'node16',
      toNodeId: 'node17',
      id: 'edge24'
    },
    {
      fromNodeId: '3',
      toNodeId: 'node18',
      id: 'edge25'
    },
    {
      fromNodeId: '4',
      toNodeId: 'node19',
      id: 'edge26'
    },
    {
      fromNodeId: '2',
      toNodeId: 'node20',
      id: 'edge27'
    },
    {
      fromNodeId: 'node18',
      toNodeId: 'node23',
      id: 'edge30'
    },
    {
      fromNodeId: 'node15',
      toNodeId: 'node24',
      id: 'edge31'
    },
    {
      fromNodeId: 'node15',
      toNodeId: 'node25',
      id: 'edge32'
    },
    {
      fromNodeId: 'node19',
      toNodeId: 'node26',
      id: 'edge33'
    }
  ]
}
