const path = require('path')
const pathResolve = pathurl => path.join(__dirname, pathurl)

const CracoLessPlugin = require('craco-less')

module.exports = {
  webpack: {
    alias: {
      '@': pathResolve('src'),
      '@pages': pathResolve('src/pages'),
      '@components': pathResolve('src/pages/components'),
      '@styles': pathResolve('src/styles'),
      '@redux': pathResolve('src/redux'),
      '@utils': pathResolve('src/utils'),
      '@i18n': pathResolve('src/i18n'),
    }
  },
  babel: {
    plugins: [
      // 实现antd按需加载
      ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }]  // style设置为true即是less
    ]
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {  // less-loader的版本不同会有不同的配置，详见 less-loader 官方文档
          lessOptions: {
            modifyVars: {},
            javascriptEnabled: true
          }
        },
      }
    }
  ],
  devServer: {
    port: 9528,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
}