import { mock, setup } from 'mockjs';
import pathToRegexp from 'path-to-regexp';

const baseURL = 'http://mlp.data.test.sankuai.com/mlapi';

setup({
    timeout: 300
});

const genRegexp = (path: string) => pathToRegexp(`${baseURL}${path}?traceId(.*)`);

// 查询flink作业列表
mock(genRegexp(`/mlx/stream/task`), 'get', () => {
    return mock({
        code: 0,
        data: {
            'currentPageNo|1-3': 1,
            'pageSize': '@pick(5, 10, 20)',
            'totalCount|5-200': 5,
            'totalPageCount|0-200': 5,
            'items|1-10': [{
                id: '@id',
                jobId: '@id',
                jobStatus: '@pick(DOWN, ACTIVE, DEPLOYING, KILLING, FAILD, KILLED)',
                jobType: 'flink',
                jobName: '@word(10,20)',
                wxProject: '@word(10,20)',
                creator: '@name',
                createTime: '@date',
                updateTime: '@date'
            }]
    }
    });
});

// 查询可用的实时队列列表
mock(genRegexp(`/mlx/stream/task/queue`), 'get', () => {
    return mock({
        'code': 0,
        'message': '@word(5,20)',
        'data|1-10': ['@word(5,20)']
    });
});

// 创建flink作业
mock(genRegexp(`/mlx/stream/task`), 'post', () => {
    return mock({
        code: '@pick(0, 500)',
        message: '@word(5,20)',
        data: {
            id: '@id'
        }
    });
});


mock(genRegexp(`/mlx/stream/task/{taskId}/job/:jobId/deploy-log`), 'get', () => {
    return mock({
        code: 0,
        data: {
            'completed|1-2': true,
            'job_id': '@id',
            'message': '@word(5-20)',
            'offset|1-100': 3
        }
    });
});

// 查询flink作业详情
mock(genRegexp(`/mlx/stream/task/:taskId/job/:jobId`), 'get', () => {
    return mock({
        code: 0,
        data: {
            'id': 118,
            'jobId': 65,
            'jobName': 'jmo',
            'jobType': 'khgu8o',
            'jobStatus': '@pick(DOWN, ACTIVE, DEPLOYING, KILLING, FAILD, KILLED)',
            'creator': '@name',
            'createTime': '4jofzz',
            'updateTime': '5ek9dk',
            'mainFunction': 'arr',
            'customEntryFuntion': 'b1ruzd',
            'evalBatchSize': 11,
            'psId': 39,
            'psName': '@word(5,10)',
            'modelMappingId': 18,
            'modelName': 'modelName',
            'shuffleBatchSize': 106,
            'trainingParallel': 45,
            'labelParse': '1h1',
            'collectorInfo': '1xi',
            'useMlxFeatureExtracter': false,
            'featureExtracterParallel': 6,
            'queue': '78d9',
            'jmMem': 12,
            'startType': false,
            'tmNum': 73,
            'hadoopUser': '5yq9',
            'tmMem': 53,
            'feature': true,
            'customParam': 'customParam',
            'parallelism': 42,
            'logLevel': 'il1p',
            'flinkVersion': 'lxzt',
            'notes': 'qvy3w5',
            'trackingUrl': '@url',
            'projectName': '@word',
            /** 是否有增量信息 */
            'hasFetcherInfo|1-2': false,
            'topics|1-3': [
                {
                    'topicName': '@word(5,10)',
                    'isRead|1-2': true,
                    'isAuth|1-2': false,
                    'namespace': '@word(6,15)',
                    'readOffsetType': '@pick(LASTTIME, LATEST, EARLIEST, TIMESTAMP)',
                    'readTimestamp': '@date',
                    'parallelism|1-4': 1
                }
            ]
        }
    });
});

