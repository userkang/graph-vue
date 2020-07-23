export interface NodeVoStatusType {
  nodeId: number
  status: number
}

export interface NodeStatusType {
  metricOperator: boolean
}

export interface UserVoType {
  logoutUrl: string
  chineseName: string
  misID: string
  avatarPath: string
  employeeId: number | string
}

export interface SlotVoType {
  // 槽位ID
  slotId: number
  // 结点ID
  nodeId: number
  // 槽位定义ID
  slotDefId: number
  // 组件版本ID
  componentVersionId: number
  // 槽位名称
  slotName: string
  // 槽位IO类型
  ioType: number
  // 槽位索引值
  slotIndex: number
  // 槽位数据类型
  slotType: string
  // 是否必须存在
  required: boolean
  // 描述
  slotDesc: string
  // 槽位关联的数据位置
  location: string
  // 槽位状态
  status: number
}

export interface NodeVoType {
  nodeId: number
  // 实验DAG图ID
  dagId: number
  // 组件版本ID
  componentVersionId: number
  // 不知为什么描述文件竟然没有nodeLabel，在此补充
  nodeLabel?: string
  // 组件名称
  componentName: string
  // 组件描述
  componentDesc: string
  // 结点X坐标
  posX: number
  // 结点Y坐标
  posY: number
  // 结点运行命令
  command: string
  // 结点运行状态
  status: number
  // 结点是否被连接
  linked: boolean
  // 结点运行appid
  appid: string
  // 结点运行日志
  log: string
  // 结点创建时间
  createTime: string
  // 结点更新时间
  updateTime: string
  // 结点提交时间
  submitTime: string
  // 结点运行结束时间
  finishTime: string
  // 结点输入槽位
  inSlots: SlotVoType[]
  // 结点输出槽位
  outSlots: SlotVoType[]
  categoryIndex: number
  typeIndex: number
  metricOperator: boolean // 是否可以查看指标
}

export interface EdgeVoType {
  // 连线ID
  edgeId: number
  // 实验DAG图ID
  dagId: number
  // 源结点ID
  fromNodeId: number
  // 源槽位ID
  fromSlotId: number
  // 目标结点ID
  toNodeId: number
  // 目标槽位ID
  toSlotId: number
}

export interface ParamVo {
  paramDefId: number
  paramName: string
  dataType: number
  paramType: string
  paramIndex: number
  label: string
  min: number
  max: number
  options: Array<{
    label: string
    value: string | number | boolean
  }>
  tooltip: string
  required: boolean
  paramId: number
  nodeId: number
  value: string | number | boolean
  updateTime: string
}

export interface ParamConfigVo {
  paramTabWithParamVos: ParamTabVo
  componentBasicConfigVo: BasicConfigVo
  componentLinkConfigVo: LinkConfigVo
}

export interface ParamTabVo {
  tabId: number
  tabName: string
  tabLabel: string
  tabIndex: number
  componentVersionId: string
  params: ParamVo[]
}

export interface BasicConfigVo {
  componentType: string
  desc: string
  name?: string
}

export interface LinkConfigVo {
  inSlots: SlotVoType[]
  outSlots: SlotVoType[]
}

export interface DagVoType {
  // DAG图ID
  dagId: number
  // 实验ID
  graphId: number
  // 实验运行状态
  status: number
  // 实验是否被锁定
  locked: boolean
  // 实验是否是最新版本
  actived: boolean
  // 实验结点信息
  nodes: NodeVoType[]
  // 实验连线信息
  edges: EdgeVoType[]
}

export interface ExecStatusVoType {
  execId: number
  graphId: number
  dagId: number
  status: number
  submitTime: string
  finishTime: string
  nodeStatusList: NodeVoStatusType[]
}

export interface GraphVoType {
  // 实验ID
  graphId: number
  // 实验名称
  graphName: string
  // 实验备注
  graphDesc: string
  // 项目组名称
  projectName: string
  // 实验状态
  status: number
  // 实验运行ID
  execId: number
  // 实验创建人
  creator: string
  // 实验创建时间
  createTime: string
  // 实验更新时间
  updateTime: string
  // 实验对应的图信息
  dag: DagVoType
  // 版本对应的调度任务信息
  taskStatus: number
  // 调度任务id
  taskId: number
  task: TaskVo
  execStatus: ExecStatusVoType
}

export interface ComponentVoType {
  // 组件ID
  componentId: number
  // 组件版本ID
  componentVersionId: number
  // 组件类型
  typeId: number
  // 组件名称
  componentName: string
  // 组件描述
  componentDesc: string
  // 组件版本描述信息
  versionDesc: string
  // 组件输入槽位数
  inSlotNum: number
  // 组件输出槽位数
  outSlotNum: number
}

