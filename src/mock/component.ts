import {mock} from 'mockjs';
import {ParamsOptionType} from '@/types/component';

export const directoryListMock = mock({
    'data|3-10': [
        {
            'categoryId|+1': 1,
            'categoryName': '@ctitle(4, 10)',
            'categoryIndex|+1': 1,
            'types|0-10': [
                {
                    'typeId|+1': 1000,
                    'categoryId|+1': 1,
                    'typeName': '@ctitle',
                    'typeIndex|+1': 1
                }
            ]
        }
    ]
});

export const componentListMock = () => mock({
    'data|3-10': [
        {
            'typeId|+1': 1,
            'componentId|+1': 1,
            'componentVersionId|+1': 1,
            'componentName': '@title',
            'componentDesc': '@cparagraph',
            'versionDesc': '@cparagraph',
            'scope': '@pick(public, private, group)',
            'componentGroup': [''],
            'status': '@pick(init, check, reject, online, offline)',
            'creator': '@name',
            'editor': '@name',
            'createTime': '@date',
            'updateTime': '@date',
            'mergeable': true,
            'jobType': '@word'
        }
    ]
});

export const componentDetailMock = mock({
    'typeId|+1': 1,
    'componentId|+1': 1,
    'componentVersionId|+1': 1,
    'componentName': '@title',
    'componentDesc': '@cparagraph',
    'versionDesc': '@cparagraph',
    'scope': '@pick(public, private, group)',
    'componentGroup': [''],
    'status': '@pick(init, check, reject, online, offline)',
    'creator': '@name',
    'editor': '@name',
    'createTime': '@datetime',
    'updateTime': '@datetime',
    'mergeable': true,
    'jobType': '@word'
});

export const categoryListMock = mock({
    'data|3-10': [
        {
            'componentId|+1': 1,
            'tabId|+1': 1,
            'tabName': '@ctitle(4, 10)',
            'tabIndex|+1': 1
        }
    ]
});

export const paramsListMock = () => {
    return mock({
        'data|3-10': [
            {
                'paramDefId|+1': 1,
                'tabId|+1': 1,
                'label': '@ctitle(3, 10)',
                'paramName': '@word(3, 10)',
                'dataType': 'string',
                'paramType': '@pick(input, textarea, counter, select, radio, checkbox, switch, datepicker, label, ide)',
                'defaultValue': '@word',
                'required': '@boolean',
                'min': '@number',
                'max': '@number',
                'tooltip': '@ctitle',
                'options': ''
            }
        ]
    });
};


// 查询指定category下的组件Type列表
// /mlapi/cmpt/type
// http://a.sankuai.com/projects/edit/8fc5326c-c0d9-4823-933e-6ba7ef609fe9?apiId=e0251c0c-0469-4a02-b96a-ed5ac5ab26f8
export const categoryCompListMock = () => mock({
    'data|3-10': [
        {
            // 组件二级目录type Id
            'typeId': '@id',
            // 所属一级目录category Id
            'categoryId': '@id',
            // type name: 用于展示
            'typeName': '@word',
            // type index: 用于排序
            'typeIndex|+1': 0
        }
    ]
});

// 查询指定type下的组件列表
// /mlapi/cmpt/component
// http://a.sankuai.com/projects/edit/8fc5326c-c0d9-4823-933e-6ba7ef609fe9?apiId=7fb0c7e6-d2f7-45fe-9803-f5ce9b93f074
export const typeCompListMock = () => mock({
    'data|3-10': [
        {
            'typeId': '@id',
            'componentId': '@id',
            'componentVersionId': '@id',
            'componentName': '@word',
            // # 组件描述
            'componentDesc': '@word',
            // # 版本描述
            'versionDesc': '@csentence(10, 50)',
            // # 适用范围
            'scope': '@word',
            // # 适用项目组：当scope=wxproject
            'componentGroup|1-3': ['@word'],
            'creator': '@cname',
            'editor': '@cname',
            'createTime': '@date',
            'updateTime': '@date',
            // # 组件是否可合并执行
            'mergeable|1-2': true,
            // # 可合并执行的任务类型
            'jobType': '@word'
        }
    ]
});

// 获取组件参数Tab
// /mlapi/cmpt/component/{componentId}/param-tab
// http://a.sankuai.com/projects/edit/8fc5326c-c0d9-4823-933e-6ba7ef609fe9?apiId=376aac6a-23fc-4ef2-b5fa-12cc947059ba

export const compParamsTabMock = () => mock({
    'data|3-10': [
        {
            'paremDef|1-200': 200,
            // # 参数tab Id
            'tabId': '@id',
            // # 用于展示
            'label': '@ctitle',
            // # 用于内部使用，只能是字母、_的组合
            'paramName': '@title',
            // # 数据格式
            'dataType': '@word',
            // # 渲染方式
            'paramType': '@word',
            // # 默认值
            'defaultValue': '@cword',
            // # 是否必须
            'required|1-2': true,
            // # 数值类型使用：最小值
            'min|1-100.1-5': 100,
            // # 数值类型使用：最大值
            'max|1-100.1-5': 100,
            // # tab、selector、radio等使用：提供可选项
            'options|1-10': [
                {
                    label: '@word',
                    value: '@word'
                }
            ],
            // # 提示信息
            'tooltip': '@cparagraph'
        }
    ]
});

export const paramsSortMock = () => mock({
    'data|5-10': [
        {
            name: '@ctitle',
            id: '@id'
        }
    ]
});


// 获取组件输入输出
// /mlapi/cmpt/component/{componentId}/slot-def
// http://a.sankuai.com/projects/edit/8fc5326c-c0d9-4823-933e-6ba7ef609fe9?apiId=69798fbf-f544-400a-9477-8052326d18fc
export const ioListMock = () => mock({
    'data|3-10': [
        {
            'slotDefId': '@id',
            'componentId': '@id',
            'componentVersionId': '@id',
            // # 槽位名称
            'slotName': '@word',
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
