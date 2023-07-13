const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    main: path.resolve(__dirname, '../main.ts')
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'lib'), // 出口目录
    library: 'graph-vue', // 包名
    libraryTarget: 'umd',
    clean: true
  },
  optimization: {
    minimize: true
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
        options: {
          presets: ['@babel/preset-env']
        },
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
      '@datafe/graph-core': path.resolve(
        __dirname,
        './node_modules/@datafe/graph-core'
      ),
      '@datafe/vue-demi': path.resolve(
        __dirname,
        './node_modules/@datafe/vue-demi'
      )
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
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: '../components', to: 'components' },
        { from: '../types/main.d.ts', to: 'types/main.d.ts' },
        { from: '../utils', to: 'utils' }
      ]
    })
  ]
}
