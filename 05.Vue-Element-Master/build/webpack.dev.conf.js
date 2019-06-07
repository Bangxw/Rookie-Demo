let config = require('../config')
let webpack = require('webpack')
let utils = require('./utils')
const baseWebpackConfig = require('./webpack.base.conf')
const htmlWebpackPlugin = require('html-webpack-plugin') // 生成一个自动引用打包后的js文件的html
const VueLoaderPlugin = require('vue-loader/lib/plugin')

/*
  通常会用process.env.NODE_ENV === "development"，并且在package.json中设置环境变量来进行判断，不过当文件大了或者页面需要判断的地方多了之后，配置文件就会充斥着大量三元表达式
  可以考虑用webpack-merge将配置文件拆分为3个文件，一个是webpack.common.js，即不管是生产环境还是开发环境都会用到的部分，以及webpack.product.js和webpack.dev.js, 并且使用webpack-merge来合并对象。
 */
let merge = require('webpack-merge')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach((name) => {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

console.log(config.dev.env.NODE_ENV)

// 合并webpack.base.conf 和 webpack.dev.conf
module.exports = merge(baseWebpackConfig, {
  // module.exports = {
  module: {
    rules: utils.styleLoaders({  // 与loaders的区别？
      sourceMap: config.dev.cssSourceMap
    })
  },
  // eval-source-map is faster for development
  devtool: '#eval-source-map',
  mode: 'development',
  plugins: [
    // 该插件帮助我们安心地使用环境变量
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    // Order the modules and chunks by occurrence. This saves space, because often referenced modules and chunks get smaller ids.
    // OccurenceOrderPlugin is needed for webpack 1.x only
    new webpack.optimize.OccurrenceOrderPlugin(),
    // Enables Hot Module Replacement, otherwise known as HMR.
    new webpack.HotModuleReplacementPlugin(),
    // Use NoErrorsPlugin for webpack 1.x
    new webpack.NoEmitOnErrorsPlugin(),
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      favicon: 'favicon.ico',
      inject: true
    }),
    new VueLoaderPlugin()
  ]
})