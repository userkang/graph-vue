import { PSLogVoType, PSModelVoType, PSResourceVoType, PSVoType } from '@/types/mlxPs';
import { PSConfigModalDisplayType } from '@/types/service';
import { ClusterVoType, FederationVoType, PushDetailVoType, PushRecordVoType, ClusterPanelDisplayType } from '@/types/mlxCluster';

export const MLXPSInfoMock: () => PSVoType = () => ({
    // 当前版本id
    activeVersionId: 0,
    // appkey
    appkey: '',
    // 创建时间
    createTime: '',
    // 启动方式，1:AFO 2:PLUS
    deploy: 0,
    // 描述
    description: '',
    // psId
    id: 0,
    // ps名称
    name: 'hello world',
    // 所属项目组
    owner: '',
    // 创建者
    creator: '',
    // ps类型，1:近线 2:在线 3:离线
    type: 0,
    // 更新时间
    updateTime: '',
});

export const defaultPSModelMock: () => PSModelVoType = () => ({
    // 是否开启自动dump true：开启，false：未开启
    autoDump: false,
    // 是否开启push模型 true：开启，false：未开启
    autoPush: false,
    id: 0,
    // 模型id
    modelId: 0,
    // 模型版本id
    modelVersionId: 0,
    // 模型版本路径
    modelVersionPath: '',
    // 模型名称
    name: '',
    // ps运行appid
    psAppId: 0,
    // psId
    psId: 0,
    // push的mafka信息
    pushConfig: '',
    // 识别号
    versionIdentifying: ''
});

export const MLXPSResourceMock: () => PSResourceVoType = () => ({
    // 当前版本id
    activeAppId: 0,
    // 任务名称
    afoName: '',
    // 运行队列
    afoQueue: '',
    // 资源信息，workerNum：ps个数，workerMem：ps内存。
    // 前后空格隔开 ' -DworkerNum=1 -DworkerMem=3 -DcpuNum=undefined -DgpuNum=undefined '
    afoResource: '',
    // 其他参数
    config: '',
    // 创建时间
    createTime: '',
    psVersion: '',
    id: 0,
    // psId
    psId: 0,
    // 当前ps配置的运行状态 0:初始化 10:提交中 20:提交失败 30:运行中 40:运行错误 50:停止 60:停止中
    status: 0
});

export const defaultPSRunningLogMock: () => PSLogVoType = () => ({
    id: 0,
    // ps版本id
    versionId: 0,
    // ps app id
    appid: 0,
    // 命令行
    command: '',
    // 运行日志
    log: '',
    // 启动时间 yyyy-MM-dd HH:mm:ss
    startTime: '',
    // 结束时间 yyyy-MM-dd HH:mm:ss。若结束时间为空，取当前时间
    finishTime: '',
    // 当前PS配置的运行状态 0:初始化 10:提交中 20:提交失败 30:运行中 40:运行错误 50:停止 60:停止中
    status: 0,
});

export const defaultPSConfigModalDisplay: () => PSConfigModalDisplayType = () => ({
    isRemoveShow: false,
    isSaveShow: false,
    isSaveAsShow: false,
    isCloseDumpShow: false,
    isOpenDumpShow: false,
    isClosePushShow: false,
    isOpenPushShow: false
});

export const defaultClusterPanelDisplayType: () => ClusterPanelDisplayType = () => ({
    isMachineShow: false,
    isModelShow: false,
    isDeleteModelShow: false,
    isDumpShow: false,
    isDeleteDuplicationShow: false,
    isOnlineDuplicationShow: false,
    isOfflineDuplicationShow: false
  });

export const defaultRegistryServiceMock = () =>  ({
        serviceType: 'mlxps',
        psType: 1,
        appKey: '',
        tfImage: '',
        psName: '',
        deployType: 1,
        sharedNum: 1,
        env: 'staging',
        serviceName: '',
        imageType: '',
        envImage: '',
        desc: ''
});

export const defaultClusterVoMock: () => ClusterVoType = () => ({
    // id
    id: 0,
    status: 0,
    // 分组id
    clusterId: '',
    // ps分组名称
    name: '',
    // 原版本owner
    owner: '',
    // 创建者
    creator: '',
    // 万象项目组
    wx_project: '',
    // 创建时间
    createTime: '',
    // 更新时间
    updateTime: '',
    // 分片数
    shardNum: 0,
    // 环境
    environment: '',
    // 描述
    description: '',
    appkey: ''
});

export const defaultFederationMock: () => FederationVoType = () => ({
    id: 1,
    clusterId: 'ha',
    federationId: 'hello',
    createTime: '2018-01-01',
    name: 'hello world',
    owner: 'god',
    online: false,
});

export const defaultPushDetailMock: () => PushDetailVoType = () => ({
    appid: '',
    clusterId: '',
    command: '',
    federationDetailInfo: '',
    finishTime: '',
    log: '',
    modelName: '',
    modelVersionPath: '',
    recordId: '',
    status: 0,
    submitTime: ''
});

export const defaultPushConfigMock = () => ({
    // mafka topic
    topic: '',
    // topic ns
    namespace: '',
    // fetcher version
    fetcherVersion: 'stable',
    shardNum: 0,
    /** appkey */
    appkey: '',
    /** 分组数量的选择类型：CUSTOM MLX_CLUSTER */
    shardType: 'MLX_CLUSTER',
    /** 分组ID */
    clusterId: ''
});
