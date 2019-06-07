let path = require('path')
let config = require('../config')
let ExtractTextPlugin = require('extract-text-webpack-plugin') //抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象

exports.assetsPath = function (_path) {
  // 'static' || '/'
  let assetsSubDirectory = process.env.NODE_ENV === 'production' ? config.build.assetsSubDirectory : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  // generate loader string to be used with extract text plugin
  function generateLoaders(loaders) {
    let sourceLoader = loaders.map(function (loader) {
      let extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?') // 判断有没有问号参数
        extraParamChar = '&' // css-loader？a&b
      } else {
        loader = loader + '-loader'
        extraParamChar = "?"
      }
      // console.log("DEBUG options.sourceMap) " + options.sourceMap, process.env.NODE_ENV)
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!')

    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
    } else {
      return ['vue-style-loader', sourceLoader].join('!')
    }
  }

  return {
    css: generateLoaders(['css']), // 'vue-style-loader!css-loader'
    postcss: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']), // vue-style-loader!css-loader'
    sass: generateLoaders(['css', 'sass?indentedSyntax']), // vue-style-loader!css-loader!sass-loader?indentedSyntax'
    stylus: generateLoaders(['css', 'stylus']), // 'vue-style-loader!stylus-loader'
    styl: generateLoaders(['css', 'stylus']) // 'vue-style-loader!css-loader!stylus-loader'
  }
}

exports.styleLoaders = function (options) {
  var output = []
  let loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    let loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'), loader: loader
    })
  }
  console.log('DEBUG styleLoaders)' + output)
  return output
}