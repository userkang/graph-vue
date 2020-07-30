const HtmlWebpackPlugin = require('html-webpack-plugin')

const path = require('path')
const env = process.env.CONFIG_ENV || 'local'

const config = require('./config')[env]
const htmlPath = path.resolve(__dirname, './public/index.html')

const PROXY_ORIGIN = process.env.VUE_APP_PROXY_ORIGIN

module.exports = {
  outputDir: path.resolve(__dirname, './dist'),
  publicPath: config.publicPath,
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'),
        data: `@import "@/assets/css/variable.scss";`
      }
    }
  },
  configureWebpack: {
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: htmlPath,
        inject: true,
        apiDomain: config.apiDomain,
        env: config.env,
        publicPath: config.publicPath,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency'
      })
    ]
  },
  devServer: {
    open: true,
    port: 8090,
    hot: true,
    disableHostCheck: true
  }
}