mock(genRegexp(`/mlx/stream/task/:taskId/job/:jobId`), 'put', () => {
    return mock({
        code: 0,
        data: {
            'id': 118,
            'jobId': 65,
            'jobName': 'jmo',
            'jobType': 'khgu8o',
            'jobStatus': '@pick(DOWN, ACTIVE, DEPLOYING, KILLING, FAILD, KILLED)',
            'creator': '@name',
            'createTime': '4jofzz',
            'updateTime': '5ek9dk',
            'mainFunction': 'arr',
            'customEntryFuntion': 'b1ruzd',
            'evalBatchSize': 11,
            'psId': 39,
            'psName': '@word(5,10)',
            'modelMappingId': 18,
            'modelName': 'modelName',
            'shuffleBatchSize': 106,
            'trainingParallel': 45,
            'labelParse': '1h1',
            'collectorInfo': '1xi',
            'useMlxFeatureExtracter': false,
            'featureExtracterParallel': 6,
            'queue': '78d9',
            'jmMem': 12,
            'startType': false,
            'tmNum': 73,
            'hadoopUser': '5yq9',
            'tmMem': 53,
            'feature': true,
            'customParam': 'customParam',
            'parallelism': 42,
            'logLevel': 'il1p',
            'flinkVersion': 'lxzt',
            'notes': 'qvy3w5',
            'trackingUrl': '@url',
            'topics|1-3': [
                {
                    'topicName': '@word(5,10)',
                    'isRead|1-2': true,
                    'isAuth|1-2': false,
                    'namespace': '@word(6,15)',
                    'readOffsetType': '@pick(LASTTIME, LATEST, EARLIEST, TIMESTAMP)',
                    'readTimestamp': '@date',
                    'parallelism|1-4': 1
                }
            ]
        }
    });
});

// 查询作业操作记录列表
mock(genRegexp(`/mlx/stream/task/:taskId/job/:jobId/operation`), 'get', () => {
    return mock({
        code: 0,
        data: {
            'currentPageNo|1-3': 1,
            'pageSize': '@pick(5, 10, 20)',
            'totalCount|5-200': 5,
            'totalPageCount|0-200': 5,
            'items|1-10': [{
                command: '@cword(2,5)',
                createTime: '@date',
                job_name: '@word(5,10)',
                operator: '@cname'
            }]
        }
    });
});

// 查询作业发布历史列表
mock(genRegexp(`/mlx/stream/task/:taskId/job/:jobId/history`), 'get', () => {
    return mock({
        code: 0,
        data: {
            'currentPageNo|1-3': 1,
            'pageSize': '@pick(5, 10, 20)',
            'totalCount|5-200': 5,
            'totalPageCount|0-200': 5,
            'items|1-10': [{
                // 开始时间
                startTime: '@date',
                // 结束时间
                endTime: '@date',
                // 版本commit
                commit: '@word(5,20)',
                // 发布人
                publisher: '@cname',
                // 发布结果
                publishStatus: '@pick(FAILURE,SUCCESS)',
                // 描述
                description: '@cword(5,10)',
                // git仓库
                repos: '@word(5,10)',
                // git 目录
                subdir: '@word(5,10)',
                // 代码版本
                gitVersion: '@word(5,10)',
                // JDK版本
                jdkVersion: '@word(5,10)',
                // 编译参数
                compileArgs: '@word(5,10)',
                jarUrl: '@word(5,10)',
                trackingUrl: '@url'
            }]
        }
    });
});

// 查询git版本列表
mock(genRegexp(`/mlx/stream/task/:taskId/job/:jobId/version`), 'get', () => {
    return mock({
        code: 0,
        data: {
            'currentPageNo|1-3': 1,
            'pageSize': '@pick(5, 10, 20)',
            'totalCount|5-200': 5,
            'totalPageCount|0-200': 5,
            'items|0': [{
                id: '@id',
                jobId: '@id',
                name: '@word(5, 10)',
                creator: '@name',
                repos: '@word(10, 20)',
                mainClass: '@word(5, 10)',
                custom: '@word(5, 10)',
                subdir: '@word(5, 10)',
                gitVersion: '@word(5, 10)',
                mvnArgs: '@word(5, 10)',
                jdkVersion: '@word(5, 10)',
                notes: '@word(5, 10)',
                status: '@pick(CURRENT, UNUSED)',
                created: '@word(5, 10)',
                compileTime: '@date',
                jarUrl: '@word(5, 10)'
            }]
        }
    });
});

// 查询可用的topic列表
mock(genRegexp(`/mlx/stream/task/topic`), 'get', () => {
    return mock({
        'code': 0,
        'message': '@word(5,20)',
        'data|1-10': ['@word(5,20)']
    });
});

