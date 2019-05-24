let path = require('path')
let config = require('../config')
let utils = require()

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
    extensions: ['', '.js', '.vue', '.less', '.css', '.scss'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    loaders: [{
      test: /\.vue$/,
      loaders: 'vue'
    }, {
      test: /\.js$/,
      loader: 'babel',
      include: projectRoot,
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.(png|jp?g|gif|svg)(\?.*)?$/,
      loader: 'url',
      query: {
        limit: 10000,
        name: utils.assetsPath('img/[name].[ext]')
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url',
      query: {
        limit: 10000,
        name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
      }
    }]
  },
  vue: {
    loaders: urils.cssLoaders({
      sourceMap: useCssSourceMap
    }),
    postcss: [
      require('autoprefixer')({
        browsers: ['last 10 versions']
      })
    ]
  }
}