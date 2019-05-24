let path = require('path')
let config = require('../config')
let ExtractTextPlugin =  require('extract-text-webpack-plugin')

exports.assetsPath = function() {
  let assetsSubDirectory = precess.env.NODE_ENV === 'production' ? config.build.assetsSubDirectory
}