// 停止flink作业

mock(genRegexp(`/mlx/stream/task/:taskId/job/:jobId/shutdown`), 'post', () => {
    return mock({
        code: '@pick(0, 10)',
        message: '@word(5,20)'
    });
});

mock(genRegexp(`/mlx/stream/task/:taskId/job/:jobId/startup`), 'post', () => {
    return mock({
        code: '@pick(0, 10)',
        message: '@word(5,20)'
    });
});


mock(genRegexp(`/mlx/stream/task/:taskId/job/:jobId/version`), 'post', () => {
    return mock({
        code: '@pick(0, 10)',
        message: '@word(5,20)'
    });
});

mock(genRegexp(`/mlx/stream/task/:taskId/job/:jobId/version/:versionId`), 'delete', () => {
    return mock({
        code: '@pick(0, 10)',
        message: '@word(5,20)'
    });
});

mock(genRegexp(`/mlx/stream/task/:jobProject/mlxps`), 'get', () => {
    return mock({
        'code': 0,
        'message': '@word(5,20)',
        'data|1-10': [
            {
                /** 当前版本id */
                'activeVersionId': '@id',
                /** appkey */
                'appkey': '@word(5,10)',
                /** 创建时间 */
                'createTime': '@date',
                /** 启动方式，1:AFO 2:PLUS */
                'deploy': 1,
                /** 描述 */
                'description': '@word(5,10)',
                /** psId */
                'id': '@id',
                /** ps名称 */
                'name': '@word(5,10)',
                /** psAppId */
                'psAppId': '@id',
                /** 所属项目组 */
                'owner': '@word(5,10)',
                /** 创建者 */
                'creator': '@name',
                /** ps类型，1:近线 2:在线 3:离线 */
                'type': 1,
                /** 更新时间 */
                'updateTime': '@date',
                /** 是否有增量信息 */
                'hasFetcherInfo|1-2': false
            }
        ]
    });
});

mock(genRegexp('/mlxps/model/:psId'), 'get', () => {
    return mock({
        'code': 0,
        'message': '@word(5, 10)',
        'data|1-10': [
            {
                // # 是否开启自动dump true：开启，false：未开启
                'autoDump|1-2': true,
                // # 是否开启push模型 true：开启，false：未开启
                'autoPush|1-2': true,
                'mappingId': '@id',
                // # 模型id
                'modelId': '@id',
                // # 模型版本id
                'modelVersionId': '@id',
                // # 模型版本路径
                'modelVersionPath': '@word(1, 10)',
                // # 模型名称
                'name': '@word(1, 10)',
                // # ps运行appid
                'psAppId': '@id',
                // # psId
                'psId': '@id',
                // # push的mafka信息
                'pushConfig': '@word(1, 10)',
                // # 识别号
                'versionIdentifying': '@word(1, 10)',
                // # 流式任务id
                'taskId': '@id',
                // # 是否创建了流式任务
                'hasStream|1-2': true
            }
        ]
    });
});

mock(genRegexp('/mlxps/stream/task/:taskId/job/:jobId/delete'), 'delete', () => {
    return mock({
        code: '@pick(0, 1)',
        message: '@word(10, 20)'
    });
});

mock(genRegexp('/mlxps/:psId/fetcher-info'), 'get', () => {
    return mock({
        code: 0,
        message: '@word(10, 20)',
        data: {
            // # appkey
            'appkey': '@word(5,20)',
            // # mafka topic
            'topic': '@word(0,5)',
            // # topic ns
            'namespace': '@word(0,5)',
            // # fetcher version
            'fetcherVersion': '@word(0,5)',
            // # 分组数量的选择类型：CUSTOM MLX_CLUSTER
            'shardType': '@pick(CUSTOM,MLX_CLUSTER)',
            // # 分组ID
            'clusterId': '@id',
            // # 自定义NUM
            'shardNum|1-100': 1
        }
    });
});

