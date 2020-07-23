import {
  ComponentCategoryVoType,
  EdgeVoType,
  GraphVoType,
  NodeVoType,
  ParamTabVo,
  ParamVo
} from '@/types/graph'

// export const GraphListMock: GraphItemType[] = [
//     {
//         name: 'hello',
//         graphId: 100,
//         execId: 1
//     },
//     {
//         name: 'hello',
//         graphId: 100,
//         execId: 2
//     },
//     {
//         name: 'hello',
//         graphId: 100,
//         execId: 3
//     },
//     {
//         name: 'hello',
//         graphId: 100,
//         execId: 4
//     },
//     {
//         name: 'hello',
//         graphId: 100,
//         execId: 5
//     },
//     {
//         name: 'hello',
//         graphId: 100,
//         execId: 6
//     },
//     {
//         name: 'hello',
//         graphId: 100,
//         execId: 7
//     },
//     {
//         name: 'hello',
//         graphId: 100,
//         execId: 8
//     },
//     {
//         name: 'hello',
//         graphId: 100,
//         execId: 9
//     },
//     {
//         name: 'hello',
//         graphId: 100,
//         execId: 10
//     },
//     {
//         name: 'hello',
//         graphId: 100,
//         execId: 11
//     }
// ];

export const componentListMock: ComponentCategoryVoType[] = [
  {
    categoryId: 1,
    categoryName: 'hello',
    categoryIndex: 1,
    types: [
      {
        typeId: 1,
        typeName: 'world',
        typeIndex: 1,
        components: [
          {
            componentId: 1,
            componentVersionId: 1,
            typeId: 1,
            componentName: 'hello world',
            componentDesc: 'just test',
            versionDesc: 'version test',
            inSlotNum: 3,
            outSlotNum: 2
          }
        ]
      }
    ]
  },
  {
    categoryId: 1,
    categoryName: 'hello',
    categoryIndex: 1,
    types: [
      {
        typeId: 1,
        typeName: 'world',
        typeIndex: 1,
        components: [
          {
            componentId: 1,
            componentVersionId: 1,
            typeId: 1,
            componentName: 'hello world',
            componentDesc: 'just test',
            versionDesc: 'version test',
            inSlotNum: 3,
            outSlotNum: 2
          }
        ]
      }
    ]
  },
  {
    categoryId: 1,
    categoryName: 'hello',
    categoryIndex: 1,
    types: [
      {
        typeId: 1,
        typeName: 'world',
        typeIndex: 1,
        components: [
          {
            componentId: 1,
            componentVersionId: 1,
            typeId: 1,
            componentName: 'hello world',
            componentDesc: 'just test',
            versionDesc: 'version test',
            inSlotNum: 3,
            outSlotNum: 2
          },
          {
            componentId: 1,
            componentVersionId: 1,
            typeId: 1,
            componentName: 'world hello',
            componentDesc: 'just test',
            versionDesc: 'version test',
            inSlotNum: 3,
            outSlotNum: 2
          }
        ]
      }
    ]
  }
]

export const graphInfoMock: GraphVoType = {
  graphId: 0,
  graphName: 'hello world',
  graphDesc: 'just test',
  projectName: '',
  status: 0,
  execId: 1,
  creator: '',
  createTime: '2018-01-01',
  updateTime: '2018-01-01',
  taskStatus: 60,
  dag: {
    dagId: 0,
    graphId: 0,
    status: 0,
    locked: false,
    actived: false,
    nodes: [],
    edges: []
  },
  taskId: 0,
  task: {
    taskId: 0,
    bindId: 0,
    regId: 0,
    type: '',
    taskName: '',
    queueName: '',
    userDef: '',
    owner: '',
    projName: '',
    comment: '',
    relations: [
      {
        dependPlatform: 20,
        taskName: '',
        dependType: 1
      }
    ]
  },
  execStatus: {
    execId: 0,
    graphId: 0,
    dagId: 0,
    status: 0,
    submitTime: '',
    finishTime: '',
    nodeStatusList: []
  }
}

export const graphStatusMock = {
  execId: 0,
  graphId: 0,
  dagId: 0,
  status: 0,
  submitTime: '',
  finishTime: '',
  nodeStatusList: []
}

