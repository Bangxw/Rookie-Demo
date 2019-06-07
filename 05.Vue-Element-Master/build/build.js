require('shelljs/global')
env.NODE_ENV = 'production'

let path = require('path')
let config = require('../config')
let ora = require('ora') // 主要用来实现node.js命令行环境的loading效果，和显示各种状态的图标等
let webpack = require('webpack')
let webpackConfig = require('./webpack.prod.conf')

let spinner = ora('building for production...')
spinner.start()

let assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'static/*', assetsPath)

webpack(webpackConfig, function(err, stats) {
  spinner.stop()
  if(err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})