export interface ComponentTypeVoType {
  // 组件模版类型ID
  typeId: number
  // 组件模版类型名
  typeName?: string
  // 组件模版类型索引
  typeIndex: number
  components: ComponentVoType[]
}

export interface ComponentCategoryVoType {
  // 组件模版分类ID
  categoryId: number
  // 组件模版分类名
  categoryName?: string
  // 组件模版分类索引
  categoryIndex?: number
  types: ComponentTypeVoType[]
}

export interface WXProjectVoType {
  // 项目组信息
  id: number
  // 项目组ID
  name: string
  // 项目组名称
  tenantId?: number
  // 租户ID
  status?: number
  // 状态 1:正常 0:删除
  description?: string
  // 简介
  createTime?: string
  updateTime?: string
  syncTime?: string,
  // 业务线
  bizLine?: string,
  // 业务主题
  bizSubject?: string
}

// 实验列表弹框提交的payload
export interface GraphModalPayload {
  name: string
  desc: string
}

// 可视化图上面的运行列表数据格式
export interface GraphItemType {
  name: string
  graphId: number
  execId: number
  dagId: number
  isActive?: boolean
}

// 每一个实验及其运行版本的格式
export interface GraphExecPayload {
  graphId: number
  execId: number
}

// 实验运行状态映射
export interface ExecStatusMapType {
  [index: number]: {
    label: string
    class: string
    textClass: string
  }
}

export interface ComponentIconMapType {
  [index: number]: {
    [subIndex: number]: string
    icon: string
  }
}

export interface PositionType {
  type?: string
  x: number
  y: number
}

export interface AddEdgePositionType extends PositionType {
  slotType: string
  fromNodeId: number
  fromSlotId: number
}

export interface TaskModelPayload {
  execId: number
  userDef: string
  comment: string
  planType: number
  crontabExpr: string
  taskNames: string
  readyTime: string
}

export interface TaskRegisterSubmitPayload {
  taskId: number
  userDef: string
  comment: string
  planType: number
  crontabExpr: string
  taskNames: string
  readyTime: string
}

export interface TaskUpdatePayload {
  taskId: number
}
export interface HistogramVo {
  height: number
  rangeLeft: number
  rangeRight: number
  rate: number
}
export interface HistogramBarChartVo {
  value: number
  start: number
  end: number
  rate: number
}
export interface RingVo {
  name: string
  rate: number
  count: number
}

export interface PieDataVo {
  name: string
  value: number
}

export interface BarDataVo {
  start: number
  end: number
  value: number
  rate: number
}

export interface XYDataVo {
  dataX: number[]
  dataY: number[]
}

export interface DescribeVo {
  columnName: string
  dataType: number
  missRate: number
  distinct: number
  mean: number
  stddev: number
  correlation: number
  mutualInformation: number
  gini: number
  gain: number
  chart: string
  distributionHistogram: HistogramVo[]
  distributionRing: RingVo[]
}

export interface CurveVo {
  points: number[][]
  auc: number
}

export interface FeatureWeightVo {
  feature: string
  weight: number
}
export interface LabelStatisticsVo {
  label: string
  count: number
  percentage: number
}

export interface BinaryClassifyEvaluatorVo {
  label: string
  pr: CurveVo
  f1: number
  rows: number
  precision: number
  loss: number
  roc: CurveVo
  labels: string | number[]
  confusionMatrix: number[][]
  featureWeights: FeatureWeightVo[]
  labelStatistics: LabelStatisticsVo[]
}

export interface BinaryClassifyEvaluatorVoResult {
  code?: number
  loading?: boolean
  message?: string
  data: BinaryClassifyEvaluatorVo
}

export interface RegressionEvaluatorVo {
  label: string
  rows: number
  mae: number
  rmse: number
  rmsle: number
  r2: number
  mape: number
  residualDistribution: HistogramVo[]
  featureWeights: FeatureWeightVo[]
}

export interface RegressionEvaluatorVoResult {
  code?: number
  loading?: boolean
  message?: string
  data: RegressionEvaluatorVo
}

export interface ChartStyle {
  width: string
  height: string
}

export interface FieldSubmitItemVo {
  fieldName: string
  fieldType: number | string
}

export interface TaskVo {
  taskId?: number | null
  bindId: number | null
  regId: number | null
  type: string | null
  queueName: string | null
  taskName: string | null
  userDef: string | null
  owner: string | null
  projName: string | null
  comment: string | null
  crontabExpr?: string | null
  execDay?: string | null
  execHours?: string | null
  planType?: number | null
  readyTime?: string | null
  status?: number | null
  timeout?: number | null
  maxRetryTimes?: number
  relations?: any
}
export interface ParamVersionVo {
  paramVersionId: number
  paramId: number
  value: string
  createTime: string
  updateTime: string
  customVariable: string
  creator: string
  editor: string
}

export interface NodeUpstreamVo {
  name: string
}
