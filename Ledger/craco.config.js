const path = require('path');
const cracoLessPlugin = require('craco-less');

const pathResolve = (pathUrl) => path.join(__dirname, pathUrl);

module.exports = {
  webpack: {
    alias: { // 支持webpack路径别名
      '@src': pathResolve('src'),
      '@i18n': pathResolve('src/i18n'),
      '@pages': pathResolve('src/pages'),
      '@components': pathResolve('src/pages/components'),
      '@redux': pathResolve('src/redux'),
      '@styles': pathResolve('src/styles'),
      '@utils': pathResolve('src/utils'),
    },
  },
  babel: {
    plugins: [
      // 实现antd按需加载
      ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }], // style设置为true即是less
    ],
  },
  plugins: [
    {
      plugin: cracoLessPlugin,
      options: {
        lessLoaderOptions: { // less-loader的版本不同会有不同的配置，详见 less-loader 官方文档
          lessOptions: {
            modifyVars: { },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};