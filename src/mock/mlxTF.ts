import {
    ScalingGroupAppVoType,
    ScalingGroupQueryType,
    ServingTemplateVoType,
    ServingVoType
} from '@/types/mlxTF';

export const mlxTFInfoMock: () => ServingVoType = () => ({
    id: '',
    appkey: '',
    type: '',
    creator: '',
    wxProject: '',
    description: '',
    status: 0,
    createTime: '',
    updateTime: ''
});


export const mlxTFTemplateMock: () => ServingTemplateVoType = () => ({
    id: 0,
    servingId: 0,
    name: '',
    creator: '',
    createTime: '',
    updateTime: '',
    models: []
});

export const defaultScaleGroup: () => ScalingGroupQueryType = () => ({
    // 伸缩组名称
    name: '',
// 运行集群
    hdfsCluster: '',
// 队列
    queue: '',
// GPU类型
    gcores: '',
// 资源参数
    resource: '',
// 其他参数
    extra: ''
});

export const ScalingGroupAppVoMock: () => ScalingGroupAppVoType = () => ({
    id: 0,
    scalingGroupId: 0,
    servingVersionId: 0,
    templateId: 0,
    name: '',
    env: '',
    appid: '',
    status: 0,
    startTime: '',
    finishTime: '',
    log: '',
    command: ''
});
