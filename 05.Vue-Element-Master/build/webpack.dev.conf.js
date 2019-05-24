let config = require('../config')
let webpack = require('webpack')
let baseWebpackConfig = require('./webpack.base.conf')
let htmlWebpackPlugin = require('html-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig).forEach((name) => {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = {
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
    })
  ]
}