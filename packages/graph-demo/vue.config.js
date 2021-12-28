const HtmlWebpackPlugin = require('html-webpack-plugin')

const path = require('path')

const htmlPath = path.resolve(__dirname, './public/index.html')

// Talos 线上构建会注入 PUBLIC_URL 环境变量
const { PUBLIC_URL } = process.env

module.exports = {
  outputDir: path.resolve(__dirname, './build'),
  publicPath: process.env.NODE_ENV === 'production' ? PUBLIC_URL : './',
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'),
        data: `@import "@/assets/css/variable.scss";`,
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@datafe/graph-core': path.resolve(__dirname, '../graph-core/src'),
        '@datafe/graph-vue': path.resolve(__dirname, '../graph-vue'),
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: htmlPath,
        inject: true,
        publicPath: '',
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
    ],
  },
  devServer: {
    open: true,
    port: 9000,
    hot: true,
    disableHostCheck: true,
  },
}
