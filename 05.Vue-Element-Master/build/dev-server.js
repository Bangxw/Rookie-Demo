let config = require('../config')
if(!process.env.NODE_ENV) // NODE_ENV 环境变量 == local
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
let webpack = require('webpack')

let webpackConfig = require('./webpack.dev.conf')

let compiler = webpack(webpackConfig) // compiler 可以暴露钩子函数，以便注册和调用插件

let hotMiddleware = require('webpack-hot-middleware')(compiler) // 用来进行页面的热重载的
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', (compilation) => {
  compilation.plugin('html-webpack-plugin-after-emit', (data, callback) => {
    hotMiddleware.publish({
      action: 'reload'
    })
    callback()
  })
})