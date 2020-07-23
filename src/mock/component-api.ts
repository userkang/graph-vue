import { mock, setup } from 'mockjs';
import pathToRegexp from 'path-to-regexp';

const baseURL = 'http://mlp.data.test.sankuai.com/mlapi';

setup({
    timeout: 300
});

const genRegexp = (path: string) => pathToRegexp(`${baseURL}${path}?traceId(.*)`);

// 查询组件category和type两级列表
mock(genRegexp(`/cmpt/category-type`), 'get', () => {
    return mock({
        'code': 0,
        'data|0-10': [
            {
                'categoryId': '@natural',
                'categoryName': '@ctitle(4, 10)',
                'categoryIndex|+1': 0,
                'types|0-10': [
                    {
                        'typeId': '@natural',
                        'categoryId': '@natural',
                        'typeName': '@ctitle',
                        'typeIndex|+1': 0
                    }
                ]
            }
        ]
    });
});

// 添加组件category
mock(genRegexp(`/cmpt/category`), 'post', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)',
        data: '@natural'
    });
});

// 重命名组件category
mock(genRegexp(`/cmpt/category`), 'patch', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

// 排序组件category
mock(genRegexp(`/cmpt/category/reorder`), 'patch', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

// 删除组件category
mock(genRegexp(`/cmpt/category/:categoryId`), 'delete', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

// 添加组件type
mock(genRegexp(`/cmpt/type`), 'post', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)',
        data: '@natural'
    });
});

// 重命名组件type
mock(genRegexp(`/cmpt/type`), 'patch', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

// 排序组件type
mock(genRegexp(`/cmpt/type/reorder`), 'patch', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

// 删除组件type
mock(genRegexp(`/cmpt/type/:typeId`), 'delete', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

// 查询指定type下的组件列表
mock(genRegexp(`/cmpt/component`), 'get', () => {
    return mock({
        'code': 0,
        'data|0-10': [
            {
                'typeId': '@natural',
                'componentId': '@natural',
                'componentVersionId|+1': 1,
                'componentName': '@word',
                'componentDesc': '@ctitle',
                'description': '@cparagraph',
                'scope': '@pick(GLOBAL, PRIVATE, wxProject)',
                'componentGroup': [],
                'status': '@pick(0, 10, 20, 30, 40, 50)',
                'creator': '@name',
                'editor': '@name',
                'createTime': '@date',
                'updateTime': '@date',
                'mergeable': true,
                'jobType': '@word'
            }
        ]
    });
});

// 查询指定组件的详情
mock(genRegexp(`/cmpt/component/:componentId`), 'get', () => {
    return mock({
        code: 0,
        data: {
            'typeId': '@natural',
            'componentId': '@natural',
            'componentVersionId|+1': 1,
            'componentName': '@word',
            'componentDesc': '@ctitle',
            'description': '@cparagraph',
            'scope': '@pick(GLOBAL, PRIVATE, WXPROJECT)',
            'componentGroup': [],
            'status': '@pick(0, 10, 20, 30, 40, 50)',
            'creator': '@name',
            'editor': '@name',
            'createTime': '@datetime',
            'updateTime': '@datetime',
            'mergeable': true,
            'jobType': '@word'
        }
    });
});

// 添加组件
mock(genRegexp(`/cmpt/component`), 'post', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)',
        data: '@natural'
    });
});

// 上线组件
mock(genRegexp(`/cmpt/component/:componentId/approval/online`), 'post', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

// 下线组件
mock(genRegexp(`/cmpt/component/:componentId/approval/offline`), 'post', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

// 删除组件
mock(genRegexp(`/cmpt/component/:componentId`), 'delete', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

// 排序组件
mock(genRegexp(`/cmpt/component/reorder`), 'patch', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

// 获取组件参数Tab
mock(genRegexp(`/cmpt/component/:componentId/param-tab`), 'get', () => {
    return mock({
        'code': 0,
        'data|3-10': [
            {
                'tabId': '@natural',
                'componentId': '@natural',
                'componentVersionId': '@natural',
                'tabName': '@word',
                'tabLabel': '@ctitle(4, 10)',
                'tabIndex|+1': 1
            }
        ]
    });
});

// 添加组件参数tab
mock(genRegexp(`/cmpt/component/param-tab`), 'post', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)',
        data: '@natural'
    });
});

