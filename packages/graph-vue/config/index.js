module.exports = {
  env: {
    development: {
      apiDomain: 'http://wanxiang.data.test.sankuai.com',
      env: 'local',
      publicPath: ''
    },
    test: {
      apiDomain: 'http://wanxiang.data.test.sankuai.com',
      env: 'test',
      publicPath: '//mlp.data.test.sankuai.com'
    },
    staging: {
      apiDomain: '//wanxiang.data.st.sankuai.com',
      env: 'st',
      publicPath: '//mlp.data.st.sankuai.com'
    },
    production: {
      apiDomain: 'http://data.sankuai.com',
      env: 'prod',
      publicPath: '//mlp.sankuai.com'
    }
  }
}
