const { defineConfig } = require('@nibfe/vuepress-theme-rome')
module.exports = defineConfig({
  title: 'mlp-graph',
  port: 9001,
  theme: '@nibfe/vuepress-theme-rome',
  description: '',
  ico: 'https://s0.meituan.net/mxx/dataplat-machine-learning/favicon.ico',
  navOnTheLeft: true,
  nav: [
    { text: 'Home', link: '/' },
    { text: 'Guide', link: '/guide/' }
  ]
})