// 编辑组件
mock(genRegexp(`/cmpt/component/:componentId`), 'patch', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

// 组件参数tab排序
mock(genRegexp(`/cmpt/param-tab/reorder`), 'patch', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

// 修改组件参数tab信息
mock(genRegexp(`/cmpt/component/param-tab/:paramTabId`), 'patch', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

// 删除组件参数tab
mock(genRegexp(`/cmpt/component/param-tab/:paramTabId`), 'delete', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

// 获取组件Tab下的参数列表
mock(genRegexp(`/cmpt/component/param-tab/:paramDefId/param`), 'get', () => {
    return mock({
        'code': 0,
        'data|3-10': [
            {
                'paramDefId|+1': 1,
                'tabId|+1': 1,
                'label': '@ctitle(3, 10)',
                'paramName': '@word(3, 10)',
                'dataType': '@pick(STRING, INTEGER, BOOLEAN, FLOAT, QUEUE, GPU_QUEUE, MODEL, MODEL_VERSION, MLXPS)',
                'paramType': '@pick(INPUT, TEXTAREA, NUMBER, SELECTOR, RADIO, CHECKBOX, TAB, DATE, LABEL, IDE)',
                'defaultValue': '@word',
                'required': '@boolean',
                'min': '@number',
                'max': '@number',
                'tooltip': '@ctitle',
                'options|0-5': [
                    {
                        label: '@cword(3, 5)',
                        value: '@word'
                    }
                ]
            }
        ]
    });
});

// 参数数据类型列表
mock(genRegexp(`/cmpt/param/data-type`), 'get', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)',
        data: [
            {
                label: '字符串',
                value: 'STRING'
            },
            {
                label: '整形数值',
                value: 'INTEGER'
            },
            {
                label: '布尔值',
                value: 'BOOLEAN'
            },
            {
                label: '浮点数值',
                value: 'FLOAT'
            },
            {
                label: 'Yarn队列',
                value: 'QUEUE'
            },
            {
                label: 'GPU队列',
                value: 'GPU_QUEUE'
            },
            {
                label: '模型',
                value: 'MODEL'
            },
            {
                label: '模型版本',
                value: 'MODEL_VERSION'
            },
            {
                label: 'MLX PS 服务',
                value: 'MLXPS'
            }
        ]
    });
});

// 参数渲染类型列表
mock(genRegexp(`/cmpt/param/param-type`), 'get', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)',
        data: [
            {
                label: '单行输入框',
                value: 'INPUT'
            },
            {
                label: '多行输入框',
                value: 'TEXTAREA'
            },
            {
                label: '计数器',
                value: 'NUMBER'
            },
            {
                label: '下拉选择框',
                value: 'SELECTOR'
            }, {
                label: '单选框',
                value: 'RADIO'
            }, {
                label: '多选框',
                value: 'CHECKBOX'
            }, {
                label: '选项卡',
                value: 'TAB'
            }, {
                label: '日期选择框',
                value: 'DATE'
            }, {
                label: '文本类型',
                value: 'LABEL'
            }, {
                label: 'IDE编辑器',
                value: 'IDE'
            },
            {
                label: '特殊',
                value: 'teshu'
            }
        ]
    });
});

// 添加组件参数信息
mock(genRegexp(`/cmpt/component/param`), 'post', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

// 修改组件参数信息
mock(genRegexp(`/cmpt/component/param/:paramDefId`), 'patch', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

// 组件参数tab排序
mock(genRegexp(`/cmpt/param/reorder`), 'patch', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

// 配置参数间关联
mock(genRegexp(`/cmpt/param-relation`), 'post', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

// 删除组件参数
mock(genRegexp(`/cmpt/component/param/:paramId`), 'deleted', () => {
    return mock({
        code: 0,
        message: '@cword(10, 20)'
    });
});

mock(genRegexp(`/cmpt/component/:componentId/slot-def`), 'get', () => {
    return mock({
        'code': 0,
        'data|3-10': [
            {
                'slotDefId': '@id',
                'componentId': '@id',
                'componentVersionId': '@id',
                // # 槽位名称
                'slotName': '@ctitle(5, 16)',
                // # 槽位描述
                'slotDesc': '@cparagraph',
                // # 槽位IO类型
                // 1是输入，2是输出
                'ioType|1-2': 1,
                // # 槽位类型
                'slotType': '@word',
                // # 槽位顺序
                'slotIndex|1-100': 100,
                // # 是否必填，仅对输入槽位生效
                'required|1-2': true
            }
        ]
    });
});

mock(genRegexp(`/cmpt/component/slot`), 'post', () => {
    return mock({
        'code|0-1': 0,
        'message': '@cword(10, 20)'
    });
});

mock(genRegexp(`/cmpt/component/slot/:slotId`), 'patch', () => {
    return mock({
        'code|0-1': 0,
        'message': '@cword(10, 20)'
    });
});

mock(genRegexp(`/cmpt/component/slot/:slotId`), 'delete', () => {
    return mock({
        'code|0-1': 0,
        'message': '@cword(10, 20)'
    });
});

mock(genRegexp(`/cmpt/component-scope`), 'get', () => {
    return {
        code: 0,
        data: [
            {
                label: '全局',
                value: 'GLOBAL'
            },
            {
                label: '项目组',
                value: 'wxproject'
            },
            {
                label: '私有',
                value: 'PRIVATE'
            }
        ]
    };
});

mock(genRegexp(`/cmpt/slot/slot-type`), 'get', () => {
    return mock({
        'code': 0,
        'message': '@cword(10, 20)',
        'data|3-10': [
            {
                label: '@cword(2, 10)',
                option: '@word(2, 10)'
            }
        ]
    });
});


mock(genRegexp(`mlx/cluster/:clusterId/federation/updatedetail`), 'post', () => {
    return mock({
        'code': 0,
        'message': '@cword(10, 20)',
        'data|3-10': [
            {
                label: '@cword(2, 10)',
                option: '@word(2, 10)'
            }
        ]
    });
});
