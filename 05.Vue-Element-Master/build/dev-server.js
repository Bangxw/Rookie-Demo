let config = require('../config') // ../config/index.js
if (!process.env.NODE_ENV) // NODE_ENV 环境变量 == local
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
let path = require('path') // node核心路径模块
let express = require('express') // express.js
let webpack = require('webpack')
let opn = require('opn') // 自动用浏览器打开相应路径

let proxyMiddleware = require('http-proxy-middleware') // 设置代理，在A主机请求B主机服务
let webpackConfig = require('./webpack.dev.conf')

let compiler = webpack(webpackConfig) // compiler 可以暴露钩子函数，以便注册和调用插件

let devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

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

console.log("DEBUG 002) " + process.env.NODE_ENV)
switch (process.env.NODE_ENV) {
  case 'local':
    var proxypath = 'http://localhost:8001'; // 没有大括号作用域，变量提升
    break;
  case 'online':
    var proxypath = 'http://elm.cangdu.org';
    break;
  default:
    var proxypath = config.dev.proxypath
}

let port = process.env.PORT || config.dev.port
let context = config.dev.context
let server = express()
let options = {
  target: proxypath,
  changeOrigin: true
}

if (context.length) {
  server.use(proxyMiddleware(context, options))
}

// handle fallback for HTML5 history API
server.use(require('connect-history-api-fallback')())


// serve webpack bundle output
server.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
server.use(hotMiddleware)

// serve pure static assets - 纯静态资源
// The path.posix property provides access to POSIX specific implementations of the path methods.
let staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
server.use(staticPath, express.static('./static'))


module.exports = server.listen(port, (err) => {
  if (err) {
    console.log("DEBUG 003) " + err)
    return
  }

  let uri = 'http://localhost:' + port
  console.log('listen at ' + uri + '\n')

  // when env is testing, don't need open it
  if (process.env.NODE_ENV !== "testing") {
    opn(uri) // 在默认浏览器打开
  }
})