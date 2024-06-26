const HtmlWebpackPlugin = require('html-webpack-plugin')

const path = require('path')

const htmlPath = path.resolve(__dirname, './public/index.html')

// Talos 线上构建会注入 PUBLIC_URL 环境变量
const { PUBLIC_URL } = process.env

const extraAlias =
  process.env.NODE_ENV === 'development'
    ? {
        '@datafe/graph-core': path.resolve(__dirname, '../graph-core/src'),
        '@datafe/graph-vue': path.resolve(__dirname, '../graph-vue/main.ts'),
        '@datafe/vue-demi': path.resolve(
          __dirname,
          '../graph-vue/vue2/node_modules/@datafe/vue-demi'
        )
      }
    : {}

module.exports = {
  outputDir: path.resolve(__dirname, './build'),
  publicPath: process.env.NODE_ENV === 'production' ? PUBLIC_URL : './',
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'),
        data: `@import "@/assets/css/variable.scss";`
      }
    }
  },
  configureWebpack: {
    resolve: {
      symlinks: false,
      alias: {
        // https://github.com/LinusBorg/portal-vue/issues/201
        vue$: path.resolve(__dirname, 'node_modules/vue/dist/vue.esm.js'),
        ...extraAlias
      }
    },
    plugins: []
  },
  devServer: {
    open: true,
    port: 9000,
    hot: true
  }
}
