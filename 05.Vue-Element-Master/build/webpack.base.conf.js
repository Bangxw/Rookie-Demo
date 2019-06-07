let path = require('path')
let config = require('../config') // config/index.js
let utils = require('./utils') // 自己封装node.js的常用工具类
let projectRoot = path.resolve(__dirname, '../')

console.log("DEBUG projectRoot) " + projectRoot)
let env = process.env.NODE_ENV
let cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap) //  && false
let cssSourceMapProd = (env === 'production' && config.build.productionSourceMap) // && true
let useCssSourceMap = cssSourceMapDev || cssSourceMapProd

console.log("DEBUG config.dev.assetsPublicPath) " + config.dev.assetsPublicPath)

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: { // 入口文件
    app: './src/main.js'
  },
  output: { // 输出
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    /** webpack版本升级：
     *·1. resolve.root, resolve.fallback, resolve.modulesDirectories这些选项被一个单独的选项 resolve.modules取代。
     * resolve.extensions此选项不再需要传一个空字符串
     */
    // extensions: ['', '.js', '.vue', '.less', '.css', '.scss'],
    extensions: ['.js', '.vue', '.less', '.css', '.scss'],
    // fallback: [path.join(__dirname, '../node_modules')],
    modules: [
      resolve('node_modules')
    ],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
  resolveLoader: {
    // fallback: [path.join(__dirname, '../node_modules')],
    modules: [
      resolve('node_modules')
    ]
  },
  module: {
    /** webpack版本升级：
      *·1. module.loaders 改为 module.rules
      * 2. 在引用 loader 时，不能再省略 -loader 后缀
      * 3. query改为options
      */
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      include: projectRoot,
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.(png|jp?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: utils.assetsPath('img/[name].[ext]')
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
      }
    }]
  },
  // vue: {
  //   rules: utils.cssLoaders({ // loaders报错，loaders换为rules
  //     sourceMap: useCssSourceMap
  //   }),
  //   postcss: [
  //     require('autoprefixer')({
  //       browsers: ['last 10 versions']
  //     })
  //   ]
  // }
}