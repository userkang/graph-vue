const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const AnalyzeWebpackPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const path = require('path')
const env = process.env.CONFIG_ENV || 'local'
const isAnalyze = process.env.IS_ANALYZE
const config = require('./config')[env]
const htmlPath = path.resolve(__dirname, './public/index.html')
const morePlugins = isAnalyze ? [new AnalyzeWebpackPlugin()] : []

const PROXY_ORIGIN = process.env.VUE_APP_PROXY_ORIGIN

module.exports = {
  outputDir: path.resolve(__dirname, './dist'),
  publicPath: config.publicPath,
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'),
      },
    },
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
          removeAttributeQuotes: true,
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency',
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, './static/'),
          to: path.resolve(__dirname, './dist'),
          ignore: ['.*'],
        },
      ]),
      ...morePlugins,
    ],
  },
  devServer: {
    open: true,
    port: 8090,
    hot: true,
    disableHostCheck: true,
  },
}
