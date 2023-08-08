export const data = {
  nodes: [
    {
      id: 22,
      lobId: 27,
      dataDomainName: '交易',
      description: '配送订单交易数据',
      tableCnt: 15,
      hierarchy: 0,
      bizProcessGraph: {
        nodeList: [
          {
            id: 114,
            lobId: 27,
            parentId: 22,
            processName: '订单下单',
            description: '',
            tableCnt: 12,
            hierarchy: 0
          },
          {
            id: 218,
            lobId: 27,
            parentId: 22,
            processName: '骑手商城下单',
            description: '',
            tableCnt: 1,
            hierarchy: 0
          },
          {
            id: 127,
            lobId: 27,
            parentId: 22,
            processName: '订单支付',
            description: '',
            tableCnt: 9,
            hierarchy: 1
          },
          {
            id: 129,
            lobId: 27,
            parentId: 22,
            processName: '订单退款',
            description: '',
            tableCnt: 6,
            hierarchy: 2
          },
          {
            id: 167,
            lobId: 27,
            parentId: 22,
            processName: '商家接单',
            description: '',
            tableCnt: 0,
            hierarchy: 2
          },
          {
            id: 166,
            lobId: 27,
            parentId: 22,
            processName: '商家推单',
            description: '',
            tableCnt: 0,
            hierarchy: 3
          },
          {
            id: 128,
            lobId: 27,
            parentId: 22,
            processName: '订单完成',
            description: '',
            tableCnt: 9,
            hierarchy: 4
          },
          {
            id: 168,
            lobId: 27,
            parentId: 22,
            processName: '订单取消',
            description: '',
            tableCnt: 0,
            hierarchy: 4
          }
        ],
        edgeList: [
          {
            preNodeId: 114,
            postNodeId: 168,
            edgeType: 2,
            fromNodeId: 114,
            toNodeId: 168
          },
          {
            preNodeId: 114,
            postNodeId: 127,
            edgeType: 2,
            fromNodeId: 114,
            toNodeId: 127
          },
          {
            preNodeId: 127,
            postNodeId: 128,
            edgeType: 2,
            fromNodeId: 127,
            toNodeId: 128
          },
          {
            preNodeId: 127,
            postNodeId: 129,
            edgeType: 2,
            fromNodeId: 127,
            toNodeId: 129
          },
          {
            preNodeId: 127,
            postNodeId: 167,
            edgeType: 2,
            fromNodeId: 127,
            toNodeId: 167
          },
          {
            preNodeId: 127,
            postNodeId: 168,
            edgeType: 2,
            fromNodeId: 127,
            toNodeId: 168
          },
          {
            preNodeId: 167,
            postNodeId: 128,
            edgeType: 2,
            fromNodeId: 167,
            toNodeId: 128
          },
          {
            preNodeId: 167,
            postNodeId: 166,
            edgeType: 2,
            fromNodeId: 167,
            toNodeId: 166
          },
          {
            preNodeId: 167,
            postNodeId: 168,
            edgeType: 2,
            fromNodeId: 167,
            toNodeId: 168
          },
          {
            preNodeId: 166,
            postNodeId: 128,
            edgeType: 2,
            fromNodeId: 166,
            toNodeId: 128
          },
          {
            preNodeId: 166,
            postNodeId: 168,
            edgeType: 2,
            fromNodeId: 166,
            toNodeId: 168
          }
        ]
      },
      collapsed: true,
      type: 'group',
      x: -710.75,
      y: -4554.6953125,
      width: 180,
      height: 40
    },
    {
      id: 24,
      lobId: 27,
      dataDomainName: '待治理模型',
      description: '所有需要治理的模型',
      tableCnt: 59,
      hierarchy: 0,
      bizProcessGraph: {
        nodeList: [
          {
            id: 228,
            lobId: 27,
            parentId: 24,
            processName: '快照表',
            description: '',
            tableCnt: 53,
            hierarchy: 0
          },
          {
            id: 229,
            lobId: 27,
            parentId: 24,
            processName: '临时表',
            description: '',
            tableCnt: 2,
            hierarchy: 0
          },
          {
            id: 230,
            lobId: 27,
            parentId: 24,
            processName: '应用表',
            description: '',
            tableCnt: 8,
            hierarchy: 0
          }
        ],
        edgeList: []
      },
      collapsed: true,
      type: 'group',
      x: -710.75,
      y: -4464.6953125,
      width: 180,
      height: 40
    },
    {
      id: 27,
      lobId: 27,
      dataDomainName: '商品',
      description: '目前主要包括商城商品的各项信息，暂不包括外卖供应链商品信息',
      tableCnt: 1,
      hierarchy: 0,
      bizProcessGraph: {
        nodeList: [
          {
            id: 220,
            lobId: 27,
            parentId: 27,
            processName: '商品SPU在架',
            description: '',
            tableCnt: 0,
            hierarchy: 0
          },
          {
            id: 221,
            lobId: 27,
            parentId: 27,
            processName: '商品SKU在架',
            description: '',
            tableCnt: 1,
            hierarchy: 0
          },
          {
            id: 222,
            lobId: 27,
            parentId: 27,
            processName: '商品库存',
            description: '',
            tableCnt: 0,
            hierarchy: 0
          }
        ],
        edgeList: []
      },
      collapsed: true,
      type: 'group',
      x: -710.75,
      y: -4374.6953125,
      width: 180,
      height: 40
    },
    {
      id: 30,
      lobId: 27,
      dataDomainName: '用户行为',
      description:
        '记录用户访问行为的数据即流量数据，用户行为数据目前通过埋点来上报，一条上报数据是用户的一次浏览访问和操作，例如用户进入了某个页面、看到了什么模块、点击了什么按钮，这些都分别是一次用户行为，分别产生一次上报。',
      tableCnt: 31,
      hierarchy: 0,
      bizProcessGraph: {
        nodeList: [
          {
            id: 165,
            lobId: 27,
            parentId: 30,
            processName: '流量访问',
            description:
              '记录用户行为的数据即流量数据，用户行为数据通过埋点来上报。一条上报数据是用户一次操作行为，例如用户进入了某个页面、看到了什么模块、点击了什么按钮',
            tableCnt: 28,
            hierarchy: 0
          },
          {
            id: 140,
            lobId: 27,
            parentId: 30,
            processName: '流量挂单',
            description: '把用户的访问行为和下单行为建立起联系',
            tableCnt: 4,
            hierarchy: 1
          }
        ],
        edgeList: [
          {
            preNodeId: 165,
            postNodeId: 140,
            edgeType: 2,
            fromNodeId: 165,
            toNodeId: 140
          }
        ]
      },
      collapsed: true,
      type: 'group',
      x: -710.75,
      y: -4284.6953125,
      width: 180,
      height: 40
    },
    {
      id: 34,
      lobId: 27,
      dataDomainName: '售后',
      description: '主要覆盖售后服务相关的业务流程，例如:投诉、评价',
      tableCnt: 8,
      hierarchy: 0,
      bizProcessGraph: {
        nodeList: [
          {
            id: 184,
            lobId: 27,
            parentId: 34,
            processName: '用户评价',
            description: '顾客对骑手、商家的评价',
            tableCnt: 0,
            hierarchy: 0
          },
          {
            id: 185,
            lobId: 27,
            parentId: 34,
            processName: '商家评价',
            description: '商家对顾客、骑手的评价',
            tableCnt: 2,
            hierarchy: 0
          },
          {
            id: 186,
            lobId: 27,
            parentId: 34,
            processName: '骑手评价',
            description: '骑手对商家、顾客的评价',
            tableCnt: 4,
            hierarchy: 0
          },
          {
            id: 197,
            lobId: 27,
            parentId: 34,
            processName: '用户投诉',
            description: '用户对商家、顾客的评价',
            tableCnt: 2,
            hierarchy: 0
          },
          {
            id: 198,
            lobId: 27,
            parentId: 34,
            processName: '骑手投诉',
            description: '骑手的投诉',
            tableCnt: 2,
            hierarchy: 0
          },
          {
            id: 199,
            lobId: 27,
            parentId: 34,
            processName: '商家投诉',
            description: '商家的投诉',
            tableCnt: 0,
            hierarchy: 0
          }
        ],
        edgeList: []
      },
      collapsed: true,
      type: 'group',
      x: -710.75,
      y: -4194.6953125,
      width: 180,
      height: 40
    },
    {
      id: 35,
      lobId: 27,
      dataDomainName: '履约管控',
      description: '主要覆盖履约过程中的违规判责、判罚相关业务过程',
      tableCnt: 58,
      hierarchy: 0,
      bizProcessGraph: {
        nodeList: [
          {
            id: 155,
            lobId: 27,
            parentId: 35,
            processName: '违规判责',
            description: '',
            tableCnt: 45,
            hierarchy: 0
          },
          {
            id: 247,
            lobId: 27,
            parentId: 35,
            processName: '餐损判责完成',
            description: '',
            tableCnt: 3,
            hierarchy: 0
          },
          {
            id: 143,
            lobId: 27,
            parentId: 35,
            processName: '违规处罚',
            description: '针对违规项进行处罚',
            tableCnt: 18,
            hierarchy: 1
          },
          {
            id: 156,
            lobId: 27,
            parentId: 35,
            processName: '违规申诉',
            description: '',
            tableCnt: 25,
            hierarchy: 2
          }
        ],
        edgeList: [
          {
            preNodeId: 155,
            postNodeId: 143,
            edgeType: 2,
            fromNodeId: 155,
            toNodeId: 143
          },
          {
            preNodeId: 143,
            postNodeId: 156,
            edgeType: 2,
            fromNodeId: 143,
            toNodeId: 156
          }
        ]
      },
      collapsed: true,
      type: 'group',
      x: -710.75,
      y: -4104.6953125,
      width: 180,
      height: 40
    },
    {
      id: 37,
      lobId: 27,
      dataDomainName: 'AOI兴趣面',
      description:
        'AOI（ Area of Interest）：按照社会功能定位，在地图上将区域划定为一个个兴趣面（AOI），它可以是一个小区、一个学校、一个shopping mall 或者我们的办公区恒电ABC这个园区，AOI有名称、类别和边框信息。',
      tableCnt: 1,
      hierarchy: 0,
      bizProcessGraph: {
        nodeList: [
          {
            id: 119,
            lobId: 27,
            parentId: 37,
            processName: 'aoi选定',
            description: 'aoi相关信息',
            tableCnt: 1,
            hierarchy: 0
          }
        ],
        edgeList: []
      },
      collapsed: true,
      type: 'group',
      x: -710.75,
      y: -4014.6953125,
      width: 180,
      height: 40
    },
    {
      id: 43,
      lobId: 27,
      dataDomainName: '运力运营',
      description: '对骑手进行运营相关的业务过程数据',
      tableCnt: 185,
      hierarchy: 0,
      bizProcessGraph: {
        nodeList: [
          {
            id: 172,
            lobId: 27,
            parentId: 43,
            processName: '骑手招募',
            description: '',
            tableCnt: 24,
            hierarchy: 0
          },
          {
            id: 191,
            lobId: 27,
            parentId: 43,
            processName: '骑手排班(废弃)',
            description: '骑手排班',
            tableCnt: 13,
            hierarchy: 0
          },
          {
            id: 252,
            lobId: 27,
            parentId: 43,
            processName: '骑手报备',
            description: '',
            tableCnt: 0,
            hierarchy: 0
          },
          {
            id: 253,
            lobId: 27,
            parentId: 43,
            processName: '骑手异常上报',
            description: '',
            tableCnt: 1,
            hierarchy: 0
          },
          {
            id: 120,
            lobId: 27,
            parentId: 43,
            processName: '骑手入职',
            description: '',
            tableCnt: 13,
            hierarchy: 1
          },
          {
            id: 131,
            lobId: 27,
            parentId: 43,
            processName: '骑手拉新邀请',
            description: '',
            tableCnt: 23,
            hierarchy: 1
          },
          {
            id: 173,
            lobId: 27,
            parentId: 43,
            processName: '骑手注册',
            description: '',
            tableCnt: 8,
            hierarchy: 1
          },
          {
            id: 174,
            lobId: 27,
            parentId: 43,
            processName: '骑手在职',
            description: '',
            tableCnt: 35,
            hierarchy: 2
          },
          {
            id: 175,
            lobId: 27,
            parentId: 43,
            processName: '骑手在岗',
            description:
              '骑手工作期间的有单、工作模式、速度、距离等相关信息的描述和刻画',
            tableCnt: 19,
            hierarchy: 2
          },
          {
            id: 240,
            lobId: 27,
            parentId: 43,
            processName: '骑手等级',
            description: '',
            tableCnt: 29,
            hierarchy: 2
          },
          {
            id: 122,
            lobId: 27,
            parentId: 43,
            processName: '骑手装备',
            description: '',
            tableCnt: 10,
            hierarchy: 3
          },
          {
            id: 130,
            lobId: 27,
            parentId: 43,
            processName: '骑手勋章发放',
            description: '',
            tableCnt: 12,
            hierarchy: 3
          },
          {
            id: 176,
            lobId: 27,
            parentId: 43,
            processName: '骑手培训',
            description: '',
            tableCnt: 6,
            hierarchy: 3
          },
          {
            id: 177,
            lobId: 27,
            parentId: 43,
            processName: '骑手评级',
            description: '',
            tableCnt: 19,
            hierarchy: 3
          },
          {
            id: 178,
            lobId: 27,
            parentId: 43,
            processName: '运力报名(已废弃)',
            description: '',
            tableCnt: 14,
            hierarchy: 3
          },
          {
            id: 216,
            lobId: 27,
            parentId: 43,
            processName: '骑手绑定分配站点',
            description: 'https://km.sankuai.com/page/189998191',
            tableCnt: 3,
            hierarchy: 3
          },
          {
            id: 231,
            lobId: 27,
            parentId: 43,
            processName: '骑手工单',
            description: '骑手与客服沟通时产生的工单相关数据信息',
            tableCnt: 3,
            hierarchy: 3
          },
          {
            id: 232,
            lobId: 27,
            parentId: 43,
            processName: '骑手站长运营',
            description: '站长日常对骑手的运营动作过程',
            tableCnt: 4,
            hierarchy: 3
          },
          {
            id: 233,
            lobId: 27,
            parentId: 43,
            processName: '骑手问卷',
            description: '骑手问卷及问卷回复相关的过程信息',
            tableCnt: 3,
            hierarchy: 3
          },
          {
            id: 179,
            lobId: 27,
            parentId: 43,
            processName: '运力签约(已废弃)',
            description: '',
            tableCnt: 5,
            hierarchy: 4
          },
          {
            id: 235,
            lobId: 27,
            parentId: 43,
            processName: '骑手离职',
            description: '',
            tableCnt: 4,
            hierarchy: 4
          }
        ],
        edgeList: [
          {
            preNodeId: 172,
            postNodeId: 131,
            edgeType: 2,
            fromNodeId: 172,
            toNodeId: 131
          },
          {
            preNodeId: 172,
            postNodeId: 173,
            edgeType: 2,
            fromNodeId: 172,
            toNodeId: 173
          },
          {
            preNodeId: 172,
            postNodeId: 120,
            edgeType: 2,
            fromNodeId: 172,
            toNodeId: 120
          },
          {
            preNodeId: 120,
            postNodeId: 174,
            edgeType: 2,
            fromNodeId: 120,
            toNodeId: 174
          },
          {
            preNodeId: 120,
            postNodeId: 175,
            edgeType: 2,
            fromNodeId: 120,
            toNodeId: 175
          },
          {
            preNodeId: 120,
            postNodeId: 240,
            edgeType: 2,
            fromNodeId: 120,
            toNodeId: 240
          },
          {
            preNodeId: 174,
            postNodeId: 130,
            edgeType: 2,
            fromNodeId: 174,
            toNodeId: 130
          },
          {
            preNodeId: 174,
            postNodeId: 178,
            edgeType: 2,
            fromNodeId: 174,
            toNodeId: 178
          },
          {
            preNodeId: 174,
            postNodeId: 216,
            edgeType: 2,
            fromNodeId: 174,
            toNodeId: 216
          },
          {
            preNodeId: 174,
            postNodeId: 232,
            edgeType: 2,
            fromNodeId: 174,
            toNodeId: 232
          },
          {
            preNodeId: 174,
            postNodeId: 235,
            edgeType: 2,
            fromNodeId: 174,
            toNodeId: 235
          },
          {
            preNodeId: 175,
            postNodeId: 176,
            edgeType: 2,
            fromNodeId: 175,
            toNodeId: 176
          },
          {
            preNodeId: 175,
            postNodeId: 177,
            edgeType: 2,
            fromNodeId: 175,
            toNodeId: 177
          },
          {
            preNodeId: 175,
            postNodeId: 231,
            edgeType: 2,
            fromNodeId: 175,
            toNodeId: 231
          },
          {
            preNodeId: 175,
            postNodeId: 233,
            edgeType: 2,
            fromNodeId: 175,
            toNodeId: 233
          },
          {
            preNodeId: 175,
            postNodeId: 235,
            edgeType: 2,
            fromNodeId: 175,
            toNodeId: 235
          },
          {
            preNodeId: 175,
            postNodeId: 122,
            edgeType: 2,
            fromNodeId: 175,
            toNodeId: 122
          },
          {
            preNodeId: 122,
            postNodeId: 235,
            edgeType: 2,
            fromNodeId: 122,
            toNodeId: 235
          },
          {
            preNodeId: 176,
            postNodeId: 235,
            edgeType: 2,
            fromNodeId: 176,
            toNodeId: 235
          },
          {
            preNodeId: 177,
            postNodeId: 235,
            edgeType: 2,
            fromNodeId: 177,
            toNodeId: 235
          },
          {
            preNodeId: 178,
            postNodeId: 179,
            edgeType: 2,
            fromNodeId: 178,
            toNodeId: 179
          },
          {
            preNodeId: 231,
            postNodeId: 235,
            edgeType: 2,
            fromNodeId: 231,
            toNodeId: 235
          },
          {
            preNodeId: 233,
            postNodeId: 235,
            edgeType: 2,
            fromNodeId: 233,
            toNodeId: 235
          }
        ]
      },
      collapsed: true,
      type: 'group',
      x: -710.75,
      y: -3924.6953125,
      width: 180,
      height: 40
    },
    {
      id: 44,
      lobId: 27,
      dataDomainName: '销售',
      description: '配送销售相关的线索、商机、拜访等业务过程信息',
      tableCnt: 12,
      hierarchy: 0,
      bizProcessGraph: {
        nodeList: [
          {
            id: 245,
            lobId: 27,
            parentId: 44,
            processName: '线索',
            description: '',
            tableCnt: 5,
            hierarchy: 0
          },
          {
            id: 246,
            lobId: 27,
            parentId: 44,
            processName: '拜访',
            description: '',
            tableCnt: 3,
            hierarchy: 0
          },
          {
            id: 248,
            lobId: 27,
            parentId: 44,
            processName: '商机',
            description: '',
            tableCnt: 0,
            hierarchy: 0
          },
          {
            id: 251,
            lobId: 27,
            parentId: 44,
            processName: '预客户',
            description: '',
            tableCnt: 4,
            hierarchy: 0
          }
        ],
        edgeList: []
      },
      collapsed: true,
      type: 'group',
      x: -710.75,
      y: -3834.6953125,
      width: 180,
      height: 40
    },
    {
      id: 47,
      lobId: 27,
      dataDomainName: '调度',
      description: '主要关注调度的具体过程，例如合包、压单、改派、转单',
      tableCnt: 13,
      hierarchy: 0,
      bizProcessGraph: {
        nodeList: [
          {
            id: 144,
            lobId: 27,
            parentId: 47,
            processName: '压单',
            description: '',
            tableCnt: 3,
            hierarchy: 0
          },
          {
            id: 145,
            lobId: 27,
            parentId: 47,
            processName: '改派',
            description: '',
            tableCnt: 1,
            hierarchy: 0
          },
          {
            id: 146,
            lobId: 27,
            parentId: 47,
            processName: '转单',
            description: '',
            tableCnt: 2,
            hierarchy: 0
          },
          {
            id: 147,
            lobId: 27,
            parentId: 47,
            processName: '合包',
            description: '',
            tableCnt: 1,
            hierarchy: 0
          },
          {
            id: 157,
            lobId: 27,
            parentId: 47,
            processName: '时间配置',
            description: '',
            tableCnt: 8,
            hierarchy: 0
          },
          {
            id: 159,
            lobId: 27,
            parentId: 47,
            processName: '调度策略',
            description: '',
            tableCnt: 2,
            hierarchy: 0
          },
          {
            id: 160,
            lobId: 27,
            parentId: 47,
            processName: '驻点调度',
            description: '',
            tableCnt: 2,
            hierarchy: 0
          }
        ],
        edgeList: []
      },
      collapsed: true,
      type: 'group',
      x: -710.75,
      y: -3744.6953125,
      width: 180,
      height: 40
    },
    {
      id: 49,
      lobId: 27,
      dataDomainName: '配送区域',
      description: '承载配送服务的最小地理范围，涉及区域划分等业务数据',
      tableCnt: 13,
      hierarchy: 0,
      bizProcessGraph: {
        nodeList: [
          {
            id: 192,
            lobId: 27,
            parentId: 49,
            processName: '配送区域划分',
            description: '',
            tableCnt: 13,
            hierarchy: 0
          },
          {
            id: 236,
            lobId: 27,
            parentId: 49,
            processName: '站点绑定区域',
            description:
              '配送站根据业务类型绑定对应的配送区域，一个站点只能绑定一个配送区域，一个配送区域可以有多个站点(一区多站)',
            tableCnt: 0,
            hierarchy: 1
          }
        ],
        edgeList: [
          {
            preNodeId: 192,
            postNodeId: 236,
            edgeType: 2,
            fromNodeId: 192,
            toNodeId: 236
          }
        ]
      },
      collapsed: true,
      type: 'group',
      x: -710.75,
      y: -3654.6953125,
      width: 180,
      height: 40
    },
    {
      id: 50,
      lobId: 27,
      dataDomainName: '天气',
      description: '包括配送区域、城市的天气数据',
      tableCnt: 15,
      hierarchy: 0,
      bizProcessGraph: {
        nodeList: [
          {
            id: 142,
            lobId: 27,
            parentId: 50,
            processName: '天气',
            description: '',
            tableCnt: 15,
            hierarchy: 0
          }
        ],
        edgeList: []
      },
      collapsed: true,
      type: 'group',
      x: -710.75,
      y: -3564.6953125,
      width: 180,
      height: 40
    },
    {
      id: 52,
      lobId: 27,
      dataDomainName: '运力管控',
      description: '对骑手进行管理约束的相关业务操作过程数据',
      tableCnt: 51,
      hierarchy: 0,
      bizProcessGraph: {
        nodeList: [
          {
            id: 121,
            lobId: 27,
            parentId: 52,
            processName: '骑手抽检',
            description:
              '骑手开工跑单业务过程中，对骑手进行是否本人、装备情况进行抽查',
            tableCnt: 8,
            hierarchy: 0
          },
          {
            id: 181,
            lobId: 27,
            parentId: 52,
            processName: '骑手开收工',
            description: '',
            tableCnt: 0,
            hierarchy: 0
          },
          {
            id: 182,
            lobId: 27,
            parentId: 52,
            processName: '骑手忙碌',
            description: '',
            tableCnt: 1,
            hierarchy: 0
          },
          {
            id: 183,
            lobId: 27,
            parentId: 52,
            processName: '骑手拉黑',
            description: '',
            tableCnt: 8,
            hierarchy: 0
          },
          {
            id: 217,
            lobId: 27,
            parentId: 52,
            processName: '骑手排班',
            description: '骑手排班',
            tableCnt: 6,
            hierarchy: 0
          },
          {
            id: 223,
            lobId: 27,
            parentId: 52,
            processName: '安全理赔',
            description: '',
            tableCnt: 0,
            hierarchy: 0
          },
          {
            id: 224,
            lobId: 27,
            parentId: 52,
            processName: '安全事故',
            description: '',
            tableCnt: 7,
            hierarchy: 0
          },
          {
            id: 225,
            lobId: 27,
            parentId: 52,
            processName: '安全管控',
            description: '',
            tableCnt: 3,
            hierarchy: 0
          },
          {
            id: 180,
            lobId: 27,
            parentId: 52,
            processName: '骑手出勤',
            description: '骑手出勤',
            tableCnt: 24,
            hierarchy: 1
          }
        ],
        edgeList: [
          {
            preNodeId: 217,
            postNodeId: 180,
            edgeType: 2,
            fromNodeId: 217,
            toNodeId: 180
          }
        ]
      },
      collapsed: true,
      type: 'group',
      x: -710.75,
      y: -3474.6953125,
      width: 180,
      height: 40
    },
    {
      id: 56,
      lobId: 27,
      dataDomainName: '站点组织',
      description: '站点、城市相关数据',
      tableCnt: 13,
      hierarchy: 0,
      bizProcessGraph: {
        nodeList: [
          {
            id: 241,
            lobId: 27,
            parentId: 56,
            processName: '站点状态',
            description: '',
            tableCnt: 11,
            hierarchy: 0
          },
          {
            id: 242,
            lobId: 27,
            parentId: 56,
            processName: '城市状态',
            description: '',
            tableCnt: 2,
            hierarchy: 0
          },
          {
            id: 255,
            lobId: 27,
            parentId: 56,
            processName: '站点早会',
            description: '站点早会的管理，涉及消毒环节和骑手形象装备',
            tableCnt: 1,
            hierarchy: 0
          }
        ],
        edgeList: []
      },
      collapsed: true,
      type: 'group',
      x: -710.75,
      y: -3384.6953125,
      width: 180,
      height: 40
    },
    {
      id: 57,
      lobId: 27,
      dataDomainName: 'IOT',
      description: '包含取餐柜、智能头盔、充电等配送基础设施',
      tableCnt: 79,
      hierarchy: 0,
      bizProcessGraph: {
        nodeList: [
          {
            id: 115,
            lobId: 27,
            parentId: 57,
            processName: '外卖柜点位提报',
            description: '外卖柜点位申请',
            tableCnt: 0,
            hierarchy: 0
          },
          {
            id: 116,
            lobId: 27,
            parentId: 57,
            processName: '外卖柜点位审核',
            description: '外卖柜点位审核',
            tableCnt: 0,
            hierarchy: 0
          },
          {
            id: 117,
            lobId: 27,
            parentId: 57,
            processName: '外卖柜点位发货',
            description: '外卖柜点位发货',
            tableCnt: 0,
            hierarchy: 0
          },
          {
            id: 118,
            lobId: 27,
            parentId: 57,
            processName: '外卖柜点位上线',
            description: '外卖柜点位上线',
            tableCnt: 0,
            hierarchy: 0
          },
          {
            id: 141,
            lobId: 27,
            parentId: 57,
            processName: '智能硬件',
            description: '',
            tableCnt: 35,
            hierarchy: 0
          },
          {
            id: 261,
            lobId: 27,
            parentId: 57,
            processName: '外卖柜用户取餐',
            description: '外卖柜用户取餐',
            tableCnt: 6,
            hierarchy: 0
          },
          {
            id: 349,
            lobId: 27,
            parentId: 57,
            processName: '外卖柜订单售后',
            description: '外卖柜订单售后，赔付和客诉记录',
            tableCnt: 3,
            hierarchy: 0
          },
          {
            id: 354,
            lobId: 27,
            parentId: 57,
            processName: '外卖柜骑手存餐',
            description: '',
            tableCnt: 6,
            hierarchy: 0
          },
          {
            id: 357,
            lobId: 27,
            parentId: 57,
            processName: '智能头盔蓝牙周期上报',
            description: 'IoT头盔实时数据-蓝牙周期上报数据',
            tableCnt: 0,
            hierarchy: 0
          },
          {
            id: 358,
            lobId: 27,
            parentId: 57,
            processName: '智能头盔蓝牙实时上报',
            description: 'IoT头盔实时数据-蓝牙实时上报数据',
            tableCnt: 0,
            hierarchy: 0
          },
          {
            id: 359,
            lobId: 27,
            parentId: 57,
            processName: 'SIM卡当前状态周期上报',
            description: 'IoT头盔实时数据-SIM(NB)卡当前状态周期上报数据',
            tableCnt: 0,
            hierarchy: 0
          },
          {
            id: 360,
            lobId: 27,
            parentId: 57,
            processName: '智能头盔SIM卡事件上报',
            description: 'IoT头盔实时数据-SIM(NB)卡事件上报数据',
            tableCnt: 0,
            hierarchy: 0
          },
          {
            id: 361,
            lobId: 27,
            parentId: 57,
            processName: '智能头盔SIM卡戴盔计算结果上报',
            description: 'IoT头盔实时数据-SIM(NB)卡戴盔计算结果上报数据',
            tableCnt: 0,
            hierarchy: 0
          },
          {
            id: 362,
            lobId: 27,
            parentId: 57,
            processName: '出餐宝订单出餐',
            description:
              '出餐宝订单出餐，记录与出餐宝相关的门店、设备、订单数据',
            tableCnt: 6,
            hierarchy: 0
          },
          {
            id: 377,
            lobId: 27,
            parentId: 57,
            processName: '换电柜',
            description: '智能硬件-换电柜',
            tableCnt: 17,
            hierarchy: 0
          },
          {
            id: 378,
            lobId: 27,
            parentId: 57,
            processName: '出餐宝设备出库',
            description: '出餐宝设备出库',
            tableCnt: 0,
            hierarchy: 0
          },
          {
            id: 443,
            lobId: 27,
            parentId: 57,
            processName: '外卖柜销售',
            description: '外卖柜销售业务过层',
            tableCnt: 1,
            hierarchy: 0
          },
          {
            id: 250,
            lobId: 27,
            parentId: 57,
            processName: '取餐柜',
            description: '',
            tableCnt: 8,
            hierarchy: 1
          }
        ],
        edgeList: [
          {
            preNodeId: 141,
            postNodeId: 250,
            edgeType: 2,
            fromNodeId: 141,
            toNodeId: 250
          }
        ]
      },
      collapsed: true,
      type: 'group',
      x: -710.75,
      y: -3294.6953125,
      width: 180,
      height: 40
    },
    {
      id: 61,
      lobId: 27,
      dataDomainName: '爆单',
      description:
        '爆单作为一种平衡供需关系的工具，旨在于解决用户需求大于骑手配送 能力或商家出餐能力情形下的用户配送体验问题。 爆单主要应对的情况有：恶劣天气、交通管制、高峰时段、区域其他运力不足、商家出餐慢等。',
      tableCnt: 29,
      hierarchy: 0,
      bizProcessGraph: {
        nodeList: [
          {
            id: 139,
            lobId: 27,
            parentId: 61,
            processName: '爆单',
            description: '',
            tableCnt: 18,
            hierarchy: 0
          },
          {
            id: 163,
            lobId: 27,
            parentId: 61,
            processName: '爆单配置',
            description: '',
            tableCnt: 4,
            hierarchy: 1
          },
          {
            id: 164,
            lobId: 27,
            parentId: 61,
            processName: '爆单动作',
            description: '',
            tableCnt: 5,
            hierarchy: 2
          },
          {
            id: 169,
            lobId: 27,
            parentId: 61,
            processName: '爆单完成',
            description: '',
            tableCnt: 4,
            hierarchy: 3
          }
        ],
        edgeList: [
          {
            preNodeId: 139,
            postNodeId: 163,
            edgeType: 2,
            fromNodeId: 139,
            toNodeId: 163
          },
          {
            preNodeId: 163,
            postNodeId: 164,
            edgeType: 2,
            fromNodeId: 163,
            toNodeId: 164
          },
          {
            preNodeId: 164,
            postNodeId: 169,
            edgeType: 2,
            fromNodeId: 164,
            toNodeId: 169
          }
        ]
      },
      collapsed: true,
      type: 'group',
      x: -710.75,
      y: -3204.6953125,
      width: 180,
      height: 40
    },
    {
      id: 444,
      lobId: 27,
      dataDomainName: '定价',
      description: '制定合理的价格，促成配送服务以商品方式流通',
      tableCnt: 0,
      hierarchy: 0,
      bizProcessGraph: {
        nodeList: [
          {
            id: 445,
            lobId: 27,
            parentId: 444,
            processName: '定价方案配置',
            description: '定价方案相关规则配置',
            tableCnt: 0,
            hierarchy: 0
          }
        ],
        edgeList: []
      },
      collapsed: true,
      type: 'group',
      x: -710.75,
      y: 5857.8046875,
      width: 180,
      height: 40
    },
    {
      id: 114,
      lobId: 27,
      parentId: 22,
      processName: '订单下单',
      description: '',
      tableCnt: 12,
      hierarchy: 0,
      x: -650.75,
      y: -4397.1953125
    },
    {
      id: 115,
      lobId: 27,
      parentId: 57,
      processName: '外卖柜点位提报',
      description: '外卖柜点位申请',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -3234.6953125
    },
    {
      id: 116,
      lobId: 27,
      parentId: 57,
      processName: '外卖柜点位审核',
      description: '外卖柜点位审核',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -3144.6953125
    },
    {
      id: 117,
      lobId: 27,
      parentId: 57,
      processName: '外卖柜点位发货',
      description: '外卖柜点位发货',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -3054.6953125
    },
    {
      id: 118,
      lobId: 27,
      parentId: 57,
      processName: '外卖柜点位上线',
      description: '外卖柜点位上线',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -2964.6953125
    },
    {
      id: 119,
      lobId: 27,
      parentId: 37,
      processName: 'aoi选定',
      description: 'aoi相关信息',
      tableCnt: 1,
      hierarchy: 0,
      x: -650.75,
      y: -3954.6953125
    },
    {
      id: 120,
      lobId: 27,
      parentId: 43,
      processName: '骑手入职',
      description: '',
      tableCnt: 13,
      hierarchy: 1,
      x: -420.75,
      y: -3339.6953125
    },
    {
      id: 121,
      lobId: 27,
      parentId: 52,
      processName: '骑手抽检',
      description:
        '骑手开工跑单业务过程中，对骑手进行是否本人、装备情况进行抽查',
      tableCnt: 8,
      hierarchy: 0,
      x: -650.75,
      y: -3414.6953125
    },
    {
      id: 122,
      lobId: 27,
      parentId: 43,
      processName: '骑手装备',
      description: '',
      tableCnt: 10,
      hierarchy: 3,
      x: 39.25,
      y: -3104.6953125
    },
    {
      id: 123,
      lobId: 27,
      parentId: 3,
      processName: '配送客户入驻',
      description: '配送客户入驻',
      tableCnt: 5,
      hierarchy: 0,
      x: -650.75,
      y: -4809.6953125
    },
    {
      id: 124,
      lobId: 27,
      parentId: 16,
      processName: '承运单创建',
      description: '承运单创建',
      tableCnt: 6,
      hierarchy: 1,
      x: -420.75,
      y: -4234.6953125
    },
    {
      id: 125,
      lobId: 27,
      parentId: 3,
      processName: '商家属性',
      description: '商家属性',
      tableCnt: 20,
      hierarchy: 2,
      x: -190.75,
      y: -4764.6953125
    },
    {
      id: 126,
      lobId: 27,
      parentId: 16,
      processName: '承运单送达',
      description: '承运单送达',
      tableCnt: 7,
      hierarchy: 7,
      x: 959.25,
      y: -4117.1953125
    },
    {
      id: 127,
      lobId: 27,
      parentId: 22,
      processName: '订单支付',
      description: '',
      tableCnt: 9,
      hierarchy: 1,
      x: -420.75,
      y: -4359.6953125
    },
    {
      id: 128,
      lobId: 27,
      parentId: 22,
      processName: '订单完成',
      description: '',
      tableCnt: 9,
      hierarchy: 4,
      x: 269.25,
      y: -4494.6953125
    },
    {
      id: 129,
      lobId: 27,
      parentId: 22,
      processName: '订单退款',
      description: '',
      tableCnt: 6,
      hierarchy: 2,
      x: -190.75,
      y: -4432.1953125
    },
    {
      id: 130,
      lobId: 27,
      parentId: 43,
      processName: '骑手勋章发放',
      description: '',
      tableCnt: 12,
      hierarchy: 3,
      x: 39.25,
      y: -3864.6953125
    },
    {
      id: 131,
      lobId: 27,
      parentId: 43,
      processName: '骑手拉新邀请',
      description: '',
      tableCnt: 23,
      hierarchy: 1,
      x: -420.75,
      y: -3709.6953125
    },
    {
      id: 132,
      lobId: 27,
      parentId: 3,
      processName: '商家签约',
      description: '',
      tableCnt: 21,
      hierarchy: 0,
      x: -650.75,
      y: -4719.6953125
    },
    {
      id: 133,
      lobId: 27,
      parentId: 3,
      processName: '绑定配送区域',
      description: '',
      tableCnt: 14,
      hierarchy: 1,
      x: -420.75,
      y: -4944.6953125
    },
    {
      id: 134,
      lobId: 27,
      parentId: 3,
      processName: '签约配送服务',
      description: '',
      tableCnt: 6,
      hierarchy: 1,
      x: -420.75,
      y: -4854.6953125
    },
    {
      id: 135,
      lobId: 27,
      parentId: 7,
      processName: '外卖结算',
      description: '外卖结算数据',
      tableCnt: 9,
      hierarchy: 0,
      x: -650.75,
      y: -4764.6953125
    },
    {
      id: 136,
      lobId: 27,
      parentId: 7,
      processName: '运单结算',
      description: '到运单粒度的结算',
      tableCnt: 24,
      hierarchy: 2,
      x: -190.75,
      y: -4629.6953125
    },
    {
      id: 137,
      lobId: 27,
      parentId: 7,
      processName: '骑手结算',
      description: '',
      tableCnt: 35,
      hierarchy: 2,
      x: -190.75,
      y: -4359.6953125
    },
    {
      id: 138,
      lobId: 27,
      parentId: 7,
      processName: '站点结算',
      description: '',
      tableCnt: 15,
      hierarchy: 2,
      x: -190.75,
      y: -4449.6953125
    },
    {
      id: 139,
      lobId: 27,
      parentId: 61,
      processName: '爆单',
      description: '',
      tableCnt: 18,
      hierarchy: 0,
      x: -650.75,
      y: -3144.6953125
    },
    {
      id: 140,
      lobId: 27,
      parentId: 30,
      processName: '流量挂单',
      description: '把用户的访问行为和下单行为建立起联系',
      tableCnt: 4,
      hierarchy: 1,
      x: -420.75,
      y: -4224.6953125
    },
    {
      id: 141,
      lobId: 27,
      parentId: 57,
      processName: '智能硬件',
      description: '',
      tableCnt: 35,
      hierarchy: 0,
      x: -650.75,
      y: -2874.6953125
    },
    {
      id: 142,
      lobId: 27,
      parentId: 50,
      processName: '天气',
      description: '',
      tableCnt: 15,
      hierarchy: 0,
      x: -650.75,
      y: -3504.6953125
    },
    {
      id: 143,
      lobId: 27,
      parentId: 35,
      processName: '违规处罚',
      description: '针对违规项进行处罚',
      tableCnt: 18,
      hierarchy: 1,
      x: -420.75,
      y: -4044.6953125
    },
    {
      id: 144,
      lobId: 27,
      parentId: 47,
      processName: '压单',
      description: '',
      tableCnt: 3,
      hierarchy: 0,
      x: -650.75,
      y: -3684.6953125
    },
    {
      id: 145,
      lobId: 27,
      parentId: 47,
      processName: '改派',
      description: '',
      tableCnt: 1,
      hierarchy: 0,
      x: -650.75,
      y: -3594.6953125
    },
    {
      id: 146,
      lobId: 27,
      parentId: 47,
      processName: '转单',
      description: '',
      tableCnt: 2,
      hierarchy: 0,
      x: -650.75,
      y: -3504.6953125
    },
    {
      id: 147,
      lobId: 27,
      parentId: 47,
      processName: '合包',
      description: '',
      tableCnt: 1,
      hierarchy: 0,
      x: -650.75,
      y: -3414.6953125
    },
    {
      id: 148,
      lobId: 27,
      parentId: 7,
      processName: '保证金充值',
      description: '',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -4674.6953125
    },
    {
      id: 149,
      lobId: 27,
      parentId: 7,
      processName: '结算钱包',
      description: '',
      tableCnt: 6,
      hierarchy: 0,
      x: -650.75,
      y: -4584.6953125
    },
    {
      id: 150,
      lobId: 27,
      parentId: 7,
      processName: '薪资计算',
      description: '',
      tableCnt: 18,
      hierarchy: 3,
      x: 39.25,
      y: -4659.6953125
    },
    {
      id: 151,
      lobId: 27,
      parentId: 7,
      processName: '结算凭证',
      description: '',
      tableCnt: 9,
      hierarchy: 4,
      x: 269.25,
      y: -4549.6953125
    },
    {
      id: 152,
      lobId: 27,
      parentId: 7,
      processName: '结算账单',
      description: '',
      tableCnt: 34,
      hierarchy: 3,
      x: 39.25,
      y: -4549.6953125
    },
    {
      id: 153,
      lobId: 27,
      parentId: 7,
      processName: '结算对象',
      description: '',
      tableCnt: 9,
      hierarchy: 0,
      x: -650.75,
      y: -4494.6953125
    },
    {
      id: 154,
      lobId: 27,
      parentId: 7,
      processName: '收付款',
      description: '',
      tableCnt: 20,
      hierarchy: 4,
      x: 269.25,
      y: -4639.6953125
    },
    {
      id: 155,
      lobId: 27,
      parentId: 35,
      processName: '违规判责',
      description: '',
      tableCnt: 45,
      hierarchy: 0,
      x: -650.75,
      y: -4044.6953125
    },
    {
      id: 156,
      lobId: 27,
      parentId: 35,
      processName: '违规申诉',
      description: '',
      tableCnt: 25,
      hierarchy: 2,
      x: -190.75,
      y: -4044.6953125
    },
    {
      id: 157,
      lobId: 27,
      parentId: 47,
      processName: '时间配置',
      description: '',
      tableCnt: 8,
      hierarchy: 0,
      x: -650.75,
      y: -3324.6953125
    },
    {
      id: 158,
      lobId: 27,
      parentId: 3,
      processName: '商家基础信息',
      description: '',
      tableCnt: 29,
      hierarchy: 1,
      x: -420.75,
      y: -4764.6953125
    },
    {
      id: 159,
      lobId: 27,
      parentId: 47,
      processName: '调度策略',
      description: '',
      tableCnt: 2,
      hierarchy: 0,
      x: -650.75,
      y: -3234.6953125
    },
    {
      id: 160,
      lobId: 27,
      parentId: 47,
      processName: '驻点调度',
      description: '',
      tableCnt: 2,
      hierarchy: 0,
      x: -650.75,
      y: -3144.6953125
    },
    {
      id: 161,
      lobId: 27,
      parentId: 7,
      processName: '结算配置',
      description: '',
      tableCnt: 20,
      hierarchy: 0,
      x: -650.75,
      y: -4404.6953125
    },
    {
      id: 162,
      lobId: 27,
      parentId: 3,
      processName: '商家分成比例',
      description: '',
      tableCnt: 4,
      hierarchy: 1,
      x: -420.75,
      y: -4674.6953125
    },
    {
      id: 163,
      lobId: 27,
      parentId: 61,
      processName: '爆单配置',
      description: '',
      tableCnt: 4,
      hierarchy: 1,
      x: -420.75,
      y: -3144.6953125
    },
    {
      id: 164,
      lobId: 27,
      parentId: 61,
      processName: '爆单动作',
      description: '',
      tableCnt: 5,
      hierarchy: 2,
      x: -190.75,
      y: -3144.6953125
    },
    {
      id: 165,
      lobId: 27,
      parentId: 30,
      processName: '流量访问',
      description:
        '记录用户行为的数据即流量数据，用户行为数据通过埋点来上报。一条上报数据是用户一次操作行为，例如用户进入了某个页面、看到了什么模块、点击了什么按钮',
      tableCnt: 28,
      hierarchy: 0,
      x: -650.75,
      y: -4224.6953125
    },
    {
      id: 166,
      lobId: 27,
      parentId: 22,
      processName: '商家推单',
      description: '',
      tableCnt: 0,
      hierarchy: 3,
      x: 39.25,
      y: -4314.6953125
    },
    {
      id: 167,
      lobId: 27,
      parentId: 22,
      processName: '商家接单',
      description: '',
      tableCnt: 0,
      hierarchy: 2,
      x: -190.75,
      y: -4342.1953125
    },
    {
      id: 168,
      lobId: 27,
      parentId: 22,
      processName: '订单取消',
      description: '',
      tableCnt: 0,
      hierarchy: 4,
      x: 269.25,
      y: -4349.6953125
    },
    {
      id: 169,
      lobId: 27,
      parentId: 61,
      processName: '爆单完成',
      description: '',
      tableCnt: 4,
      hierarchy: 3,
      x: 39.25,
      y: -3144.6953125
    },
    {
      id: 170,
      lobId: 27,
      parentId: 3,
      processName: '商家营业',
      description: '',
      tableCnt: 16,
      hierarchy: 1,
      x: -420.75,
      y: -4404.6953125
    },
    {
      id: 171,
      lobId: 27,
      parentId: 3,
      processName: '商家在线',
      description: '',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -4404.6953125
    },
    {
      id: 172,
      lobId: 27,
      parentId: 43,
      processName: '骑手招募',
      description: '',
      tableCnt: 24,
      hierarchy: 0,
      x: -650.75,
      y: -3574.6953125
    },
    {
      id: 173,
      lobId: 27,
      parentId: 43,
      processName: '骑手注册',
      description: '',
      tableCnt: 8,
      hierarchy: 1,
      x: -420.75,
      y: -3619.6953125
    },
    {
      id: 174,
      lobId: 27,
      parentId: 43,
      processName: '骑手在职',
      description: '',
      tableCnt: 35,
      hierarchy: 2,
      x: -190.75,
      y: -3684.6953125
    },
    {
      id: 175,
      lobId: 27,
      parentId: 43,
      processName: '骑手在岗',
      description:
        '骑手工作期间的有单、工作模式、速度、距离等相关信息的描述和刻画',
      tableCnt: 19,
      hierarchy: 2,
      x: -190.75,
      y: -3304.6953125
    },
    {
      id: 176,
      lobId: 27,
      parentId: 43,
      processName: '骑手培训',
      description: '',
      tableCnt: 6,
      hierarchy: 3,
      x: 39.25,
      y: -3484.6953125
    },
    {
      id: 177,
      lobId: 27,
      parentId: 43,
      processName: '骑手评级',
      description: '',
      tableCnt: 19,
      hierarchy: 3,
      x: 39.25,
      y: -3394.6953125
    },
    {
      id: 178,
      lobId: 27,
      parentId: 43,
      processName: '运力报名(已废弃)',
      description: '',
      tableCnt: 14,
      hierarchy: 3,
      x: 39.25,
      y: -3774.6953125
    },
    {
      id: 179,
      lobId: 27,
      parentId: 43,
      processName: '运力签约(已废弃)',
      description: '',
      tableCnt: 5,
      hierarchy: 4,
      x: 269.25,
      y: -3774.6953125
    },
    {
      id: 180,
      lobId: 27,
      parentId: 52,
      processName: '骑手出勤',
      description: '骑手出勤',
      tableCnt: 24,
      hierarchy: 1,
      x: -420.75,
      y: -3054.6953125
    },
    {
      id: 181,
      lobId: 27,
      parentId: 52,
      processName: '骑手开收工',
      description: '',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -3324.6953125
    },
    {
      id: 182,
      lobId: 27,
      parentId: 52,
      processName: '骑手忙碌',
      description: '',
      tableCnt: 1,
      hierarchy: 0,
      x: -650.75,
      y: -3234.6953125
    },
    {
      id: 183,
      lobId: 27,
      parentId: 52,
      processName: '骑手拉黑',
      description: '',
      tableCnt: 8,
      hierarchy: 0,
      x: -650.75,
      y: -3144.6953125
    },
    {
      id: 184,
      lobId: 27,
      parentId: 34,
      processName: '用户评价',
      description: '顾客对骑手、商家的评价',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -4134.6953125
    },
    {
      id: 185,
      lobId: 27,
      parentId: 34,
      processName: '商家评价',
      description: '商家对顾客、骑手的评价',
      tableCnt: 2,
      hierarchy: 0,
      x: -650.75,
      y: -4044.6953125
    },
    {
      id: 186,
      lobId: 27,
      parentId: 34,
      processName: '骑手评价',
      description: '骑手对商家、顾客的评价',
      tableCnt: 4,
      hierarchy: 0,
      x: -650.75,
      y: -3954.6953125
    },
    {
      id: 187,
      lobId: 27,
      parentId: 16,
      processName: '承运单调度',
      description: '',
      tableCnt: 1,
      hierarchy: 2,
      x: -190.75,
      y: -4262.1953125
    },
    {
      id: 188,
      lobId: 27,
      parentId: 16,
      processName: '承运单接单',
      description: '',
      tableCnt: 2,
      hierarchy: 3,
      x: 39.25,
      y: -4289.6953125
    },
    {
      id: 189,
      lobId: 27,
      parentId: 16,
      processName: '承运单取货',
      description: '',
      tableCnt: 1,
      hierarchy: 5,
      x: 499.25,
      y: -4237.1953125
    },
    {
      id: 190,
      lobId: 27,
      parentId: 16,
      processName: '承运单取消',
      description: '指承运单送达前取消',
      tableCnt: 3,
      hierarchy: 8,
      x: 1189.25,
      y: -4159.6953125
    },
    {
      id: 191,
      lobId: 27,
      parentId: 43,
      processName: '骑手排班(废弃)',
      description: '骑手排班',
      tableCnt: 13,
      hierarchy: 0,
      x: -650.75,
      y: -3484.6953125
    },
    {
      id: 192,
      lobId: 27,
      parentId: 49,
      processName: '配送区域划分',
      description: '',
      tableCnt: 13,
      hierarchy: 0,
      x: -650.75,
      y: -3594.6953125
    },
    {
      id: 193,
      lobId: 27,
      parentId: 16,
      processName: '物流单创建',
      description: '',
      tableCnt: 16,
      hierarchy: 0,
      x: -650.75,
      y: -4372.1953125
    },
    {
      id: 194,
      lobId: 27,
      parentId: 16,
      processName: '物流单取货',
      description: '',
      tableCnt: 0,
      hierarchy: 6,
      x: 729.25,
      y: -4182.1953125
    },
    {
      id: 195,
      lobId: 27,
      parentId: 16,
      processName: '物流单送达',
      description: '',
      tableCnt: 5,
      hierarchy: 8,
      x: 1189.25,
      y: -4069.6953125
    },
    {
      id: 196,
      lobId: 27,
      parentId: 16,
      processName: '物流单取消',
      description: '',
      tableCnt: 0,
      hierarchy: 9,
      x: 1419.25,
      y: -4262.1953125
    },
    {
      id: 197,
      lobId: 27,
      parentId: 34,
      processName: '用户投诉',
      description: '用户对商家、顾客的评价',
      tableCnt: 2,
      hierarchy: 0,
      x: -650.75,
      y: -3864.6953125
    },
    {
      id: 198,
      lobId: 27,
      parentId: 34,
      processName: '骑手投诉',
      description: '骑手的投诉',
      tableCnt: 2,
      hierarchy: 0,
      x: -650.75,
      y: -3774.6953125
    },
    {
      id: 199,
      lobId: 27,
      parentId: 34,
      processName: '商家投诉',
      description: '商家的投诉',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -3684.6953125
    },
    {
      id: 200,
      lobId: 27,
      parentId: 16,
      processName: '作业单入库',
      description: '',
      tableCnt: 3,
      hierarchy: 0,
      x: -650.75,
      y: -4529.6953125
    },
    {
      id: 201,
      lobId: 27,
      parentId: 16,
      processName: '作业单装箱',
      description: '',
      tableCnt: 0,
      hierarchy: 1,
      x: -420.75,
      y: -4557.1953125
    },
    {
      id: 202,
      lobId: 27,
      parentId: 16,
      processName: '作业单移出',
      description: '',
      tableCnt: 0,
      hierarchy: 4,
      x: 269.25,
      y: -4584.6953125
    },
    {
      id: 203,
      lobId: 27,
      parentId: 16,
      processName: '作业单封箱',
      description: '',
      tableCnt: 1,
      hierarchy: 2,
      x: -190.75,
      y: -4529.6953125
    },
    {
      id: 204,
      lobId: 27,
      parentId: 16,
      processName: ' 作业单解封',
      description: '',
      tableCnt: 1,
      hierarchy: 3,
      x: 39.25,
      y: -4539.6953125
    },
    {
      id: 205,
      lobId: 27,
      parentId: 16,
      processName: '作业单出库',
      description: '',
      tableCnt: 0,
      hierarchy: 5,
      x: 499.25,
      y: -4484.6953125
    },
    {
      id: 206,
      lobId: 27,
      parentId: 7,
      processName: '费用清分记账',
      description: '各项费用的清分和记账过程',
      tableCnt: 0,
      hierarchy: 1,
      x: -420.75,
      y: -4404.6953125
    },
    {
      id: 207,
      lobId: 27,
      parentId: 7,
      processName: '费率测算',
      description: '',
      tableCnt: 18,
      hierarchy: 0,
      x: -650.75,
      y: -4314.6953125
    },
    {
      id: 208,
      lobId: 27,
      parentId: 7,
      processName: '定价规则配置',
      description: '',
      tableCnt: 8,
      hierarchy: 1,
      x: -420.75,
      y: -4314.6953125
    },
    {
      id: 209,
      lobId: 27,
      parentId: 11,
      processName: '活动创建',
      description: '',
      tableCnt: 24,
      hierarchy: 0,
      x: -650.75,
      y: -4674.6953125
    },
    {
      id: 210,
      lobId: 27,
      parentId: 11,
      processName: '活动参与',
      description: '',
      tableCnt: 7,
      hierarchy: 0,
      x: -650.75,
      y: -4584.6953125
    },
    {
      id: 211,
      lobId: 27,
      parentId: 11,
      processName: '活动完成',
      description: '',
      tableCnt: 5,
      hierarchy: 0,
      x: -650.75,
      y: -4494.6953125
    },
    {
      id: 212,
      lobId: 27,
      parentId: 11,
      processName: '试验创建',
      description: '',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -4404.6953125
    },
    {
      id: 213,
      lobId: 27,
      parentId: 11,
      processName: '活动触达',
      description: '',
      tableCnt: 2,
      hierarchy: 0,
      x: -650.75,
      y: -4314.6953125
    },
    {
      id: 214,
      lobId: 27,
      parentId: 11,
      processName: '活动参照',
      description: '',
      tableCnt: 1,
      hierarchy: 0,
      x: -650.75,
      y: -4224.6953125
    },
    {
      id: 215,
      lobId: 27,
      parentId: 11,
      processName: '活动开始',
      description: '',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -4134.6953125
    },
    {
      id: 216,
      lobId: 27,
      parentId: 43,
      processName: '骑手绑定分配站点',
      description: 'https://km.sankuai.com/page/189998191',
      tableCnt: 3,
      hierarchy: 3,
      x: 39.25,
      y: -3684.6953125
    },
    {
      id: 217,
      lobId: 27,
      parentId: 52,
      processName: '骑手排班',
      description: '骑手排班',
      tableCnt: 6,
      hierarchy: 0,
      x: -650.75,
      y: -3054.6953125
    },
    {
      id: 218,
      lobId: 27,
      parentId: 22,
      processName: '骑手商城下单',
      description: '',
      tableCnt: 1,
      hierarchy: 0,
      x: -650.75,
      y: -4307.1953125
    },
    {
      id: 219,
      lobId: 27,
      parentId: 3,
      processName: '商城商家入驻',
      description: '',
      tableCnt: 3,
      hierarchy: 0,
      x: -650.75,
      y: -4314.6953125
    },
    {
      id: 220,
      lobId: 27,
      parentId: 27,
      processName: '商品SPU在架',
      description: '',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -4314.6953125
    },
    {
      id: 221,
      lobId: 27,
      parentId: 27,
      processName: '商品SKU在架',
      description: '',
      tableCnt: 1,
      hierarchy: 0,
      x: -650.75,
      y: -4224.6953125
    },
    {
      id: 222,
      lobId: 27,
      parentId: 27,
      processName: '商品库存',
      description: '',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -4134.6953125
    },
    {
      id: 223,
      lobId: 27,
      parentId: 52,
      processName: '安全理赔',
      description: '',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -2964.6953125
    },
    {
      id: 224,
      lobId: 27,
      parentId: 52,
      processName: '安全事故',
      description: '',
      tableCnt: 7,
      hierarchy: 0,
      x: -650.75,
      y: -2874.6953125
    },
    {
      id: 225,
      lobId: 27,
      parentId: 52,
      processName: '安全管控',
      description: '',
      tableCnt: 3,
      hierarchy: 0,
      x: -650.75,
      y: -2784.6953125
    },
    {
      id: 226,
      lobId: 27,
      parentId: 16,
      processName: '承运单拒绝',
      description: '运单在派单时，骑手会拒绝派单',
      tableCnt: 0,
      hierarchy: 1,
      x: -420.75,
      y: -4364.6953125
    },
    {
      id: 227,
      lobId: 27,
      parentId: 16,
      processName: '承运单送达后取消',
      description:
        '运单送达之后，用户或者商家等发起的取消，此时不会更新运单的状态，但是会对运单做标记。',
      tableCnt: 1,
      hierarchy: 8,
      x: 1189.25,
      y: -3979.6953125
    },
    {
      id: 228,
      lobId: 27,
      parentId: 24,
      processName: '快照表',
      description: '',
      tableCnt: 53,
      hierarchy: 0,
      x: -650.75,
      y: -4404.6953125
    },
    {
      id: 229,
      lobId: 27,
      parentId: 24,
      processName: '临时表',
      description: '',
      tableCnt: 2,
      hierarchy: 0,
      x: -650.75,
      y: -4314.6953125
    },
    {
      id: 230,
      lobId: 27,
      parentId: 24,
      processName: '应用表',
      description: '',
      tableCnt: 8,
      hierarchy: 0,
      x: -650.75,
      y: -4224.6953125
    },
    {
      id: 231,
      lobId: 27,
      parentId: 43,
      processName: '骑手工单',
      description: '骑手与客服沟通时产生的工单相关数据信息',
      tableCnt: 3,
      hierarchy: 3,
      x: 39.25,
      y: -3304.6953125
    },
    {
      id: 232,
      lobId: 27,
      parentId: 43,
      processName: '骑手站长运营',
      description: '站长日常对骑手的运营动作过程',
      tableCnt: 4,
      hierarchy: 3,
      x: 39.25,
      y: -3594.6953125
    },
    {
      id: 233,
      lobId: 27,
      parentId: 43,
      processName: '骑手问卷',
      description: '骑手问卷及问卷回复相关的过程信息',
      tableCnt: 3,
      hierarchy: 3,
      x: 39.25,
      y: -3214.6953125
    },
    {
      id: 234,
      lobId: 27,
      parentId: 7,
      processName: '盈亏分摊',
      description: '',
      tableCnt: 0,
      hierarchy: 3,
      x: 39.25,
      y: -4359.6953125
    },
    {
      id: 235,
      lobId: 27,
      parentId: 43,
      processName: '骑手离职',
      description: '',
      tableCnt: 4,
      hierarchy: 4,
      x: 269.25,
      y: -3332.1953125
    },
    {
      id: 236,
      lobId: 27,
      parentId: 49,
      processName: '站点绑定区域',
      description:
        '配送站根据业务类型绑定对应的配送区域，一个站点只能绑定一个配送区域，一个配送区域可以有多个站点(一区多站)',
      tableCnt: 0,
      hierarchy: 1,
      x: -420.75,
      y: -3594.6953125
    },
    {
      id: 237,
      lobId: 27,
      parentId: 16,
      processName: '承运单到达取货点',
      description: '骑手接单后，到达取货点',
      tableCnt: 0,
      hierarchy: 4,
      x: 269.25,
      y: -4237.1953125
    },
    {
      id: 238,
      lobId: 27,
      parentId: 3,
      processName: '一体化商家入驻客户中心',
      description: '外卖商家和配送协同一体化企客业务',
      tableCnt: 6,
      hierarchy: 0,
      x: -650.75,
      y: -4224.6953125
    },
    {
      id: 239,
      lobId: 27,
      parentId: 7,
      processName: '提现支付',
      description: '',
      tableCnt: 0,
      hierarchy: 3,
      x: 39.25,
      y: -4269.6953125
    },
    {
      id: 240,
      lobId: 27,
      parentId: 43,
      processName: '骑手等级',
      description: '',
      tableCnt: 29,
      hierarchy: 2,
      x: -190.75,
      y: -3214.6953125
    },
    {
      id: 241,
      lobId: 27,
      parentId: 56,
      processName: '站点状态',
      description: '',
      tableCnt: 11,
      hierarchy: 0,
      x: -650.75,
      y: -3324.6953125
    },
    {
      id: 242,
      lobId: 27,
      parentId: 56,
      processName: '城市状态',
      description: '',
      tableCnt: 2,
      hierarchy: 0,
      x: -650.75,
      y: -3234.6953125
    },
    {
      id: 243,
      lobId: 27,
      parentId: 3,
      processName: '客户合同生效',
      description: '',
      tableCnt: 28,
      hierarchy: 1,
      x: -420.75,
      y: -4584.6953125
    },
    {
      id: 244,
      lobId: 27,
      parentId: 3,
      processName: '解约配送服务',
      description: '',
      tableCnt: 0,
      hierarchy: 1,
      x: -420.75,
      y: -4494.6953125
    },
    {
      id: 245,
      lobId: 27,
      parentId: 44,
      processName: '线索',
      description: '',
      tableCnt: 5,
      hierarchy: 0,
      x: -650.75,
      y: -3774.6953125
    },
    {
      id: 246,
      lobId: 27,
      parentId: 44,
      processName: '拜访',
      description: '',
      tableCnt: 3,
      hierarchy: 0,
      x: -650.75,
      y: -3684.6953125
    },
    {
      id: 247,
      lobId: 27,
      parentId: 35,
      processName: '餐损判责完成',
      description: '',
      tableCnt: 3,
      hierarchy: 0,
      x: -650.75,
      y: -3954.6953125
    },
    {
      id: 248,
      lobId: 27,
      parentId: 44,
      processName: '商机',
      description: '',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -3594.6953125
    },
    {
      id: 249,
      lobId: 27,
      parentId: 3,
      processName: '商家交易',
      description: '',
      tableCnt: 2,
      hierarchy: 0,
      x: -650.75,
      y: -4134.6953125
    },
    {
      id: 250,
      lobId: 27,
      parentId: 57,
      processName: '取餐柜',
      description: '',
      tableCnt: 8,
      hierarchy: 1,
      x: -420.75,
      y: -2874.6953125
    },
    {
      id: 251,
      lobId: 27,
      parentId: 44,
      processName: '预客户',
      description: '',
      tableCnt: 4,
      hierarchy: 0,
      x: -650.75,
      y: -3504.6953125
    },
    {
      id: 252,
      lobId: 27,
      parentId: 43,
      processName: '骑手报备',
      description: '',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -3394.6953125
    },
    {
      id: 253,
      lobId: 27,
      parentId: 43,
      processName: '骑手异常上报',
      description: '',
      tableCnt: 1,
      hierarchy: 0,
      x: -650.75,
      y: -3304.6953125
    },
    {
      id: 254,
      lobId: 27,
      parentId: 6,
      processName: '测试过滤配置',
      description: '',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -4854.6953125
    },
    {
      id: 255,
      lobId: 27,
      parentId: 56,
      processName: '站点早会',
      description: '站点早会的管理，涉及消毒环节和骑手形象装备',
      tableCnt: 1,
      hierarchy: 0,
      x: -650.75,
      y: -3144.6953125
    },
    {
      id: 256,
      lobId: 27,
      parentId: 3,
      processName: '用户会话发起',
      description: '骑手商城用户会话发起',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -4044.6953125
    },
    {
      id: 257,
      lobId: 27,
      parentId: 3,
      processName: '商家会话回复',
      description: '骑手商城商家会话回复',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -3954.6953125
    },
    {
      id: 258,
      lobId: 27,
      parentId: 6,
      processName: '骑手画像标签计算',
      description: '',
      tableCnt: 2,
      hierarchy: 0,
      x: -650.75,
      y: -4764.6953125
    },
    {
      id: 259,
      lobId: 27,
      parentId: 11,
      processName: '优惠券使用',
      description: '优惠券使用',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -4044.6953125
    },
    {
      id: 260,
      lobId: 27,
      parentId: 11,
      processName: '优惠券领取',
      description: '优惠券领取',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -3954.6953125
    },
    {
      id: 261,
      lobId: 27,
      parentId: 57,
      processName: '外卖柜用户取餐',
      description: '外卖柜用户取餐',
      tableCnt: 6,
      hierarchy: 0,
      x: -650.75,
      y: -2784.6953125
    },
    {
      id: 349,
      lobId: 27,
      parentId: 57,
      processName: '外卖柜订单售后',
      description: '外卖柜订单售后，赔付和客诉记录',
      tableCnt: 3,
      hierarchy: 0,
      x: -650.75,
      y: -2694.6953125
    },
    {
      id: 351,
      lobId: 27,
      parentId: 11,
      processName: '优惠券配置',
      description: '优惠券信息配置',
      tableCnt: 2,
      hierarchy: 0,
      x: -650.75,
      y: -3864.6953125
    },
    {
      id: 354,
      lobId: 27,
      parentId: 57,
      processName: '外卖柜骑手存餐',
      description: '',
      tableCnt: 6,
      hierarchy: 0,
      x: -650.75,
      y: -2604.6953125
    },
    {
      id: 357,
      lobId: 27,
      parentId: 57,
      processName: '智能头盔蓝牙周期上报',
      description: 'IoT头盔实时数据-蓝牙周期上报数据',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -2514.6953125
    },
    {
      id: 358,
      lobId: 27,
      parentId: 57,
      processName: '智能头盔蓝牙实时上报',
      description: 'IoT头盔实时数据-蓝牙实时上报数据',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -2424.6953125
    },
    {
      id: 359,
      lobId: 27,
      parentId: 57,
      processName: 'SIM卡当前状态周期上报',
      description: 'IoT头盔实时数据-SIM(NB)卡当前状态周期上报数据',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -2334.6953125
    },
    {
      id: 360,
      lobId: 27,
      parentId: 57,
      processName: '智能头盔SIM卡事件上报',
      description: 'IoT头盔实时数据-SIM(NB)卡事件上报数据',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -2244.6953125
    },
    {
      id: 361,
      lobId: 27,
      parentId: 57,
      processName: '智能头盔SIM卡戴盔计算结果上报',
      description: 'IoT头盔实时数据-SIM(NB)卡戴盔计算结果上报数据',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -2154.6953125
    },
    {
      id: 362,
      lobId: 27,
      parentId: 57,
      processName: '出餐宝订单出餐',
      description: '出餐宝订单出餐，记录与出餐宝相关的门店、设备、订单数据',
      tableCnt: 6,
      hierarchy: 0,
      x: -650.75,
      y: -2064.6953125
    },
    {
      id: 377,
      lobId: 27,
      parentId: 57,
      processName: '换电柜',
      description: '智能硬件-换电柜',
      tableCnt: 17,
      hierarchy: 0,
      x: -650.75,
      y: -1974.6953125
    },
    {
      id: 378,
      lobId: 27,
      parentId: 57,
      processName: '出餐宝设备出库',
      description: '出餐宝设备出库',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: -1884.6953125
    },
    {
      id: 443,
      lobId: 27,
      parentId: 57,
      processName: '外卖柜销售',
      description: '外卖柜销售业务过层',
      tableCnt: 1,
      hierarchy: 0,
      x: -650.75,
      y: -1794.6953125
    },
    {
      id: 445,
      lobId: 27,
      parentId: 444,
      processName: '定价方案配置',
      description: '定价方案相关规则配置',
      tableCnt: 0,
      hierarchy: 0,
      x: -650.75,
      y: 5917.8046875
    }
  ],
  edges: [
    {
      preNodeId: 132,
      postNodeId: 133,
      edgeType: 2,
      fromNodeId: 132,
      toNodeId: 133,
      id: 'edge20'
    },
    {
      preNodeId: 132,
      postNodeId: 134,
      edgeType: 2,
      fromNodeId: 132,
      toNodeId: 134,
      id: 'edge21'
    },
    {
      preNodeId: 132,
      postNodeId: 158,
      edgeType: 2,
      fromNodeId: 132,
      toNodeId: 158,
      id: 'edge22'
    },
    {
      preNodeId: 132,
      postNodeId: 162,
      edgeType: 2,
      fromNodeId: 132,
      toNodeId: 162,
      id: 'edge23'
    },
    {
      preNodeId: 132,
      postNodeId: 243,
      edgeType: 2,
      fromNodeId: 132,
      toNodeId: 243,
      id: 'edge24'
    },
    {
      preNodeId: 132,
      postNodeId: 244,
      edgeType: 2,
      fromNodeId: 132,
      toNodeId: 244,
      id: 'edge25'
    },
    {
      preNodeId: 171,
      postNodeId: 170,
      edgeType: 2,
      fromNodeId: 171,
      toNodeId: 170,
      id: 'edge26'
    },
    {
      preNodeId: 158,
      postNodeId: 125,
      edgeType: 2,
      fromNodeId: 158,
      toNodeId: 125,
      id: 'edge27'
    },
    {
      preNodeId: 161,
      postNodeId: 206,
      edgeType: 2,
      fromNodeId: 161,
      toNodeId: 206,
      id: 'edge28'
    },
    {
      preNodeId: 207,
      postNodeId: 208,
      edgeType: 2,
      fromNodeId: 207,
      toNodeId: 208,
      id: 'edge29'
    },
    {
      preNodeId: 206,
      postNodeId: 136,
      edgeType: 2,
      fromNodeId: 206,
      toNodeId: 136,
      id: 'edge30'
    },
    {
      preNodeId: 206,
      postNodeId: 137,
      edgeType: 2,
      fromNodeId: 206,
      toNodeId: 137,
      id: 'edge31'
    },
    {
      preNodeId: 206,
      postNodeId: 138,
      edgeType: 2,
      fromNodeId: 206,
      toNodeId: 138,
      id: 'edge32'
    },
    {
      preNodeId: 136,
      postNodeId: 150,
      edgeType: 2,
      fromNodeId: 136,
      toNodeId: 150,
      id: 'edge33'
    },
    {
      preNodeId: 136,
      postNodeId: 152,
      edgeType: 2,
      fromNodeId: 136,
      toNodeId: 152,
      id: 'edge34'
    },
    {
      preNodeId: 137,
      postNodeId: 150,
      edgeType: 2,
      fromNodeId: 137,
      toNodeId: 150,
      id: 'edge35'
    },
    {
      preNodeId: 137,
      postNodeId: 152,
      edgeType: 2,
      fromNodeId: 137,
      toNodeId: 152,
      id: 'edge36'
    },
    {
      preNodeId: 137,
      postNodeId: 234,
      edgeType: 2,
      fromNodeId: 137,
      toNodeId: 234,
      id: 'edge37'
    },
    {
      preNodeId: 137,
      postNodeId: 239,
      edgeType: 2,
      fromNodeId: 137,
      toNodeId: 239,
      id: 'edge38'
    },
    {
      preNodeId: 138,
      postNodeId: 150,
      edgeType: 2,
      fromNodeId: 138,
      toNodeId: 150,
      id: 'edge39'
    },
    {
      preNodeId: 138,
      postNodeId: 152,
      edgeType: 2,
      fromNodeId: 138,
      toNodeId: 152,
      id: 'edge40'
    },
    {
      preNodeId: 138,
      postNodeId: 234,
      edgeType: 2,
      fromNodeId: 138,
      toNodeId: 234,
      id: 'edge41'
    },
    {
      preNodeId: 150,
      postNodeId: 154,
      edgeType: 2,
      fromNodeId: 150,
      toNodeId: 154,
      id: 'edge42'
    },
    {
      preNodeId: 152,
      postNodeId: 151,
      edgeType: 2,
      fromNodeId: 152,
      toNodeId: 151,
      id: 'edge43'
    },
    {
      preNodeId: 152,
      postNodeId: 154,
      edgeType: 2,
      fromNodeId: 152,
      toNodeId: 154,
      id: 'edge44'
    },
    {
      preNodeId: 193,
      postNodeId: 196,
      edgeType: 2,
      fromNodeId: 193,
      toNodeId: 196,
      id: 'edge45'
    },
    {
      preNodeId: 193,
      postNodeId: 226,
      edgeType: 2,
      fromNodeId: 193,
      toNodeId: 226,
      id: 'edge46'
    },
    {
      preNodeId: 193,
      postNodeId: 124,
      edgeType: 2,
      fromNodeId: 193,
      toNodeId: 124,
      id: 'edge47'
    },
    {
      preNodeId: 200,
      postNodeId: 201,
      edgeType: 2,
      fromNodeId: 200,
      toNodeId: 201,
      id: 'edge48'
    },
    {
      preNodeId: 200,
      postNodeId: 205,
      edgeType: 2,
      fromNodeId: 200,
      toNodeId: 205,
      id: 'edge49'
    },
    {
      preNodeId: 124,
      postNodeId: 187,
      edgeType: 2,
      fromNodeId: 124,
      toNodeId: 187,
      id: 'edge50'
    },
    {
      preNodeId: 124,
      postNodeId: 190,
      edgeType: 2,
      fromNodeId: 124,
      toNodeId: 190,
      id: 'edge51'
    },
    {
      preNodeId: 201,
      postNodeId: 202,
      edgeType: 2,
      fromNodeId: 201,
      toNodeId: 202,
      id: 'edge52'
    },
    {
      preNodeId: 201,
      postNodeId: 203,
      edgeType: 2,
      fromNodeId: 201,
      toNodeId: 203,
      id: 'edge53'
    },
    {
      preNodeId: 187,
      postNodeId: 188,
      edgeType: 2,
      fromNodeId: 187,
      toNodeId: 188,
      id: 'edge54'
    },
    {
      preNodeId: 187,
      postNodeId: 190,
      edgeType: 2,
      fromNodeId: 187,
      toNodeId: 190,
      id: 'edge55'
    },
    {
      preNodeId: 203,
      postNodeId: 204,
      edgeType: 2,
      fromNodeId: 203,
      toNodeId: 204,
      id: 'edge56'
    },
    {
      preNodeId: 203,
      postNodeId: 205,
      edgeType: 2,
      fromNodeId: 203,
      toNodeId: 205,
      id: 'edge57'
    },
    {
      preNodeId: 188,
      postNodeId: 190,
      edgeType: 2,
      fromNodeId: 188,
      toNodeId: 190,
      id: 'edge58'
    },
    {
      preNodeId: 188,
      postNodeId: 237,
      edgeType: 2,
      fromNodeId: 188,
      toNodeId: 237,
      id: 'edge59'
    },
    {
      preNodeId: 204,
      postNodeId: 202,
      edgeType: 2,
      fromNodeId: 204,
      toNodeId: 202,
      id: 'edge60'
    },
    {
      preNodeId: 202,
      postNodeId: 205,
      edgeType: 2,
      fromNodeId: 202,
      toNodeId: 205,
      id: 'edge61'
    },
    {
      preNodeId: 237,
      postNodeId: 189,
      edgeType: 2,
      fromNodeId: 237,
      toNodeId: 189,
      id: 'edge62'
    },
    {
      preNodeId: 189,
      postNodeId: 190,
      edgeType: 2,
      fromNodeId: 189,
      toNodeId: 190,
      id: 'edge63'
    },
    {
      preNodeId: 189,
      postNodeId: 194,
      edgeType: 2,
      fromNodeId: 189,
      toNodeId: 194,
      id: 'edge64'
    },
    {
      preNodeId: 194,
      postNodeId: 196,
      edgeType: 2,
      fromNodeId: 194,
      toNodeId: 196,
      id: 'edge65'
    },
    {
      preNodeId: 194,
      postNodeId: 126,
      edgeType: 2,
      fromNodeId: 194,
      toNodeId: 126,
      id: 'edge66'
    },
    {
      preNodeId: 126,
      postNodeId: 190,
      edgeType: 2,
      fromNodeId: 126,
      toNodeId: 190,
      id: 'edge67'
    },
    {
      preNodeId: 126,
      postNodeId: 195,
      edgeType: 2,
      fromNodeId: 126,
      toNodeId: 195,
      id: 'edge68'
    },
    {
      preNodeId: 126,
      postNodeId: 227,
      edgeType: 2,
      fromNodeId: 126,
      toNodeId: 227,
      id: 'edge69'
    },
    {
      preNodeId: 195,
      postNodeId: 196,
      edgeType: 2,
      fromNodeId: 195,
      toNodeId: 196,
      id: 'edge70'
    },
    {
      preNodeId: 114,
      postNodeId: 168,
      edgeType: 2,
      fromNodeId: 114,
      toNodeId: 168,
      id: 'edge71'
    },
    {
      preNodeId: 114,
      postNodeId: 127,
      edgeType: 2,
      fromNodeId: 114,
      toNodeId: 127,
      id: 'edge72'
    },
    {
      preNodeId: 127,
      postNodeId: 128,
      edgeType: 2,
      fromNodeId: 127,
      toNodeId: 128,
      id: 'edge73'
    },
    {
      preNodeId: 127,
      postNodeId: 129,
      edgeType: 2,
      fromNodeId: 127,
      toNodeId: 129,
      id: 'edge74'
    },
    {
      preNodeId: 127,
      postNodeId: 167,
      edgeType: 2,
      fromNodeId: 127,
      toNodeId: 167,
      id: 'edge75'
    },
    {
      preNodeId: 127,
      postNodeId: 168,
      edgeType: 2,
      fromNodeId: 127,
      toNodeId: 168,
      id: 'edge76'
    },
    {
      preNodeId: 167,
      postNodeId: 128,
      edgeType: 2,
      fromNodeId: 167,
      toNodeId: 128,
      id: 'edge77'
    },
    {
      preNodeId: 167,
      postNodeId: 166,
      edgeType: 2,
      fromNodeId: 167,
      toNodeId: 166,
      id: 'edge78'
    },
    {
      preNodeId: 167,
      postNodeId: 168,
      edgeType: 2,
      fromNodeId: 167,
      toNodeId: 168,
      id: 'edge79'
    },
    {
      preNodeId: 166,
      postNodeId: 128,
      edgeType: 2,
      fromNodeId: 166,
      toNodeId: 128,
      id: 'edge80'
    },
    {
      preNodeId: 166,
      postNodeId: 168,
      edgeType: 2,
      fromNodeId: 166,
      toNodeId: 168,
      id: 'edge81'
    },
    {
      preNodeId: 165,
      postNodeId: 140,
      edgeType: 2,
      fromNodeId: 165,
      toNodeId: 140,
      id: 'edge82'
    },
    {
      preNodeId: 155,
      postNodeId: 143,
      edgeType: 2,
      fromNodeId: 155,
      toNodeId: 143,
      id: 'edge83'
    },
    {
      preNodeId: 143,
      postNodeId: 156,
      edgeType: 2,
      fromNodeId: 143,
      toNodeId: 156,
      id: 'edge84'
    },
    {
      preNodeId: 172,
      postNodeId: 131,
      edgeType: 2,
      fromNodeId: 172,
      toNodeId: 131,
      id: 'edge85'
    },
    {
      preNodeId: 172,
      postNodeId: 173,
      edgeType: 2,
      fromNodeId: 172,
      toNodeId: 173,
      id: 'edge86'
    },
    {
      preNodeId: 172,
      postNodeId: 120,
      edgeType: 2,
      fromNodeId: 172,
      toNodeId: 120,
      id: 'edge87'
    },
    {
      preNodeId: 120,
      postNodeId: 174,
      edgeType: 2,
      fromNodeId: 120,
      toNodeId: 174,
      id: 'edge88'
    },
    {
      preNodeId: 120,
      postNodeId: 175,
      edgeType: 2,
      fromNodeId: 120,
      toNodeId: 175,
      id: 'edge89'
    },
    {
      preNodeId: 120,
      postNodeId: 240,
      edgeType: 2,
      fromNodeId: 120,
      toNodeId: 240,
      id: 'edge90'
    },
    {
      preNodeId: 174,
      postNodeId: 130,
      edgeType: 2,
      fromNodeId: 174,
      toNodeId: 130,
      id: 'edge91'
    },
    {
      preNodeId: 174,
      postNodeId: 178,
      edgeType: 2,
      fromNodeId: 174,
      toNodeId: 178,
      id: 'edge92'
    },
    {
      preNodeId: 174,
      postNodeId: 216,
      edgeType: 2,
      fromNodeId: 174,
      toNodeId: 216,
      id: 'edge93'
    },
    {
      preNodeId: 174,
      postNodeId: 232,
      edgeType: 2,
      fromNodeId: 174,
      toNodeId: 232,
      id: 'edge94'
    },
    {
      preNodeId: 174,
      postNodeId: 235,
      edgeType: 2,
      fromNodeId: 174,
      toNodeId: 235,
      id: 'edge95'
    },
    {
      preNodeId: 175,
      postNodeId: 176,
      edgeType: 2,
      fromNodeId: 175,
      toNodeId: 176,
      id: 'edge96'
    },
    {
      preNodeId: 175,
      postNodeId: 177,
      edgeType: 2,
      fromNodeId: 175,
      toNodeId: 177,
      id: 'edge97'
    },
    {
      preNodeId: 175,
      postNodeId: 231,
      edgeType: 2,
      fromNodeId: 175,
      toNodeId: 231,
      id: 'edge98'
    },
    {
      preNodeId: 175,
      postNodeId: 233,
      edgeType: 2,
      fromNodeId: 175,
      toNodeId: 233,
      id: 'edge99'
    },
    {
      preNodeId: 175,
      postNodeId: 235,
      edgeType: 2,
      fromNodeId: 175,
      toNodeId: 235,
      id: 'edge100'
    },
    {
      preNodeId: 175,
      postNodeId: 122,
      edgeType: 2,
      fromNodeId: 175,
      toNodeId: 122,
      id: 'edge101'
    },
    {
      preNodeId: 122,
      postNodeId: 235,
      edgeType: 2,
      fromNodeId: 122,
      toNodeId: 235,
      id: 'edge102'
    },
    {
      preNodeId: 176,
      postNodeId: 235,
      edgeType: 2,
      fromNodeId: 176,
      toNodeId: 235,
      id: 'edge103'
    },
    {
      preNodeId: 177,
      postNodeId: 235,
      edgeType: 2,
      fromNodeId: 177,
      toNodeId: 235,
      id: 'edge104'
    },
    {
      preNodeId: 178,
      postNodeId: 179,
      edgeType: 2,
      fromNodeId: 178,
      toNodeId: 179,
      id: 'edge105'
    },
    {
      preNodeId: 231,
      postNodeId: 235,
      edgeType: 2,
      fromNodeId: 231,
      toNodeId: 235,
      id: 'edge106'
    },
    {
      preNodeId: 233,
      postNodeId: 235,
      edgeType: 2,
      fromNodeId: 233,
      toNodeId: 235,
      id: 'edge107'
    },
    {
      preNodeId: 192,
      postNodeId: 236,
      edgeType: 2,
      fromNodeId: 192,
      toNodeId: 236,
      id: 'edge108'
    },
    {
      preNodeId: 217,
      postNodeId: 180,
      edgeType: 2,
      fromNodeId: 217,
      toNodeId: 180,
      id: 'edge109'
    },
    {
      preNodeId: 141,
      postNodeId: 250,
      edgeType: 2,
      fromNodeId: 141,
      toNodeId: 250,
      id: 'edge110'
    },
    {
      preNodeId: 139,
      postNodeId: 163,
      edgeType: 2,
      fromNodeId: 139,
      toNodeId: 163,
      id: 'edge111'
    },
    {
      preNodeId: 163,
      postNodeId: 164,
      edgeType: 2,
      fromNodeId: 163,
      toNodeId: 164,
      id: 'edge112'
    },
    {
      preNodeId: 164,
      postNodeId: 169,
      edgeType: 2,
      fromNodeId: 164,
      toNodeId: 169,
      id: 'edge113'
    }
  ]
}
