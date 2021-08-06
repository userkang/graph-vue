// const { defineConfig } = require('@nibfe/vuepress-theme-rome')
module.exports = {
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: 'https://s0.meituan.net/mxx/dataplat-machine-learning/favicon.ico'
      }
    ]
  ],
  title: 'graph-core',
  port: 9001,
  theme: '@nibfe/vuepress-theme-rome',
  description: 'Just playing around',
  themeConfig: {
    logo: 'https://s0.meituan.net/mxx/dataplat-machine-learning/favicon.ico',
    nav: [
      { text: '教程', link: '/guide/' },
      { text: 'API', link: '/config/graphCaseParams' },
      { text: '更新日志', link: '/update/' }
    ],
    sidebar: {
      '/guide/': [
        { title: '简介', path: '/guide/' },
        {
          title: '快速上手',
          path: '/guide/start/'
        },
        {
          title: 'FAQ',
          collapsable: true,
          sidebarDepth: 2,
          children: [{ title: '常见问题', path: '/guide/faq/' }]
        }
      ],
      '/config/': [
        {
          title: '配置指南',
          collapsable: false,
          sidebarDepth: 2,
          children: [
            {
              title: 'Graph 配置参数',
              path: '/config/graphCaseParams'
            },
            {
              title: 'Graph 实例方法',
              path: '/config/graphCaseMethods'
            },
            {
              title: '事件 Event',
              path: '/config/graphMethods'
            },
            {
              title: '类型声明',
              path: '/config/typeDeclare'
            }
          ]
        }
      ],
      '/update/': [{ title: '' }]
    },
    // smoothScroll: true,
    lastUpdated: 'Last Updated',
    markdown: {
      lineNumbers: true
    },
    displayAllHeaders: true, // 默认值：false
    activeHeaderLinks: false, // 默认值：true
    algolia: {
      apiKey: '<API_KEY>',
      indexName: '<INDEX_NAME>'
    },
    plugins: [
      [
        '@vuepress/search',
        {
          searchMaxSuggestions: 10
        }
      ],
      [
        '@vuepress/active-header-links',
        {
          sidebarLinkSelector: '.sidebar-link',
          headerAnchorSelector: '.header-anchor'
        }
      ]
    ],
    repo:
      'http://dev.sankuai.com/code/repo-detail/~zhangkangkang02/mlp-graph/file/list',
    repoLabel: '查看源码',
    serviceWorker: {
      updatePopup: true // Boolean | Object, 默认值是 undefined.
      // 如果设置为 true, 默认的文本配置将是:
      // updatePopup: {
      //   message: 'New content is available.',
      //   buttonText: 'Refresh'
      // }
    }
  }
}
