const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  entry: {
    main: path.resolve(__dirname, './main.ts')
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'lib'), // 出口目录
    library: 'graph-vue', // 包名
    libraryTarget: 'umd2'
  },
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // 将 JS 字符串生成为 style 节点
          'style-loader',
          // 将 CSS 转化成 CommonJS 模块
          'css-loader',
          // 将 Sass 编译成 CSS
          'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: [
          {
            loader: 'url-loader?limit=100000&mimetype=application/font-woff'
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.vue', '.json'],
    alias: {
      // '@datafe/graph-core': path.resolve(__dirname, '../../graph-core/src'),
      // vue: path.resolve(__dirname, './node_modules/vue-demi'),
      // '@datafe/graph-core': path.resolve(
      //   __dirname,
      //   './node_modules/@datafe/graph-core'
      // )
      // 'vue-demi': path.resolve(__dirname, './node_modules/vue-demi/')
    }
  },
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    }
  },
  plugins: [new VueLoaderPlugin()]
}
