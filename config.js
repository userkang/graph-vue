module.exports = {
  local: {
    apiDomain: 'http://wanxiang.data.test.sankuai.com',
    env: 'development',
    publicPath: ''
  },
  dev: {
    apiDomain: 'http://mlp.inf.dev.sankuai.com',
    env: 'production',
    publicPath: '//mlp.inf.dev.sankuai.com'
  },
  test: {
    apiDomain: 'http://wanxiang.data.test.sankuai.com',
    env: 'production',
    publicPath: '//mlp.data.test.sankuai.com'
  },
  staging: {
    apiDomain: '//wanxiang.data.st.sankuai.com',
    env: 'production',
    publicPath: '//mlp.data.st.sankuai.com'
  },
  online: {
    apiDomain: 'http://data.sankuai.com',
    env: 'production',
    publicPath: '//mlp.sankuai.com'
  }
}
