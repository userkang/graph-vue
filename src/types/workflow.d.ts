declare namespace Workflow {
  export interface ProjectPayload {
    bizLine: string
    bizSubject: string
    parentGroupId: number | string
    groupName: string
    groupDesc: string
  }

  export interface WorkflowPayload {
    groupId: number | string
    workflowName: string
    workflowDesc: string
    owner: string
  }

  export interface UpdateProjectPayload {
    groupName: string
    groupDesc: string
    workflowGroupId: number
  }

  export interface UpdateWorkflowPayload {
    workflowId: number
    groupId: number | string
    workflowName: string
    owner: string
    workflowDesc: string
  }

  export interface WorkflowEdgeVo {
    id: number
    workflowId: number
    nodeGroupId: number
    fromNodeId: number
    toNodeId: number
  }

  export interface WorkflowComponent {
    id: number
    name: string
    desc: string
    seq: string
    creator: string
    createTime: string
    /** XT MSP_SPARK MSP_PYSPARK MSP_MR MSP_XGB MLP_DAG */
    type: string
  }

  export interface Pageable {
    page: number
    size: number
  }

  export interface XtSyncSourceEngineVo {
    sourceEngineList: string[]
  }

  export interface LabelAndValue {
    label: string
    value: string
  }

  export interface WorkflowComponentCategoryVo {
    /** category id */
    id: number
    /** category name: 用于展示 */
    categoryName: string
    /** 分类类别 */
    categoryType: string
    /** category seq：用于排序 */
    seq: number
    /** 二级type列表；可选，调/mlapi/cmpt/category这个接口时，types为空 */
    components: WorkflowComponentVo[]
  }

  export interface WorkflowBasicVo {
    /** workflow id */
    id: number
    /** 业务主题 */
    bizSubject: string
    /** 业务线 */
    bizLine: string
    /** 目录名称 */
    groupName: string
    /** 目录id */
    groupId: number | string
    /** 工作流名称 */
    workflowName: string
    /** 工作流负责人 */
    owner: string
    /** 工作流描述 */
    workflowDesc: string
    createTime: string
    updateTime: string
    hidden: boolean
    type: string
  }

  export interface ResultVo {
    code: number
    message: string
    data: null
  }

  export interface XtSyncTaskTypeInfoVo {
    noticeCom: string
    wikiName: string
    wikiUrl: string
  }

  export interface WorkflowEditRecordVo {
    editor: string
    updateTime: string
    /** WORKFLOW_NODE_EDIT, WORKFLOW_NODE_EDIT, XT_EDIT, MSP_EDIT */
    editorType: string
    /** 10-节点 20-边 30-xt 40-托管 */
    editorObject: number
    /** 10-创建 20-删除 30-修改 40-上线新版本 50-更改执行计划 */
    action: number
    /** 节点名、边的上下游、任务的url */
    details: string
  }

  export interface NodeExtendQuery {
    upstream: number
    downstream: number
    /** 使用逗号分隔 */
    taskType: string
  }

  export interface ToolTaskDetailVo {
    taskName: string
    /** 只在afo任务的情况下才有值 */
    toolTaskAfoType: string
    /** 只在afo任务的情况下才有值，中文，显示这个字段 */
    toolTaskAfoTypeChn: string
    /** 只在afo任务的情况下才有值,备注 */
    taskDesc: string
    taskUrl: string
    status: string
    tenant: string
    prjName: string
    creator: string
    editor: string
    createTime: string
    updateTime: string
    /** 是否需要请求获取依赖，获取其他配置的接口 */
    flagRequset: boolean
    /** false 代表还没有绑定任务，获取不到其他信息 */
    bindToolTask: boolean
    /** 最近一次调度上线时间，只在afo任务的情况下才有值 */
    latestOnlineTime: string
    /** 最近一次执行耗时，只在afo任务的情况下才有值 */
    latestRunTime: string
    /** 最近一次执行日志，只在afo任务的情况下才有值 */
    latestYarnLog: string
    /** 最近一次执行tensorBorad链接，只在afo任务的情况下才有值 */
    latestTensorBoardLog: string
    lastestExecTime: string
    execDetail: ToolTaskExecDetailVo
  }

  export interface ToolTaskXtVo {
    nodeName: string
    nodeDesc: string
    createType: string
    /** create(新建)，relate(关联) */
    xtName: string
    xtType: string
    toolTaskType: string
    projName: string
    sourceEngine: string
    destEngine: string
  }

  export interface ToolTaskExecDetailVo {
    /** latestWeek,latestMonth */
    timeType: string
    /** 总数 */
    execCount: number
    /** 未开始状态数量 */
    newCount: number
    /** 运行错误状态数量 */
    failCount: number
    /** 运行中状态数量 */
    runningCount: number
    /** 运行成功状态数量 */
    finishedCount: number
  }

  export interface ToolTaskMspVo {
    nodeName: string
    /** 关联已有任务relate，新建任务create */
    createType: string
    /** 完整job名，包含前缀 */
    jobName: string
    /** spark pyspark mapreduce */
    mspType: string
    repos: string
    branch: string
    subDir: string
    mainPy: string
    queue: string
    mainClass: string
    desc: string
  }

  export interface WorkflowNodeGroupVo {
    id: number
    groupId: number
    workflowId: number
    nodeGroupName: string
    scope: number
    nodeGroupDesc: string
    createTime: string
    updateTime: string
    creator: string
    nodes: WorkflowNodeVo[]
    fold: boolean
    status: number
  }

  export interface WorkflowComponentVo {
    /** 组件id */
    id: number
    /** 组件分类id */
    categoryId: number
    /** 组件名称，用于展示 */
    componentName: string
    /** 组件类型 */
    componentType: string
    /** 创建人 */
    creator: string
    createTime: string
    /** 排序序号 */
    seq: number
    componentDesc: string
  }

  export interface WorkflowNodeVo {
    id: number
    workflowId: number
    nodeGroupId: number
    componentId: number
    componentType: string
    categoryType: string
    nodeName: string
    nodeDesc: string
    posX: number
    posY: number
    execTime: string
    createTime: string
    bindTask: boolean
    startX: number
    startY: number
    /** weekly-周 daily-天 hour-小时 monthly-月 crontab-自定义 */
    scheduleQueueName: 'weekly' | 'daily' | 'hour' | 'monthly' | 'crontab'
    hidden: boolean
    /** create online(此状态前端显示dqc标签) offline */

    dqcStatus: 'CREATE' | 'ONLINE' | 'OFFLINE'
  }

  export interface NodeBasicVo {
    componentType: string
    nodeName: string
    desc: string
  }

  export interface ToolTaskExtraVo {
    dqcStatus: string
    dqcUrl: string
    dqcName: string
    slaStatus: string
    slaUrl: string
    cantorStatus: string
    cantorUrl: string
  }

  export interface PageVo {
    currentPageNo: number
    pageSize: number
    totalCount: number
    totalPageCount: number
    items: any[]
  }

  export interface WorkflowGroupVo {
    id: number
    groupName: string
    groupDesc: string
    bizLine: string
    bizSubject: string
    creator: string
    subGroups: WorkflowGroupVo[]
    workflows: WorkflowBasicVo[]
    type: string
  }

  export interface ToolTaskUpstreamRelationVo {
    strongRelation: TaskCantorConfVo[]
    weakRelation: TaskCantorConfVo[]
  }

  export interface WorkflowVo {
    groupId: number
    id: number
    workflowName: string
    desc: string
    creator: string
    createTime: string
    updateTime: string
    nodes: WorkflowNodeVo[]
    edges: WorkflowEdgeVo[]
    transform: string
    type?: string
  }

  export interface TaskCantorConfVo {
    taskName: string
    taskUrl: string
  }

  // 可视化图上面的运行列表数据格式
  export interface GraphItemType {
    name: string
    workflowId: number
    isActive?: boolean
  }

  export interface BizSubjectVo {
    /** 业务主题唯一标识 */
    bizSubject: string
    /** 业务主题中文名称 */
    bizSubjectName: string
  }

  export interface MspCantorTaskVo {
    cantorName: string
    creator: string
    cantorQueue: string
    createTime: string
    status: string
  }

  export interface MspCantorTaskCreateVo {
    show: boolean
    cantorTasks: string[]
  }

  export interface ToolTaskNameVo {
    oldName: string
    namePrefix: string
  }
}
