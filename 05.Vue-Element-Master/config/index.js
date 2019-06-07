let path = require('path')

console.log("DEBUG __dirname) " + __dirname) // 当前所在绝对路径

module.exports = {
  build: {
    env: {
      NODE_ENV: '"production"'  // 环境变量
    },
    index: path.resolve(__dirname, '../elm/index.htm'), // 返回绝对路径
    assetsRoot: path.resolve(__dirname, '../elm'),
    assetsSubDirectory: 'static', // elm子目录
    assetsPublicPath: '/elm/',
    productionSourceMap: true,
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: {
      NODE_ENV: '"development"'
    },
    port: 8008,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    context: [ //代理路径
      '/shopping/',
      '/ugc',
      '/v1',
      '/v2',
      '/v3',
      '/v4',
      '/bos',
      '/member',
      '/promotion',
      '/eus',
      '/paypi',
      '/img',
    ],
    proxypath: 'http://cangdu.org:8001',
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}