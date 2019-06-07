let path = require('path')
let config = require('../config')
let utils = require('./utils')
let webpack = require('webpack')
let merge = require('webpack-merge')
let baseWebpackConfig = require('./webpack.base.conf')
let ExtractTextPlugin = require('extract-text-webpack-plugin') // 插件主要是为了抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象。
let HtmlWebpackPlugin = require('html-webpack-plugin')
let UglifyJsPlugin = require('uglifyjs-webpack-plugin')
let env = config.build.env // production

let webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap, // true
      extract: true
    })
  },
  output: {
    // 'E:\0x64\Code\Github\Rookie-Demo\05.Vue-Element-Master\elm'
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/[name].[chunkhash].min.js')
  },
  // vue: {
  //   loaders: utils.cssLoaders({
  //     sourceMap: config.build.productionSourceMap,
  //     extract: true
  //   })
  // },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // new webpack.optimize.UglifyJsPlugin({  // has removed
    //   compress: {
    //     warnings: false
    //   }
    // }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin(utils.assetsPath('css/[name].css')),
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      chunksSortMode: 'dependency'
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: function (module, count) {
    //     return (
    //       module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
    //     )
    //   }
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   chunks: ['vendor']
    // })
  ],
  optimization: { // 优化
    minimizer: [ // 压缩
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: false
        }
      })
    ],
    splitChunks: { // 代码分包
      name: 'vendor',
      minChunks: function (module, count) {
        return (
          module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
        )
      }
    },
    // splitChunks: { // 代码分包
    //   name: 'manifest',
    //   chunks: ['vendor']
    // }
  }
})

if (config.build.productionGzip) {
  let CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(' + config.build.productionGzipExtensions.join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

module.exports = webpackConfig