mock(genRegexp('/mlxps/:psId/fetcher-info'), 'post', () => {
    return mock({
        code: 0,
        message: '@word(10, 20)',
        data: {
            // # appkey
            'appkey': '@word(5,20)',
            // # mafka topic
            'topic': '@word(0,5)',
            // # topic ns
            'namespace': '@word(0,5)',
            // # fetcher version
            'fetcherVersion': '@word(0,5)',
            // # 分组数量的选择类型：CUSTOM MLX_CLUSTER
            'shardType': '@pick(CUSTOM,MLX_CLUSTER)',
            // # 分组ID
            'clusterId': '@id',
            // # 自定义NUM
            'shardNum|1-100': 1
        }
    });
});

mock(genRegexp('/mlxps/:psId/fetcher-info'), 'put', () => {
    return mock({
        code: 0,
        message: '@word(10, 20)',
        data: {
            // # appkey
            'appkey': '@word(5,20)',
            // # mafka topic
            'topic': '@word(0,5)',
            // # topic ns
            'namespace': '@word(0,5)',
            // # fetcher version
            'fetcherVersion': '@word(0,5)',
            // # 分组数量的选择类型：CUSTOM MLX_CLUSTER
            'shardType': '@pick(CUSTOM,MLX_CLUSTER)',
            // # 分组ID
            'clusterId': '@id',
            // # 自定义NUM
            'shardNum|1-100': 1
        }
    });
});

// mock(genRegexp('/mlx/cluster'), 'get', () => {
//     return mock({
//         code: 0,
//         message: '@word(10, 20)',
//         data: {
//             // # appkey
//             'appkey': '@word(5,20)',
//             // # mafka topic
//             'topic': '@word(0,5)',
//             // # topic ns
//             'namespace': '@word(0,5)',
//             // # fetcher version
//             'fetcherVersion': '@word(0,5)',
//             // # 分组数量的选择类型：CUSTOM MLX_CLUSTER
//             'shardType': '@pick(CUSTOM,MLX_CLUSTER)',
//             // # 分组ID
//             'clusterId': '@id',
//             // # 自定义NUM
//             'shardNum|1-100': 1
//         }
//     });
// });

// 获取线上分组
mock(genRegexp('/mlx/cluster'), 'get', () => {
    return mock({
        'code': 0,
        'message': '@word(10, 20)',
        'data|1-10': [{
            // # id
            'id': '@id',
            // # 分组id
            'clusterId': '@id',
            // # ps分组名称
            'name': '@word(5, 10)',
            // # 原版本owner
            'owner': '@word(5, 10)',
            // # 创建者
            'creator': '@name',
            // # 万象项目组
            'wx_project': '@word(5, 10)',
            // # 创建时间
            'createTime': '@date',
            // # 分片数
            'shardNum|1-10': 1,
            // # 环境
            'environment': '@word(5, 10)',
            // # 描述
            'description': '@word(5, 20)'
        }]
    });
});

mock(genRegexp('/mlxps/model/:psId/:mappingId'), 'get', () => {
    return mock({
        code: 0,
        message: '@word(6, 10)',
        data: {
            // # 是否开启自动dump true：开启，false：未开启
            'autoDump|1-2': true,
            // # 是否开启push模型 true：开启，false：未开启
            'autoPush|1-2': true,
            'mappingId': '@id',
            // # 模型id
            'modelId': '@id',
            // # 模型版本id
            'modelVersionId': '@id',
            // # 模型版本路径
            'modelVersionPath': '@word(1, 10)',
            // # 模型名称
            'name': '@word(1, 10)',
            // # ps运行appid
            'psAppId': '@id',
            // # psId
            'psId': '@id',
            // # push的mafka信息
            'pushConfig': '@word(1, 10)',
            // # 识别号
            'versionIdentifying': '@word(1, 10)',
            // # 流式任务id
            'taskId': '@id',
            // # 是否创建了流式任务
            'hasStream|1-2': true
        }
    });
});

// 开启增量推送
mock(genRegexp('/mlxps/model/:mappingId/fetcher'), 'post', () => {
    return mock({
        code: '@pick(0, 1)',
        message: '@word(5, 10)'
    });
});

// 关闭增量推送
mock(genRegexp('/mlxps/model/:mappingId/fetcher'), 'delete', () => {
    return mock({
        code: '@pick(0, 1)',
        message: '@word(5, 10)'
    });
});

mock(genRegexp('/wxProject'), 'get', () => {
    return mock({
        'code': 0,
        'message': '@word(10, 20)',
        'data|1-10': ['@word(5,10)']
    });
});
