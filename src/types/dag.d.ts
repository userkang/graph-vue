declare interface IDagType {
  // DAG图ID
  dagId: number
  // 实验节点信息
  nodes: INodeType[]
  // 实验连线信息
  edges: IEdgeType[]
}

declare interface ITransform {
  scale: number
  translateX: number
  translateY: number
  offsetX: number
  offsetY: number
}

declare interface INodeType {
  nodeId: number
  // 组件名称
  nodeName: string
  // 组件描述
  nodeDesc: string
  // 节点X坐标
  posX: number
  // 节点Y坐标
  posY: number
}

declare interface IEdgeType {
  // 连线ID
  edgeId?: number | string
  // 源节点ID
  fromNodeId: number
  // 目标节点ID
  toNodeId: number
}

declare interface IRectInfo {
  width: number
  height: number
}

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
