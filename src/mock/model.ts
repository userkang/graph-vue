import { ModelVoType } from '@/types/model';

export const defaultModelMock: () => ModelVoType = () => ({
    autoExamine: false,
    createTime: '',
    description: '',
    hdfsCluster: '',
    id: 0,
    md5: '',
    modelName: '',
    modelPrefixPath: '',
    modelRegularPath: '',
    modelType: '',
    projectName: '',
    creator: '',
    storage: '',
    updateTime: '',
    modelSource: 0,
    syncStatus: 0
});
