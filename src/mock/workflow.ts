import {
  ComponentCategoryVoType,
  EdgeVoType,
  GraphVoType,
  NodeVoType,
  ParamTabVo,
  ParamVo
} from '@/types/graph'

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

export const graphInfoMock: Workflow.WorkflowVo = {
  groupId: 0,
  id: 0,
  workflowName: '',
  desc: '',
  creator: '',
  createTime: '',
  updateTime: '',
  nodes: [],
  edges: [],
  transform: ''
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

export const graphNodeMock: Workflow.WorkflowNodeVo = {
  id: 0,
  workflowId: 0,
  nodeGroupId: 0,
  componentId: 0,
  componentType: '',
  categoryType: 'XT',
  nodeName: '',
  nodeDesc: '',
  posX: 0,
  posY: 0,
  createTime: '',
  bindTask: false,
  execTime: '',
  startX: 0,
  startY: 0,
  dqcStatus: 'OFFLINE',
  scheduleQueueName: 'daily',
  hidden: false
}

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
  workflowId: 0,
  isActive: false
})