export const graphNodesMock: NodeVoType[] = [
  {
    nodeId: 1,
    dagId: 1,
    componentVersionId: 2,
    componentName: '点评线上模型',
    componentDesc: '组件描述',
    posX: 20,
    posY: 30,
    command: 'hahah',
    status: 0,
    linked: true,
    appid: '12345',
    log: 'hahaha',
    createTime: '20181011',
    updateTime: '20181120',
    submitTime: '20181120',
    finishTime: '20181011',
    metricOperator: false,
    inSlots: [
      {
        slotId: 1,
        nodeId: 1,
        slotDefId: 1,
        componentVersionId: 1,
        slotName: '',
        ioType: 1,
        slotIndex: 1,
        slotType: 'a',
        required: false,
        slotDesc: '',
        location: '',
        status: 1
      },
      {
        slotId: 2,
        nodeId: 1,
        slotDefId: 1,
        componentVersionId: 1,
        slotName: '',
        ioType: 1,
        slotIndex: 1,
        slotType: 'a',
        required: false,
        slotDesc: '',
        location: '',
        status: 1
      }
    ],
    outSlots: [
      {
        slotId: 3,
        nodeId: 1,
        slotDefId: 1,
        componentVersionId: 1,
        slotName: '',
        ioType: 1,
        slotIndex: 1,
        slotType: 'a',
        required: false,
        slotDesc: '',
        location: '',
        status: 1
      },
      {
        slotId: 4,
        nodeId: 1,
        slotDefId: 1,
        componentVersionId: 1,
        slotName: '',
        ioType: 1,
        slotIndex: 1,
        slotType: 'a',
        required: false,
        slotDesc: '',
        location: '',
        status: 1
      }
    ],
    categoryIndex: 1,
    typeIndex: 0
  },
  {
    nodeId: 2,
    dagId: 1,
    componentVersionId: 2,
    componentName: '美团线上模型',
    componentDesc: 'just test',
    posX: 200,
    posY: 300,
    command: 'hahah',
    status: 60,
    linked: true,
    appid: '12345',
    log: 'hahaha',
    createTime: '20181011',
    updateTime: '20181120',
    submitTime: '20181120',
    finishTime: '20181011',
    metricOperator: false,
    inSlots: [
      {
        slotId: 1,
        nodeId: 2,
        slotDefId: 1,
        componentVersionId: 1,
        slotName: '',
        ioType: 1,
        slotIndex: 1,
        slotType: 'ab',
        required: false,
        slotDesc: '',
        location: '',
        status: 2
      },
      {
        slotId: 4,
        nodeId: 2,
        slotDefId: 1,
        componentVersionId: 1,
        slotName: '',
        ioType: 1,
        slotIndex: 1,
        slotType: 'ab',
        required: false,
        slotDesc: '',
        location: '',
        status: 1
      }
    ],
    outSlots: [
      {
        slotId: 2,
        nodeId: 2,
        slotDefId: 1,
        componentVersionId: 1,
        slotName: '',
        ioType: 1,
        slotIndex: 1,
        slotType: 'ab',
        required: false,
        slotDesc: '',
        location: '',
        status: 1
      },
      {
        slotId: 3,
        nodeId: 2,
        slotDefId: 1,
        componentVersionId: 1,
        slotName: '',
        ioType: 1,
        slotIndex: 1,
        slotType: 'ab',
        required: false,
        slotDesc: '',
        location: '',
        status: 1
      }
    ],
    categoryIndex: 2,
    typeIndex: 0
  }
]

export const graphEdgesMock: EdgeVoType[] = [
  {
    edgeId: 100,
    dagId: 0,
    fromNodeId: 1,
    fromSlotId: 3,
    toNodeId: 2,
    toSlotId: 1
  }
]

export const defaultParamsMock: ParamVo = {
  paramDefId: 0,
  paramName: '',
  dataType: 0,
  paramType: '',
  paramIndex: 0,
  label: '',
  min: 0,
  max: 0,
  options: [],
  tooltip: '',
  required: true,
  paramId: 0,
  nodeId: 0,
  value: '',
  updateTime: ''
}

export const generateDefaultGraph = () => ({
  name: '',
  graphId: 0,
  execId: 0,
  dagId: 0,
  isActive: false
})
