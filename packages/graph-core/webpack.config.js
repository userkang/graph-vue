const webpack = require('webpack')
// eslint-disable-next-line prefer-destructuring
const resolve = require('path').resolve

module.exports = {
  entry: {
    core: './src/controller/graph.ts'
  },
  output: {
    filename: '[name].min.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: resolve(process.cwd(), 'dist/')
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ],
  devtool: 'source-map'
}
