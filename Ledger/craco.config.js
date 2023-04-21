const path = require('path');
const cracoLessPlugin = require('craco-less');

const pathResolve = (pathUrl) => path.join(__dirname, pathUrl);
const WebpackBar = require('webpackbar');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  webpack: {
    alias: { // 支持webpack路径别名
      '@src': pathResolve('src'),
      '@i18n': pathResolve('src/i18n'),
      '@images': pathResolve('src/images'),
      '@pages': pathResolve('src/pages'),
      '@components': pathResolve('src/pages/components'),
      '@redux': pathResolve('src/redux'),
      '@styles': pathResolve('src/styles'),
      '@utils': pathResolve('src/utils'),
    },
    plugins: [
      new WebpackBar(),
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8888,
        openAnalyzer: true, // 构建完打开浏览器
        reportFilename: path.resolve(__dirname, 'analyzer/index.html'),
      }),
    ],
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
